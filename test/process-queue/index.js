module.exports = function(app) {
    app.queue('process-queue', {
        queueName: 'videoprocessing',
        connection: 'AzureWebJobsStorage',
        handler: (queueItem, context) => {
            context.log('Queue trigger function processed work item:', queueItem);
            const videoUrl = queueItem;
            context.log(`Received video for processing: ${videoUrl}`);

            // Processing logic was removed as requested.

            context.log('Processing complete.');
        }
    });
};