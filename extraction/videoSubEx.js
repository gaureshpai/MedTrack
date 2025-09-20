// Extracting embeded Subtitles from an MP4 file or MKV
const { spawn } = require('child_process');

const inputFile = './test file/Solo Leveling S2 - 09 [1080p] [Sub] [@Anime_Raven].mkv';
console.log(inputFile);
const outputFile='extractedSub.srt';

const ffmpeg = spawn('ffmpeg', ['-i', inputFile, '-map', '0:s:0', outputFile]);

ffmpeg.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ffmpeg.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

ffmpeg.on('close', (code) => {
    if (code !== 0) {
        console.error(`FFmpeg process exited with code ${code}`);
    } else {
        console.log('Subtitle extraction completed successfully');
    }
});