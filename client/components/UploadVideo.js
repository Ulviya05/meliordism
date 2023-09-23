import React, { useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from '../styles/Upload.module.css';
import axios from 'axios';
import { MuiChipsInput } from 'mui-chips-input';

function UploadVideo() {
  const dzStyles = {
    border: 'dashed 3px rgba(22, 24, 35, 0.34)',
    borderRadius: '5px',
    marginTop: '20px',
    textAlign: 'center',
    height: 360,
    width: 570,
    outline: 'none',
    cursor: 'pointer',
  };
  const dzActive = {
    borderColor: 'purple',
  };
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [user_id, setUser] = useState([]);
  const [videoURL, setVideoURL] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user_id = localStorage.getItem('id');
        setUser(user_id);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    getUser();
  }, []);

  const [chips, setChips] = React.useState([]);

  const handleChange = (newChips) => {
    setChips(newChips);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedVideo(file);

    if (file && file.type.startsWith('video/')) {
      const videoObjectURL = URL.createObjectURL(file);
      setVideoURL(videoObjectURL);
    }
  };

  const handleFileUpload = () => {
    if (!selectedVideo || !user_id) {
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedVideo);
    chips.forEach((tag, index) => {
      formData.append(`hashtags[${index}]`, tag);
    });

    axios
      .post(process.env.BASE_URL + '/video/upload', formData)
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedVideo(file);
    }
  };

  return (
    <div className={styles.upload}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <Header />
      <div className={selectedVideo ? styles.con2 : styles.container}>
        <div className={selectedVideo ? styles.con : styles.notSelected}>
          <label className={styles.uploadCenter} htmlFor="uploadBtn">
            <div
              className={`${styles.uploadContainer} ${selectedVideo ? styles.selected : ''}`}
              style={selectedVideo ? { ...dzStyles, ...dzActive } : dzStyles}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className={styles.middle}>
                <span className={styles.uploadButton}>
                  {selectedVideo ? (
                    <div className={styles.preview}>
                      <video
                        className={styles.videoPreview}
                        src={videoURL}
                        controls
                        autoPlay
                      ></video>
                    </div>
                  ) : (
                    <>
                      <i className={`bi bi-cloud-arrow-up ${styles.uploadIcon}`}></i>
                      <div className={styles.instructions}>
                        <span className={styles.uploadInstructions1}>
                          Select video to upload
                        </span>
                        <span className={styles.uploadInstructions}>
                          Or drag and drop a file
                        </span>
                        <span className={styles.uploadInstructions}>
                          MP4 or WebM
                        </span>
                        <span className={styles.uploadInstructions}>
                          Up to 30 minutes
                        </span>
                        <span className={styles.uploadInstructions}>
                          Less than 2 GB
                        </span>
                      </div>
                    </>
                  )}
                </span>
                {!selectedVideo && (
                  <div className={styles.selectButton}>
                    <button
                      type="button"
                      onClick={() => document.getElementById('uploadBtn').click()}
                    >
                      Select File
                    </button>
                  </div>
                )}
              </div>
              <input
                id="uploadBtn"
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

            </div>
          </label>
          {selectedVideo && (
            <div className={styles.bottom}>
              <div className={styles.bottomCenter}>
                <div className={styles.videoInfo}>
                  <p className={styles.videoName}>{selectedVideo.name}</p>
                  <p className={styles.videoSize}>
                    {(selectedVideo.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <MuiChipsInput
                  className={styles.tags}
                  value={chips}
                  onChange={handleChange}
                  placeholder="Add tag and press enter"
                />
                <div className={styles.upload_button}>
                  <button type="button" onClick={handleFileUpload}>
                    Publish
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadVideo;


