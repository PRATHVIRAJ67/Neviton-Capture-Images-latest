import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './ScreenRecordingComponent.css'; 

const ScreenRecordingComponent = () => {
  const [capturedVideos, setCapturedVideos] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStopped, setRecordingStopped] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true,
      });
      chunksRef.current = [];
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
          setCapturedVideos((prev) => [...prev, url]);
          setRecordingStopped(true);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingStopped(false);
    } catch (error) {
      console.error('Error accessing display media.', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return (
    <div className="container">
      <Link to="/" className="back-button">Back</Link>
      <div className="webcam-container">
        {!isRecording ? (
          <button className="capture" onClick={startRecording}>Start Recording</button>
        ) : (
          <button className="capture" onClick={stopRecording}>Stop Recording</button>
        )}
      </div>
      <div className={`video-grid ${recordingStopped ? 'center-video' : ''}`}>
        {capturedVideos.map((video, index) => (
          <video key={`video-${index}`} src={video} controls className={recordingStopped ? 'large-video' : ''} />
        ))}
      </div>
    </div>
  );
};

export default ScreenRecordingComponent;