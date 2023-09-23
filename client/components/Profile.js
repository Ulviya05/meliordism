import React, { useEffect, useState } from 'react';
import styles from '../styles/Profile.module.css'; // Import your CSS module or use inline styles
import Header from './Header';
import Video from './Video';
import Sidebar from './Sidebar';
import axios from 'axios';

function Profile({ setLoading }) {

  const [allVideos, setAllVideos] = useState([]);
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const [type, setType] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimerExpired(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!timerExpired) {
    setLoading(true)
  } else {
    setLoading(false)
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = localStorage.getItem("username");
        const type = localStorage.getItem("type");
        setUser(user)
        setType(type)
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, []);


  useEffect(() => {
    const path = window.location.pathname;

    const fetchVideos = async () => {
      try {
        console.log(path)
        //   if (path === '/profile') {
        //     response = await axios.get(`${process.env.BASE_URL}/video/my`);
        //   } else if (path.startsWith('/profile/')) {
        //     console.log("here")
        const username = path.substring('/profile/'.length);
        // console.log(username)
        const response = await axios.get(`${process.env.BASE_URL}/video/profile/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("id")}`
          }
        });
        console.log("kkk", response)


        const sortedVideos = response.data.videos.reverse();
        setAllVideos(sortedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }
    fetchVideos();

  }, []);

  useEffect(() => {

    const fetchProfile = async () => {
      try {
        // let response;
        const pathname = window.location.pathname;

        // if (pathname === '/profile') {
        //     response = await axios.get(`${process.env.BASE_URL}/user`);
        // } else if (pathname.startsWith('/profile/')) {
        const username = pathname.substring('/profile/'.length);
        const response = await axios.get(`${process.env.BASE_URL}/user/${username}`);

        if (response) {
          // console.log("hgf",response.data.user.username)
          setUsername(response.data.user.username);
          setPhoto(response.data.user.image);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    fetchProfile();

  }, []);


  const handleAvatarClick = () => {
    if (username === user) {
      const fileInput = document.getElementById('avatar-upload');
      fileInput.click();
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);


    try {
      const response = await axios.post(`${process.env.BASE_URL}/user/upload`, formData);
      const updatedPhoto = response.data.image.image;
      setPhoto(updatedPhoto);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isUploading && uploadedImage) {
      async function updatePhoto() {
        try {
          const formData = new FormData();
          formData.append('image', uploadedImage);
          const response = await axios.post(`${process.env.BASE_URL}/user/upload`, formData);
          const updatedPhoto = response.data.image.image;
          setPhoto(updatedPhoto);
        } catch (error) {
          console.log(error);
        }
      }
      updatePhoto();
    }
  }, [isUploading, uploadedImage]);



  return (
    <div className={styles.profileContainer}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <Header
        allVideos={allVideos}
        setAllVideos={setAllVideos}
      />
      <div className={styles.scroll}>
        <div className={styles.profileInfo}>
          <div className={styles.center}>
            {username === user && (
              <i class={`bi bi-pen ${styles.editIcon}`}></i>
            )}
            <div className={`${styles.avatar} ${isUploading ? styles.uploading : ''} ${username === user ? styles.myAvatar : ''}`} onClick={handleAvatarClick}>
              {isUploading ? (
                <div className={styles.uploadIndicator}>
                </div>
              ) : null}
              {uploadedImage ? (
                <img src={uploadedImage} alt="Avatar" />
              ) : (
                <img src={`${process.env.BASE_URL}/photos/${photo}`} alt="Avatar" />
              )}

              {username === user && (

                <div>
                  <i class={`bi bi-camera ${styles.cameraIcon}`}></i>
                  <div className={styles.uploadText}>CHANGE</div>
                  <div className={styles.uploadText2}>PROFILE PHOTO</div>
                </div>

              )}

              <input id="avatar-upload" type="file" onChange={handleFileUpload} />
            </div>
            <div className={styles.right}>
              <h2>@{username}</h2>
              <div className={styles.postNum}>
                <p>{allVideos.length}</p>
                <p className={styles.posts}>posts</p>
              </div>
            </div>
          </div>
        </div>
        {allVideos.length > 0 &&
          <div className={styles.explore}>
            <div className={styles.explore_container}>
              {/* <div className={styles.label}>Videos</div> */}
              <div className={styles.content}>
                <div className="row">
                  {allVideos.map((video) => (
                    <Video
                      key={video._id}
                      video_id={video._id}
                      video={video.video}
                      deleted={video.deleted}
                      username={video.user.username}
                      image={photo}
                      hashtags={video.hashtags}
                      likes={video.likes}
                      views={video.views}
                      date={video.createdAt}
                      liked={video.liked}
                      allVideos={allVideos}
                      setAllVideos={setAllVideos}
                      isOwner={user === username}
                      profile={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default Profile;
