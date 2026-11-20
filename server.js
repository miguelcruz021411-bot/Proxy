const express = require('express');
const app = express();

const PASSWORD = process.env.PROXY_PASSWORD;

app.get('/', async (req, res) => {
  if (!PASSWORD || req.query.key !== PASSWORD) {
    return res.send('<form><input name="key" placeholder="password" type="password"><input name="url" placeholder="https://example.com" size="40"><button>Go</button></form>');
  }
  const url = req.query.url;
  if (!url) return res.send('Add &url=https://example.com to the address.');
  try {
    const r = await fetch(url);
    res.set('content-type', r.headers.get('content-type') || 'text/html');
    res.send(Buffer.from(await r.arrayBuffer()));
  } catch (e) {
    res.status(502).send('Failed: ' + e.message);
  }
});

app.listen(process.env.PORT || 3000);
