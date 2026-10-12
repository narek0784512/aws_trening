import React, { useEffect, useState } from 'react';

const API = '/api';

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch(`${API}/messages`);
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    await fetch(`${API}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    setText('');
    await load();
    setLoading(false);
  };

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      maxWidth: 640,
      margin: '40px auto',
      padding: 20,
    }}>
      <h1>☁️ AWS Demo App</h1>
      <p style={{ color: '#666' }}>Frontend + Backend + PostgreSQL в Docker</p>

      <form onSubmit={send} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение..."
          style={{ flex: 1, padding: 10, fontSize: 16 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer' }}
        >
          {loading ? '...' : 'Отправить'}
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {messages.map((m) => (
          <li key={m.id} style={{
            background: '#f5f5f5',
            padding: 12,
            marginBottom: 8,
            borderRadius: 6,
          }}>
            <strong>#{m.id}</strong> — {m.text}
            <div style={{ fontSize: 12, color: '#888' }}>
              {new Date(m.created_at).toLocaleString()}
            </div>
          </li>
        ))}
        {messages.length === 0 && (
          <li style={{ color: '#999', textAlign: 'center' }}>Пока нет сообщений</li>
        )}
      </ul>
    </div>
  );
}

export default App;