import { BlobServiceClient } from "@azure/storage-blob";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const account = process.env.AZURE_STORAGE_ACCOUNT;
const sasToken = process.env.AZURE_BLOB_SAS_TOKEN;
const containerName = "videos";

async function uploadFile(filePath) {
  // Correctly form full service URL + SAS
  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net/?${sasToken}`
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists({ access: "container" });

  const blobName = path.basename(filePath);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadFile(filePath);

  console.log(`✅ Uploaded to: ${blockBlobClient.url}`);
  return blockBlobClient.url;
}

uploadFile("./public/test.mp4").catch(console.error);
