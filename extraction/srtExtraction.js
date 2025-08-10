//SRT extracter and parser to array of json
const fs = require('fs');
const filePath = './test file/Jurassic.World.Rebirth.2025.1080p.MA.WEB-DL.DDP5.1.Atmos.H.264 (SDH).srt';

fs.readFile(filePath, 'utf-8', (err, srtText) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    srtText = srtText.replace(/\r\n/g, '\n');
    let string = srtText.split('\n\n');
    
const entries = [];
let match;
string.forEach((item)=>{
    const regex = /(\d+)\n([\d:,]+)\s*-+>\s*([\d:,]+)(?:\n([\S\s]*))?/g;
    match = regex.exec(item);
    if(match === null){
        console.log(item)
        return;
    }
    const sequence = parseInt(match[1]);
    const start_time = match[2].trim();
    const end_time = match[3].trim();
    const caption = match[4]?.trim() || '';
    entries.push({ sequence, start_time, end_time, caption });
}) 
entries.forEach((item,index)=>{
    if((item.sequence-1)!==index){     
        console.log(item)
    }
})
 console.log(entries)

})


