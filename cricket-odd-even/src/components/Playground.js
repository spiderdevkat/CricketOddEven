import React, { useState, useEffect } from 'react';
import socket from '../socket';
import Chat from './Chat';

const Playground = ({ matchId }) => {
  const [currentPair, setCurrentPair] = useState({});
  const [score, setScore] = useState({ blue: 0, yellow: 0 });
  const [chosenNumber, setChosenNumber] = useState(null);

  useEffect(() => {
    socket.on('pairMatchStart', ({ battingPlayer, bowlingPlayer }) => {
      setCurrentPair({ battingPlayer, bowlingPlayer });
    });

    socket.on('scoreUpdate', (updatedScore) => {
      setScore(updatedScore);
    });

    socket.on('playerOut', (player) => {
      // Handle player out
    });

    socket.emit('startGame', matchId);

    return () => {
      socket.off('pairMatchStart');
      socket.off('scoreUpdate');
      socket.off('playerOut');
    };
  }, [matchId]);

  const chooseNumber = (number) => {
    setChosenNumber(number);
    socket.emit('chooseNumber', { matchId, number });
  };

  return (
    <div className="container">
      <h2>Playground</h2>
      <div>
        <p>Batting Player: {currentPair.battingPlayer}</p>
        <p>Bowling Player: {currentPair.bowlingPlayer}</p>
      </div>
      <div>
        <p>Score: Blue - {score.blue}, Yellow - {score.yellow}</p>
      </div>
      <div>
        <p>Choose a number between 1 and 6:</p>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            className="btn btn-secondary"
            onClick={() => chooseNumber(num)}
            disabled={chosenNumber !== null}
          >
            {num}
          </button>
        ))}
      </div>
      <Chat matchId={matchId} />
    </div>
  );
};

export default Playground;