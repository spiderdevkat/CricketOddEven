import React from 'react';
import "./index.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import CreateMatch from './components/CreateMatch';
import JoinMatch from './components/JoinMatch';
import PlayWithComputer from './components/PlayWithComputer';
import TeamSelection from './components/TeamSelection';
import Toss from './components/Toss';
import Playground from './components/Playground';
import Scoreboard from './components/Scoreboard';
import PlayerList from './components/PlayerList';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-match" element={<CreateMatch />} />
          <Route path="/join-match" element={<JoinMatch />} />
          <Route path="/play-with-computer" element={<PlayWithComputer />} />
          <Route path="/team-selection" element={<TeamSelection />} />
          <Route path="/player-list" element={<PlayerList />} />
          <Route path="/toss" element={<Toss />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;