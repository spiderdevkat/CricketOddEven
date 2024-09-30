import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import "./styles.css"

const CreateMatch = () => {
  const [state, setState] = useState({
    matchId: '',
    playerName: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const newMatchId = Math.random().toString(36).substring(2, 9);
    setState(prevState => ({ ...prevState, matchId: newMatchId }));
    socket.emit('createMatch', newMatchId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const startMatch = () => {
    if (state.playerName) {
      socket.emit('joinMatch', { matchId: state.matchId, playerName: state.playerName });
      navigate(`/player-list?matchId=${state.matchId}`);
    } else {
      alert('Please enter your name to start the match.');
    }
  };

  const shareMatch = () => {
    const shareData = {
      title: 'Cricket Odd Even Game',
      text: `Join my match using this link: http://localhost:3000/join-match?matchId=${state.matchId}`,
      url: `http://localhost:3000/join-match?matchId=${state.matchId}`
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Match link shared successfully'))
        .catch((error) => console.error('Error sharing match link:', error));
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  };

  return (
    <div className="create-match-container">
      <div className="create-match-background-image">
      <img src={process.env.PUBLIC_URL + '/cricket_playing.jpg'} alt="Cricket Stadium" className="create-match-stadium-image" />
      </div>
      <div className="create-match-content">
        <h2 className="create-match-title">Create Match</h2>
        <div className="form-group">
          <label className="labelline">Player Name</label>
          <input
            type="text"
            className="form-control"
            name="playerName"
            value={state.playerName}
            onChange={handleChange}
          />
        </div>
        {state.matchId && (
          <div>
            <p className="tagline">Match ID: {state.matchId}</p>
            <p className="tagline">Share this ID with your friends to join the match.</p>
            <button className="create-match-btn create-match-btn-secondary" onClick={shareMatch} style={{position:'relative',left:'5.5rem'}}>
              Share Match Link
            </button>
          </div>
        )}
        <button className="create-match-btn create-match-btn-primary" onClick={startMatch} style={{position:'relative',right:'1.5rem'}}>
          Start Match
        </button>
      </div>
    </div>
  );
};

export default CreateMatch;