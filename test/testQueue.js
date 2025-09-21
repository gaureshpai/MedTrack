// testQueue.js
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { BlobServiceClient } from "@azure/storage-blob";
import { QueueClient } from "@azure/storage-queue";
import path from "path";

dotenv.config();

const app = express();
const PORT = 3000;

// Multer memory storage (no uploads/ folder on disk)
const upload = multer({ storage: multer.memoryStorage() });

const account = process.env.AZURE_STORAGE_ACCOUNT;
const sasToken = process.env.AZURE_BLOB_SAS_TOKEN;
const containerName = "videos";

const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net/?${sasToken}`
);

// Queue connection string (from Access Keys)
const queueConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const queueName = "videoprocessing";
const queueClient = new QueueClient(queueConnectionString, queueName);

app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 1. Upload to Azure Blob
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({ access: "container" });

    const blobName = `${Date.now()}-${path.basename(req.file.originalname)}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer);

    const videoUrl = blockBlobClient.url;

    // 2. Add message to Azure Queue
    await queueClient.createIfNotExists();
    await queueClient.sendMessage(videoUrl);

    res.json({
      message: "✅ Video uploaded and queued",
      url: videoUrl,
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
