export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: 'Missing data parameter' });
  }

  try {
    const apiRes = await fetch('https://cc-checker.marinaaqua366.workers.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });

    const json = await apiRes.json();
    return res.status(200).json(json);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
