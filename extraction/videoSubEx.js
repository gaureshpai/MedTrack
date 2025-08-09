// Extracting embeded Subtitles from an MP4 file or MKV
const {exec} = require('child_process');

const inputFile = './test file/Solo Leveling S2 - 09 [1080p] [Sub] [@Anime_Raven].mkv';
console.log(inputFile);
const outputFile='extractedSub.srt';

const command = `ffmpeg -i "${inputFile}" -map 0:s:0 "${outputFile}"`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});