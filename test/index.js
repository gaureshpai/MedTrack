

const { app } = require('@azure/functions');

// Call the function definition modules and pass the shared app object
require('./upload/index.js')(app);
require('./process-queue/index.js')(app);
