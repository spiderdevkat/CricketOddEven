import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import socket from '../socket';
import './PlayerList.css'; 

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const matchId = params.get('matchId');

    socket.emit('getPlayers', matchId);
    console.log(matchId);

    socket.on('playersUpdated', (updatedPlayers) => {
      console.log(updatedPlayers);
      setPlayers(updatedPlayers);
      if (updatedPlayers.length === 22) {
        navigate(`/team-selection?matchId=${matchId}`);
      }
    });

    socket.on('playerJoined', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('redirectToTeamSelection', () => {
      const params = new URLSearchParams(location.search);
      const matchId = params.get('matchId');
      navigate(`/team-selection?matchId=${matchId}`);
    });

    return () => {
      socket.off('playersUpdated');
      socket.off('playerJoined');
      socket.off('redirectToTeamSelection');
    };
  }, [location, navigate]);

  const handleRedirectToTeamSelection = () => {
    socket.emit('redirectToTeamSelectionEvent');
  };

  return (
    <div className="player-list-container">
      <div className="background-image">
        <img 
          src={process.env.PUBLIC_URL + '/dressing_room.jpg'} 
          alt="Dressing Room" 
          className="dressing-room-image"
        />
      </div>

      <div className="player-list-content"> {/* Content overlay */}
        <h2 className="list-title">Players Ready</h2> 
        <p className="player-count">Total Players: {players.length}</p>

        <ul className="player-names">
          {players.map((player, index) => (
            <li key={index}>{player.name}</li> 
          ))}
        </ul>

        {players.length > 1 && (
          <button 
            className="proceed-button" 
            onClick={handleRedirectToTeamSelection}
          >
            Proceed to Team Formation
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerList;