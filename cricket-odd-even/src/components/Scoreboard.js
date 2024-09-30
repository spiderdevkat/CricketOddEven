import React, { useEffect, useState } from 'react';
import socket from '../socket';

const Scoreboard = ({ matchId }) => {
  const [score, setScore] = useState({ blue: 0, yellow: 0 });
  const [result, setResult] = useState('');

  useEffect(() => {
    socket.on('gameOver', (winner) => {
      setResult(winner);
    });

    socket.on('scoreUpdate', (updatedScore) => {
      setScore(updatedScore);
    });

    return () => {
      socket.off('gameOver');
      socket.off('scoreUpdate');
    };
  }, [matchId]);

  return (
    <div className="container">
      <h2>Scoreboard</h2>
      <div>
        <p>Blue Team Score: {score.blue}</p>
        <p>Yellow Team Score: {score.yellow}</p>
      </div>
      <div>
        <p>Result: {result}</p>
      </div>
      <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
        Exit Game
      </button>
    </div>
  );
};

export default Scoreboard;