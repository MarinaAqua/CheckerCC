import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);

    const res = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: input })
    });

    const json = await res.json();
    setResult(json);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Cek Kartu</h1>
      <input
        type="text"
        placeholder="4242|12|2025|123"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: 10, width: '100%', marginBottom: 10 }}
      />
      <button onClick={handleCheck} disabled={loading} style={{ padding: 10 }}>
        {loading ? 'Memeriksa...' : 'Cek Kartu'}
      </button>

      {result && (
        <pre style={{ marginTop: 20, background: '#f3f3f3', padding: 10 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
