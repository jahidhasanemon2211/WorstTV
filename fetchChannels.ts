import fs from 'fs';

async function fetchChannels() {
  const res = await fetch('https://raw.githubusercontent.com/farhanhossien/Live-TV/main/src/channelsData.ts');
  const text = await res.text();
  fs.writeFileSync('src/channelsData.ts', text);
}

fetchChannels().catch(console.error);
