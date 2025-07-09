import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBulkCheck = async () => {
    setLoading(true);
    setResults([]);

    const lines = input.split('\n').map(line => line.trim()).filter(Boolean);
    const newResults = [];

    for (const card of lines) {
      try {
        const res = await fetch('/api/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: card })
        });

        const json = await res.json();
        newResults.push({ card, ...json });
      } catch (err) {
        newResults.push({ card, status: 'Error', message: err.message });
      }

      // Update hasil secara real-time
      setResults([...newResults]);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h1>Cek Kartu Massal</h1>
      <textarea
        rows={10}
        placeholder="Masukkan kartu satu per baris: 4242|12|2025|123"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', padding: 10, fontSize: 16 }}
      />
      <button onClick={handleBulkCheck} disabled={loading} style={{ marginTop: 10, padding: 10 }}>
        {loading ? 'Memeriksa...' : 'Cek Semua'}
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Hasil:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ background: '#f5f5f5', padding: 10, marginBottom: 10 }}>
                <strong>{r.card}</strong> →{' '}
                <span style={{
                  fontWeight: 'bold',
                  color:
                    r.status === 'Live' ? 'green' :
                    r.status === 'Die' ? 'red' :
                    r.status === 'Unknown' ? 'orange' :
                    'black'
                }}>
                  {r.status || 'Error'}
                </span>
                <br />
                <small>{r.message || 'Tidak ada pesan'}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
