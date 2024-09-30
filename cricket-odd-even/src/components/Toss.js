import React, { useEffect, useState } from 'react';
import socket from '../socket';

const Toss = ({ matchId }) => {
  const [tossResult, setTossResult] = useState('');

  useEffect(() => {
    socket.on('tossResult', (result) => {
      setTossResult(result);
      // Redirect to the next page (Playground) after a delay
    });

    socket.emit('startToss', matchId);

    return () => {
      socket.off('tossResult');
    };
  }, [matchId]);

  return (
    <div className="container">
      <h2>Toss Result</h2>
      {tossResult ? (
        <p>{tossResult}</p>
      ) : (
        <p>Waiting for toss result...</p>
      )}
    </div>
  );
};

export default Toss;