import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

// const audioFile = "./local_file.mp3";
const audioFile = './test file/music.mp3'

const params = {
  audio: audioFile,
  speech_model: "universal",
};

const run = async () => {
  const transcript = await client.transcripts.transcribe(params);

  console.log(transcript.text);
};

run();
