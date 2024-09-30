const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your React app URL
    methods: ['GET', 'POST']
  }
});

let matches = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('createMatch', (matchId) => {
    matches[matchId] = {
      players: [],
      teams: { blue: [], yellow: [] },
      state: 'waiting', // waiting, teamSelection, playing, finished
      chat: []
    };
    socket.join(matchId);
    io.to(matchId).emit('matchCreated', matchId);
  });

  socket.on('joinMatch', ({ matchId, playerName }) => {
    if (matches[matchId] && matches[matchId].players.length < 22) {
      matches[matchId].players.push({ id: socket.id, name: playerName });
      socket.join(matchId);
      io.to(matchId).emit('playerJoined', matches[matchId].players);
      io.to(matchId).emit('playersUpdated', matches[matchId].players);
      io.to(matchId).emit('playerCountUpdated', matches[matchId].players.length); // Emit playerCountUpdated event
    } else {
      socket.emit('matchFull');
    }
  });

  socket.on('getPlayers', (matchId) => {
    if (matches[matchId]) {
      socket.emit('playersUpdated', matches[matchId].players);
    }
  });

  socket.on('redirectToTeamSelectionEvent', () => {
    io.emit('redirectToTeamSelection');
  });

  socket.on('sendMessage', ({ matchId, message }) => {
    if (matches[matchId]) {
      matches[matchId].chat.push(message);
      io.to(matchId).emit('newMessage', message);
    }
  });

  socket.on('selectTeam', ({ matchId, team }) => {
    const match = matches[matchId];
    if (match) {
      if (match.teams[team].length < 11) {
        match.teams[team].push(socket.id);
        io.to(matchId).emit('teamUpdated', match.teams);
        if (match.teams.blue.length + match.teams.yellow.length === match.players.length) {
          match.state = 'teamSelectionComplete';
          io.to(matchId).emit('teamSelectionComplete');
        }
      } else {
        socket.emit('teamFull', team);
      }
    }
  });

  socket.on('startGame', (matchId) => {
    const match = matches[matchId];
    if (match) {
      match.state = 'playing';
      match.currentInning = 1;
      match.currentPair = 0;
      match.scores = { blue: 0, yellow: 0 };
      io.to(matchId).emit('gameStarted');
      startPairMatch(matchId);
    }
  });

  socket.on('chooseNumber', ({ matchId, number }) => {
    const match = matches[matchId];
    if (match && match.state === 'playing') {
      const currentPair = match.currentPair;
      const currentInning = match.currentInning;
      const battingTeam = currentInning === 1 ? 'blue' : 'yellow';
      const bowlingTeam = currentInning === 1 ? 'yellow' : 'blue';

      if (!match.pairChoices) {
        match.pairChoices = {};
      }
      match.pairChoices[socket.id] = number;

      if (Object.keys(match.pairChoices).length === 2) {
        const [battingPlayer, bowlingPlayer] = match.teams[battingTeam][currentPair];
        const battingNumber = match.pairChoices[battingPlayer];
        const bowlingNumber = match.pairChoices[bowlingPlayer];

        if (battingNumber !== bowlingNumber) {
          match.scores[battingTeam] += battingNumber;
          io.to(matchId).emit('scoreUpdate', match.scores);
        } else {
          io.to(matchId).emit('playerOut', battingPlayer);
          match.currentPair++;
          if (match.currentPair >= 11) {
            if (currentInning === 1) {
              match.currentInning = 2;
              match.currentPair = 0;
              io.to(matchId).emit('inningComplete', match.scores[battingTeam] + 1);
            } else {
              match.state = 'finished';
              const result = match.scores.blue > match.scores.yellow ? 'blue' : 'yellow';
              io.to(matchId).emit('gameOver', result);
            }
          }
        }
        match.pairChoices = {};
        if (match.state === 'playing') {
          startPairMatch(matchId);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    // Handle player disconnection
    Object.keys(matches).forEach((matchId) => {
      const match = matches[matchId];
      if (match.players.find((player) => player.id === socket.id)) {
        match.players = match.players.filter((player) => player.id !== socket.id);
        io.to(matchId).emit('playerCountUpdated', match.players.length);
      }
    });
  });
});

function startPairMatch(matchId) {
  const match = matches[matchId];
  if (match) {
    const currentPair = match.currentPair;
    const currentInning = match.currentInning;
    const battingTeam = currentInning === 1 ? 'blue' : 'yellow';
    const bowlingTeam = currentInning === 1 ? 'yellow' : 'blue';

    const battingPlayer = match.teams[battingTeam][currentPair];
    const bowlingPlayer = match.teams[bowlingTeam][currentPair];

    io.to(matchId).emit('pairMatchStart', { battingPlayer, bowlingPlayer });
  }
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});