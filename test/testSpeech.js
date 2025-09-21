// app.js
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { BlobServiceClient } from "@azure/storage-blob";
import { QueueClient } from "@azure/storage-queue";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import sdk from "microsoft-cognitiveservices-speech-sdk";
import { PassThrough } from "stream";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== Azure Blob Setup ==========
const account = process.env.AZURE_STORAGE_ACCOUNT;
const sasToken = process.env.AZURE_BLOB_SAS_TOKEN;
const containerName = "videos";

const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net/?${sasToken}`
);

// ========== Azure Queue Setup ==========
const queueClient = new QueueClient(
  process.env.AZURE_STORAGE_CONNECTION_STRING,
  "videoprocessing"
);

// ========== Azure Speech Setup ==========
const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.AZURE_SPEECH_KEY,
  process.env.AZURE_SPEECH_REGION
);
speechConfig.speechRecognitionLanguage = "en-US";

// ========== Gemini Setup ==========
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ========== Multer ==========
const upload = multer({ storage: multer.memoryStorage() });

// ========== Upload Endpoint ==========
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Blob
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({ access: "container" });

    const blobName = `${Date.now()}-${path.basename(req.file.originalname)}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer);
    const videoUrl = blockBlobClient.url;

    // Add to Queue
    await queueClient.createIfNotExists();
    await queueClient.sendMessage(videoUrl);

    res.json({ message: "✅ Video uploaded and queued", url: videoUrl });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ========== Queue Worker ==========
async function processQueue() {
  const messagesResponse = await queueClient.receiveMessages({
    numberOfMessages: 1,
  });
  if (!messagesResponse.receivedMessageItems.length) return;

  const message = messagesResponse.receivedMessageItems[0];
  const videoUrl = message.messageText;
  console.log(`📥 Processing video: ${videoUrl}`);

  try {
    const transcription = await transcribeFromUrl(videoUrl);
    console.log("📝 Transcription:", transcription);

    // Use Gemini to simplify for sign-language context
    const prompt = `
    Convert this spoken English transcript into a simplified, 
    sign-language-friendly version (short phrases, easy grammar).
    Transcript: ${transcription}
    `;
    const geminiResult = await model.generateContent(prompt);
    const simplified = geminiResult.response.text();

    console.log("🤟 Sign-Language Friendly Output:", simplified);

    // Clean up queue
    await queueClient.deleteMessage(message.messageId, message.popReceipt);
  } catch (err) {
    console.error("❌ Worker failed:", err);
  }
}

function transcribeFromUrl(videoUrl) {
  return new Promise((resolve, reject) => {
    const audioStream = sdk.AudioInputStream.createPushStream();
    const audioConfig = sdk.AudioConfig.fromStreamInput(audioStream);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    const ffmpegProcess = ffmpeg(videoUrl)
      .noVideo()
      .format("s16le")
      .audioFrequency(16000)
      .audioChannels(1)
      .on("error", reject)
      .pipe(new PassThrough());

    ffmpegProcess.on("data", (chunk) => audioStream.write(chunk));
    ffmpegProcess.on("end", () => audioStream.close());

    recognizer.recognizeOnceAsync((result) => {
      recognizer.close();
      if (result.reason === sdk.ResultReason.RecognizedSpeech) {
        resolve(result.text);
      } else {
        reject(result.errorDetails);
      }
    });
  });
}

// Background worker runs every 15s
setInterval(processQueue, 15000);

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);