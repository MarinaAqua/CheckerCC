import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBulkCheck = async () => {
    setLoading(true);
    setResults([]);

    const cards = input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const tempResults = [];

    for (const card of cards) {
      try {
        const res = await fetch('/api/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: card })
        });

        const json = await res.json();
        tempResults.push({
          card,
          status: json?.status || 'Error',
          message: json?.message || 'Tidak ada pesan'
        });
      } catch (err) {
        tempResults.push({
          card,
          status: 'Error',
          message: err.message
        });
      }

      // update real-time
      setResults([...tempResults]);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Cek Banyak Kartu</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Masukkan kartu satu per baris: 4242|12|2025|123"
        rows={10}
        style={{ width: '100%', padding: 10, fontSize: 16 }}
      />
      <button onClick={handleBulkCheck} disabled={loading} style={{ padding: 10, marginTop: 10 }}>
        {loading ? 'Memeriksa...' : 'Cek Semua'}
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Hasil:</h3>
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {results.map((r, i) => (
              <li key={i} style={{ background: '#f0f0f0', padding: 10, marginBottom: 10 }}>
                <strong>{r.card}</strong> →{' '}
                <span style={{
                  color:
                    r.status === 'Live' ? 'green' :
                    r.status === 'Die' ? 'red' :
                    r.status === 'Unknown' ? 'orange' :
                    'black',
                  fontWeight: 'bold'
                }}>
                  {r.status}
                </span>
                <br />
                <small>{r.message}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
