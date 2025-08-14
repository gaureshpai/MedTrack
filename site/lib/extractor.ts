type srt = {
  sequence: number;
  start_time: string;
  end_time: string;
  caption: string;
};

export async function extractSrt(captionUrl: string): Promise<srt[]> {
  const response = await fetch(captionUrl);
  const inputSrt = await response.text();
  const srtString = inputSrt.replaceAll("\r", "").split("\n\n");
  console.log(srtString);

  return srtString
    .map((item) => {
      const regex = /(\d+)\n([\d:,]+)\s*-+>\s*([\d:,]+)(?:\n([\S\s]*))?/g;
      const match = regex.exec(item);
      if (match === null) {
        console.log("Invalid SRT format:", item);
        return;
      }
      const sequence = parseInt(match[1]);
      const start_time = match[2].trim();
      const end_time = match[3].trim();
      const caption = match[4]?.trim() || "";
      return { sequence, start_time, end_time, caption };
    })
    .filter((v) => v !== undefined);
}
