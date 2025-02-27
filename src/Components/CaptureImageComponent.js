import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import './CaptureImageComponent.css';

const CaptureImageComponent = () => {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [facingMode, setFacingMode] = useState('user');
  const [selectedImage, setSelectedImage] = useState(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(new Date().toLocaleString(), 10, 30);
        const timestampedImageSrc = canvas.toDataURL('image/jpeg');
        setCapturedImages([...capturedImages, timestampedImageSrc]);
      };
      setCapturedImages([...capturedImages, imageSrc]);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode(prevFacingMode => (prevFacingMode === 'user' ? 'environment' : 'user'));
  };

  const saveImage = (imageSrc) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'captured_image.jpg';
    link.click();
  };

  const openFullScreen = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeFullScreen = () => {
    setSelectedImage(null);
  };

  return (
    <div className="container">
      <Link to="/" className="back-button">Back</Link>
      <div className="webcam-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode }}
        />
        <button className="toggle-camera" onClick={toggleFacingMode}>
          Switch to {facingMode === 'user' ? 'Back' : 'Front'} Camera
        </button>
        <button className="capture" onClick={captureImage}>Capture</button>
      </div>
      <div className="image-grid">
        {capturedImages.map((image, index) => (
          <div key={index} className="image-item">
            <img src={image} alt={`Captured ${index}`} />
            <div className='SaveFullscreeen'>
              <button className='Save' onClick={() => saveImage(image)}>Save</button>
              <button className='FullScreen' onClick={() => openFullScreen(image)}>Full Screen</button>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="modal" onClick={closeFullScreen}>
          <span className="close">&times;</span>
          <img className="modal-content" src={selectedImage} alt="Full Screen" />
        </div>
      )}
    </div>
  );
};

export default CaptureImageComponent;