import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import './CaptureVideoComponent.css'; 

const CaptureVideoComponent = () => {
  const webcamRef = useRef(null);
  const [capturedVideos, setCapturedVideos] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [facingMode, setFacingMode] = useState('user');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = useCallback(() => {
    if (webcamRef.current && webcamRef.current.stream) {
      chunksRef.current = [];
      const stream = webcamRef.current.stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (chunksRef.current.length) {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setCapturedVideos(prev => [...prev, url]);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } else {
      console.error('Webcam not initialized or stream not available');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const toggleFacingMode = () => {
    setFacingMode(prevFacingMode => (prevFacingMode === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="container">
      <Link to="/" className="back-button">Back</Link>
      <div className="webcam-container">
        <Webcam
          audio={true}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode }}
          width={640}
          height={480}
        />
        <button className="toggle-camera" onClick={toggleFacingMode}>
          Switch to {facingMode === 'user' ? 'Back' : 'Front'} Camera
        </button>
        {!isRecording ? (
          <button className="capture" onClick={startRecording}>Start Recording</button>
        ) : (
          <button className="capture" onClick={stopRecording}>Stop Recording</button>
        )}
      </div>
      <div className="video-grid">
        {capturedVideos.map((video, index) => (
          <video key={`video-${index}`} src={video} controls width="320" />
        ))}
      </div>
    </div>
  );
};

export default CaptureVideoComponent;