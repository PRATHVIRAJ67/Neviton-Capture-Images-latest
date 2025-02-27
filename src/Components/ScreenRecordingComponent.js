import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ScreenRecordingComponent.css';

const ScreenRecordingComponent = () => {
  const [capturedVideos, setCapturedVideos] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStopped, setRecordingStopped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  
  useEffect(() => {
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    setIsMobile(checkMobile);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      let stream;

      if (isMobile) {
       
        try {
         
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'screen' },
            audio: true,
          });
        } catch (screenError) {
          console.log('Screen capture not available on this mobile device, falling back to camera');
          
         
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
        }
      } else {
      
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' },
          audio: true,
        });
      }

  
      streamRef.current = stream;
      
      chunksRef.current = [];
      
   
      let mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = ''; 
        }
      }

      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
      });

     
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      
      mediaRecorder.onstop = () => {
        if (chunksRef.current.length) {
          const blob = new Blob(chunksRef.current, { 
            type: mimeType || 'video/webm' 
          });
          const url = URL.createObjectURL(blob);
          setCapturedVideos((prev) => [...prev, url]);
          setRecordingStopped(true);
          
          
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
        }
      };

     
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); 
      setIsRecording(true);
      setRecordingStopped(false);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [isMobile]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

 
  useEffect(() => {
    return () => {
      capturedVideos.forEach(url => URL.revokeObjectURL(url));
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [capturedVideos]);

  return (
    <div className="container">
      <Link to="/" className="back-button">Back</Link>
      
      {isMobile && (
        <div className="mobile-notice">
          <p>Note: Screen recording has limited support on mobile devices.</p>
        </div>
      )}
      
      <div className="webcam-container">
        {!isRecording ? (
          <button className="capture" onClick={startRecording}>
            {isMobile ? "Start Camera Recording" : "Start Screen Recording"}
          </button>
        ) : (
          <button className="capture" onClick={stopRecording}>
            Stop Recording
          </button>
        )}
      </div>
      
      <div className={`video-grid ${recordingStopped ? 'center-video' : ''}`}>
        {capturedVideos.map((video, index) => (
          <video 
            key={`video-${index}`} 
            src={video} 
            controls 
            className={recordingStopped ? 'large-video' : ''} 
          />
        ))}
      </div>
    </div>
  );
};

export default ScreenRecordingComponent;