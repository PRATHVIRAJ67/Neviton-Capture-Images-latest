import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SelectMediaComponent.css'; 

const SelectMediaComponent = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('files')) || [];
    setFiles(storedFiles);
  }, []);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      localStorage.setItem('files', JSON.stringify(updatedFiles));
      return updatedFiles;
    });
  };

  const handleFullScreen = (event) => {
    const mediaElement = event.target.previousSibling;
    if (mediaElement.requestFullscreen) {
      mediaElement.requestFullscreen();
    } else if (mediaElement.mozRequestFullScreen) { 
      mediaElement.mozRequestFullScreen();
    } else if (mediaElement.webkitRequestFullscreen) { 
      mediaElement.webkitRequestFullscreen();
    } else if (mediaElement.msRequestFullscreen) { 
      mediaElement.msRequestFullscreen();
    }
  };

  return (
    <div className="container">
      <Link to="/" className="back-button">Back</Link>
      <div className="file-input-container">
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <label htmlFor="file-input" className="file-input-label">
          Drag & Drop your files or <span className="file-input-action">Browse</span>
        </label>
      </div>
      <div className="media-grid">
        {files.map((file, index) => {
          if (file instanceof File) {
            const fileType = file.type.split('/')[0];
            return (
              <div key={index} className="media-item">
                {fileType === 'image' ? (
                  <img src={URL.createObjectURL(file)} alt={`Selected ${index}`} />
                ) : (
                  <video src={URL.createObjectURL(file)} controls />
                )}
                <button className='capture' onClick={handleFullScreen}>View Full Screen</button>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default SelectMediaComponent;