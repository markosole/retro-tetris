import React, { useEffect, useState } from 'react';
import { socket } from '../socketClient';

export const Leaderboard = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Receive leaderboard updates via socket event
    const handleLeaderboard = (data) => {
      console.log('Leaderboard event received:', data);
      setEntries(data);
    };

    socket.on('leaderboard', handleLeaderboard);

    // Request current leaderboard via API as fallback
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/leaderboard`)
      .then(res => res.json())
      .then(data => {
        console.log('Leaderboard API response:', data);
        setEntries(data);
      })
      .catch(console.error);

    return () => {
      socket.off('leaderboard', handleLeaderboard);
    };
  }, []);

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Leaderboard (Top 10)</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Nickname</th>
            <th style={styles.th}>Home</th>
            <th style={styles.th}>Away</th>
            <th style={styles.th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.tdEmpty}>No scores yet</td>
            </tr>
          ) : (
            entries.map((e, i) => (
              <tr key={i} style={i < 3 ? styles.topThree : {}}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}>{e.nickname || 'anonymous'}</td>
                <td style={styles.td}>{e.home}</td>
                <td style={styles.td}>{e.away}</td>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>{(e.home || 0) + (e.away || 0)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#1a1a2e',
    border: '2px solid #4a4a6a',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#2a2a4a',
    color: '#fff',
    fontFamily: '"Courier New", monospace',
    fontSize: '12px',
    borderBottom: '2px solid #5a5a7a',
  },
  td: {
    padding: '10px',
    color: '#aaa',
    fontFamily: '"Courier New", monospace',
    fontSize: '12px',
    borderBottom: '1px solid #2a2a4a',
  },
  tdEmpty: {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontFamily: '"Courier New", monospace',
    fontSize: '12px',
  },
  topThree: {
    backgroundColor: 'rgba(160, 0, 240, 0.1)',
  },
};
