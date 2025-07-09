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

    for (let i = 0; i < lines.length; i++) {
      const card = lines[i];
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

      setResults([...newResults]); // update per baris
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h1>Cek Banyak Kartu</h1>
      <textarea
        placeholder="Masukkan kartu satu per baris: 4242|12|2025|123"
        rows={10}
        style={{ width: '100%', padding: 10 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleBulkCheck} disabled={loading} style={{ marginTop: 10, padding: 10 }}>
        {loading ? 'Memeriksa...' : 'Cek Semua'}
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Hasil:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ marginBottom: 10, background: '#f5f5f5', padding: 10 }}>
                <strong>{r.card}</strong> → <span style={{
  color:
    r.status === 'Live' ? 'green' :
    r.status === 'Die' ? 'red' :
    r.status === 'Unknown' ? 'orange' :
    'black'
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
