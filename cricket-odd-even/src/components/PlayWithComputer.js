import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

const PlayWithComputer = () => {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const startGame = () => {
    if (playerName) {
      const matchId = Math.random().toString(36).substring(2, 9);
      socket.emit('createMatch', matchId);
      socket.emit('joinMatch', { matchId, playerName });
      navigate(`/team-selection?matchId=${matchId}`);
    }
  };

  return (
    <div className="container">
      <h2>Play with Computer</h2>
      <div className="form-group">
        <label>Player Name</label>
        <input
          type="text"
          className="form-control"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={startGame}>
        Start Game
      </button>
    </div>
  );
};

export default PlayWithComputer;