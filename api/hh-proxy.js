export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  if (!path) {
    return res.status(400).json({ error: 'Укажите параметр path' });
  }

  try {
    const targetUrl = `https://api.hh.ru${path}`;
    const hhResponse = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Nerva-MVP/1.0' }
    });
    const data = await hhResponse.json();
    res.status(hhResponse.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
