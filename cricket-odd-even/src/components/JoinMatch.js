import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import socket from '../socket';
import "./styles.css"

const JoinMatch = () => {
  const [state, setState] = useState({
    matchId: '',
    playerName: '',
    playerCount: 0
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const matchIdFromUrl = params.get('matchId');
    if (matchIdFromUrl) {
      setState(prevState => ({ ...prevState, matchId: matchIdFromUrl }));
      socket.emit('getPlayerCount', matchIdFromUrl);
    }

    socket.on('playerCountUpdated', (count) => {
      setState(prevState => ({ ...prevState, playerCount: count }));
      if (count >= 22) {
        alert('Both teams are full. Create a new match or join another match.');
        navigate('/');
      }
    });

    return () => {
      socket.off('playerCountUpdated');
    };
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const joinMatch = () => {
    if (state.matchId && state.playerName) {
      socket.emit('joinMatch', { matchId: state.matchId, playerName: state.playerName });
      navigate(`/player-list?matchId=${state.matchId}`);
    }
  };

  return (
    <div className="create-match-container">
      <div className="create-match-background-image">
        <img src={process.env.PUBLIC_URL + '/cricket_playing.jpg'} alt="Cricket Stadium" className="create-match-stadium-image" />
      </div>
      <div className="create-match-content">
        <h2 className="create-match-title">Join Match</h2>
        <div className="form-group">
          <label className="fw-bold labelline">Match ID</label>
          <input
            type="text"
            className="form-control"
            name="matchId"
            value={state.matchId}
            onChange={handleChange}
            disabled={!!state.matchId}
          />
        </div>
        <div className="form-group">
          <label className="fw-bold labelline">Player Name</label>
          <input
            type="text"
            className="form-control"
            name="playerName"
            value={state.playerName}
            onChange={handleChange}
          />
        </div>
        <button className="create-match-btn create-match-btn-primary" onClick={joinMatch} style={{position:'relative',top:'0.5rem'}}>
          Join Match
        </button>
        <p className="fw-bold labelline" style={{position:'relative',top:'2px'}}>Total Players: {state.playerCount}</p>
      </div>
    </div>
  );
};

export default JoinMatch;