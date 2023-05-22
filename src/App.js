import React from "react";
// import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Playlist from "./Playlist";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
          {/* <Home /> */}
        {/* </Route> */}
        <Route path="/playlist" element={<Playlist />} />
          {/* <Playlist />
        </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
