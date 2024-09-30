import React from 'react';
import "./styles.css"
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="background-image">
        <img src={process.env.PUBLIC_URL + '/cricket_playing.jpg'} alt="Cricket Stadium" className="stadium-image" />
      </div>
      <div className="content">
        <h1 className="title">Cricket Odd Even</h1>
        <div className="create-match-btn-group">
          <button className="create-match-btn create-match-btn-primary" onClick={() => navigate("/create-match")}>
            Create Match
          </button>
          <button className="create-match-btn create-match-btn-secondary" onClick={() => navigate("/join-match")}>
            Join Match
          </button>
          <button className="create-match-btn create-match-btn-success" onClick={() => navigate("/play-with-computer")}>
            Play with Computer
          </button>
        </div>
        <p className="tagline">Cricket like never before! Play with friends, join a match, or take on the computer in a game of luck.</p>
      </div>
    </div>
  );
};

export default Home;