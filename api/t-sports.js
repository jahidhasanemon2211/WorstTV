export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const response = await fetch('http://redforce.live/player.php?stream=1', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'http://redforce.live/'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch player page: ${response.statusText}`);
    }

    const data = await response.text();
    const match = data.match(/var primarySource = '(.*?)';/);

    if (match && match[1]) {
      res.status(200).json({ url: match[1] });
    } else {
      res.status(500).json({ error: "Could not find stream URL in redforce player page" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
