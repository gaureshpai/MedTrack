const { BlobServiceClient } = require("@azure/storage-blob");
const { QueueClient } = require("@azure/storage-queue");
const path = require("path");

const account = process.env.AZURE_STORAGE_ACCOUNT;
const sasToken = process.env.AZURE_BLOB_SAS_TOKEN;
const containerName = "videos";

const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net/?${sasToken}`
);

const queueConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const queueName = "videoprocessing";
const queueClient = new QueueClient(queueConnectionString, queueName);

module.exports = function(app) {
    app.http('upload', {
        methods: ['POST'],
        authLevel: 'anonymous',
        handler: async (request, context) => {
            context.log(`HTTP trigger function processed a request.`);

            try {
                const formData = await request.formData();
                const file = formData.get('video');

                if (!file) {
                    return { status: 400, jsonBody: { error: "No file named 'video' was uploaded." } };
                }

                const arrayBuffer = await file.arrayBuffer();
                const fileBuffer = Buffer.from(arrayBuffer);

                const containerClient = blobServiceClient.getContainerClient(containerName);
                await containerClient.createIfNotExists({ access: "container" });

                const blobName = `${Date.now()}-${path.basename(file.name)}`;
                const blockBlobClient = containerClient.getBlockBlobClient(blobName);

                await blockBlobClient.uploadData(fileBuffer);

                const videoUrl = blockBlobClient.url;

                await queueClient.createIfNotExists();
                await queueClient.sendMessage(videoUrl);

                return {
                    status: 200,
                    jsonBody: {
                        message: "✅ Video uploaded and queued",
                        url: videoUrl
                    }
                };

            } catch (err) {
                context.log({ error: err.message });
                return { status: 500, jsonBody: { error: err.message } };
            }
        }
    });
};