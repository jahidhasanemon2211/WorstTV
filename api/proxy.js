export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req.query;

  if (!url) {
    res.status(400).json({ error: "Missing url parameter" });
    return;
  }

  try {
    const decodedUrl = decodeURIComponent(url);

    // Fetch the target stream resource
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'http://redforce.live/'
      }
    });

    if (!response.ok) {
      res.status(response.status).end();
      return;
    }

    const contentType = response.headers.get('content-type') || '';
    const isPlaylist = decodedUrl.includes('.m3u8') || contentType.includes('mpegurl') || contentType.includes('mpegURL') || contentType.includes('application/x-mpegurl');

    if (isPlaylist) {
      const text = await response.text();
      const parentUrlObj = new URL(decodedUrl);
      const lines = text.split('\n');

      const host = req.headers.host || 'worst-tv.vercel.app';
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const proxyBaseUrl = `${protocol}://${host}/api/proxy`;

      const rewrittenLines = lines.map(line => {
        const trimmed = line.trim();
        if (trimmed === '') return line;

        // Rewrite tags that contain URIs (e.g. #EXT-X-KEY:URI="...", #EXT-X-MEDIA:URI="...")
        if (trimmed.startsWith('#')) {
          return line.replace(/(URI=")(.*?)(")/g, (match, p1, p2, p3) => {
            try {
              const resolvedUrlObj = new URL(p2, parentUrlObj);
              if (!resolvedUrlObj.search) {
                resolvedUrlObj.search = parentUrlObj.search;
              }
              return `${p1}${proxyBaseUrl}?url=${encodeURIComponent(resolvedUrlObj.toString())}${p3}`;
            } catch (e) {
              return match;
            }
          });
        }

        // Rewrite media chunk or sub-playlist URLs
        try {
          const resolvedUrlObj = new URL(trimmed, parentUrlObj);
          if (!resolvedUrlObj.search) {
            resolvedUrlObj.search = parentUrlObj.search;
          }
          return `${proxyBaseUrl}?url=${encodeURIComponent(resolvedUrlObj.toString())}`;
        } catch (e) {
          return line;
        }
      });

      res.setHeader('Content-Type', 'application/x-mpegURL');
      res.status(200).send(rewrittenLines.join('\n'));
    } else {
      // Stream binary data (.ts video segments)
      res.setHeader('Content-Type', contentType || 'video/MP2T');
      
      const buffer = await response.arrayBuffer();
      res.status(200).send(Buffer.from(buffer));
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
