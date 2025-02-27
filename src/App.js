import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CaptureImageComponent from './Components/CaptureImageComponent.js';
import CaptureVideoComponent from './Components/CaptureVideoComponent.js';
import SelectMediaComponent from './Components/SelectMediaComponent.js';
import ScreenRecordingComponent from './Components/ScreenRecordingComponent.js';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/capture-image" element={<CaptureImageComponent />} />
          <Route path="/capture-video" element={<CaptureVideoComponent />} />
          <Route path="/select-media" element={<SelectMediaComponent />} />
          <Route path="/screen-record" element={<ScreenRecordingComponent />} />
          <Route path="/" element={
            <div className="home-container">
              <Link to="/capture-image" className="capture-image-button">Capture Image</Link>
              <Link to="/capture-video" className="capture-video-button">Capture Video</Link>
              <Link to="/select-media" className="select-media-button">Select Media</Link>
              <Link to="/screen-record" className="screen-record-button">Screen Record</Link>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;