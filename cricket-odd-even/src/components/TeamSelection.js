import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import socket from '../socket';
import './TeamSelection.css';

const TeamSelection = () => {
  const [teams, setTeams] = useState({ blue: [], yellow: [] });
  const [players, setPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes timer
  const navigate = useNavigate();
  const location = useLocation();

  const autoAssignTeams = useCallback((matchId) => {
    const remainingPlayers = players.filter(player => !teams.blue.includes(player) && !teams.yellow.includes(player));
    remainingPlayers.forEach((player, index) => {
      if (index % 2 === 0) {
        setTeams(prevTeams => ({ ...prevTeams, blue: [...prevTeams.blue, player] }));
      } else {
        setTeams(prevTeams => ({ ...prevTeams, yellow: [...prevTeams.yellow, player] }));
      }
    });
    navigate(`/match?matchId=${matchId}`);
  }, [players, teams, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const matchId = params.get('matchId');

    socket.emit('getPlayers', matchId);

    socket.on('playersUpdated', (players) => {
      setPlayers(players);
      setTeams(prevTeams => ({
        ...prevTeams,
        blue: players.filter(player => player.team === 'blue'),
        yellow: players.filter(player => player.team === 'yellow')
      }));
    });

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          autoAssignTeams(matchId);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdown);
      socket.off('playersUpdated');
    };
  }, [location, autoAssignTeams]);

  const joinTeam = (team) => {
    const params = new URLSearchParams(location.search);
    const matchId = params.get('matchId');

    socket.emit('selectTeam', { matchId, team });
    setSelectedTeam(team);
  };

  return (
    <div className="team-selection-container">
      <div className="background-image">
        <img 
          src={process.env.PUBLIC_URL + '/dressing_room.jpg'} 
          alt="Dressing Room" 
          className="dressing-room-image"
        />
      </div>

      <div className="team-selection-content"> {/* Content overlay */}
        <h2 className="team-selection-title">Team Selection</h2> 
        <p className="timer">Time remaining: {Math.floor(timer / 60)}:{timer % 60}</p>

        <div className="team-selection-row">
          <div className="team-selection-col">
            <h3 className="team-name">Team Blue</h3>
            <ul className="player-names">
              {teams.blue.map((player, index) => (
                <li key={index}>{player.name}</li> 
              ))}
            </ul>
            <button 
              className="join-team-button blue-button" 
              onClick={() => joinTeam('blue')}
              disabled={selectedTeam === 'blue' || teams.blue.length >= 11}
            >
              Join Team Blue
            </button>
          </div>
          <div className="team-selection-col">
            <h3 className="team-name">Team Yellow</h3>
            <ul className="player-names">
              {teams.yellow.map((player, index) => (
                <li key={index}>{player.name}</li> 
              ))}
            </ul>
            <button 
              className="join-team-button yellow-button" 
              onClick={() => joinTeam('yellow')}
              disabled={selectedTeam === 'yellow' || teams.yellow.length >= 11}
            >
              Join Team Yellow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSelection;