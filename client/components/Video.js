import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Video.module.css';
import VideoComment from './VideoComment';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Modal from './Modal';
import axios from 'axios';
import { getRelativeTime } from '@/utils/time';

function Video({ video_id, hashtags, image, video, deleted, username, likes, views, date, liked, allVideos, setAllVideos, isOwner, profile }) {
  const [text, setText] = useState("")
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState([]);
  const [user, setUser] = useState([]);
  const [allComments, setAllComments] = useState([]);

  const videoDate = new Date(date);
  const relativeTime = getRelativeTime(videoDate);
  const videoRef = useRef(null);
  let hoverTimer = null;
  


  useEffect(() => {
    const getUser = async () => {
      try {
        const type = localStorage.getItem('type');
        const username = localStorage.getItem('username');
        setType(type);
        setUser(username)
      } catch (error) {
        console.error('Error:', error);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const parts = currentPath.split('/');
    const urlVideoId = parts[parts.length - 1];

    if (urlVideoId === video_id) {
      setIsModalOpen(true);
      axios.post(process.env.BASE_URL + "/video/view", {
        video_id: video_id
      }, {
        DISABLE_LOADING: true
      })
        .then(function (response) {
          const { data } = response;
          setAllComments(data.video.messages);
        })
    }
  }, [liked, video_id, setAllComments]);



  const handleVideoHover = (e) => {
    const videoElement = videoRef.current;
    if (e.type === 'mouseover') {
      hoverTimer = setTimeout(() => {
        axios.post(process.env.BASE_URL + "/video/view", {
          video_id: video_id
        }, {
          DISABLE_LOADING: true
        })
          .then(function (response) {
            const { data } = response;
            const videos = [...allVideos];
            videos.forEach(_video => {
              if (_video._id === video_id) {
                _video.views = data.video.views;
              }
            });
            setAllVideos(videos);
          })
      }, 3000)
      videoElement.play();
    } else if (e.type === 'mouseout') {
      clearTimeout(hoverTimer);
      videoElement.pause();
    }
  };

  const openVideoRef = useRef(null);

  useEffect(() => {
    if (isModalOpen) {
      const videoElement = openVideoRef.current;
      videoElement.play();
      
    }
  }, [isModalOpen]);
  

 
  function send(type = "message") {
    axios
      .post(process.env.BASE_URL + "/message", {
        content: text,
        video_id: video_id,
      })
      .then(async function (response) {
        const vid = (await axios.get(process.env.BASE_URL + "/video/" + video_id))?.data;
        console.log("vid", vid)
        const updatedVideos = allVideos.map(_video => {
          if (_video._id === video_id) {
            return { ..._video, messages: vid.video.messages };
          }
          return _video;
        });

        console.log("jj", vid.video.messages)

        setAllVideos(updatedVideos);
        setAllComments(vid.video.messages);
        setText("");
      })
      .catch(function (error) {
        console.error("Error sending message:", error);
      });
  }


  useEffect(() => {
    setIsLiked(liked);
  }, [liked]);

  const handleLikeClick = () => {
    if (type === null) {
      window.location.href = '/login';
    } else {
      setIsLiked(!isLiked);
      const updatedVideos = allVideos.map(_video => {
        if (_video._id === video_id) {
          const newLikes = isLiked ? Math.max(_video.likes - 1, 0) : _video.likes + 1;
          return { ..._video, likes: newLikes };
        }
        return _video;
      });
      setAllVideos(updatedVideos);
      axios.post(process.env.BASE_URL + "/video/like", {
        video_id: video_id
      }, {
        DISABLE_LOADING: true
      })
        .then(function (response) {
          const { data } = response;
          const videos = [...allVideos];
          videos.forEach(_video => {
            if (_video._id === video_id) {
              _video.likes = data.video.likes;
              _video.views = data.video.views;
            }
          });
          setAllVideos(videos);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }


  const handleCommentClick = () => {
    if (type === null) {
      window.location.href = '/login';
    } else {
      setIsModalOpen(true);
      const newURL = `${window.location.origin}/explore/${video_id}`;
      window.history.replaceState(null, null, newURL);
      console.log("!")
      axios
        .post(process.env.BASE_URL + "/video/view", {
          video_id: video_id
        })
        .then(function (response) {
          const { data } = response;
          const videos = [...allVideos];
          console.log("iuhygftdrrf", data)
          videos.forEach(_video => {
            if (_video._id === video_id) {
              setAllComments(data.video.messages)
              _video.views = data.video.views
            }
          })
          setAllVideos(videos)
        });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    let originalURL;

    if (profile) {
      originalURL = `${window.location.origin}/profile/${username}`;
    } else {
      originalURL = `${window.location.origin}/explore`;
    }

    window.history.replaceState(null, null, originalURL);

  };


  const handleTextareaKeyDown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  function delete_video() {
    setTimeout(() => {
      axios.delete(`${process.env.BASE_URL}/video/${video_id}`)
        .then(function (response) {
          console.log(response);
          const { data } = response;
          const videos = [...allVideos];
          videos.forEach(_video => {
            if (_video._id === video_id) {
              _video.deleted = true
            }
          })
          setAllVideos(videos)
          handleModalClose();
        })
    }, 2000);
  }

  const disablePictureInPicture = () => {
    if (openVideoRef.current) {
      openVideoRef.current.disablePictureInPicture = true;
      openVideoRef.current.controlsList = 'nodownload noplaybackrate nopictureinpicture';
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const togglePlay = () => {
    const videoElement = openVideoRef.current;
    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    setIsPlaying(!isPlaying);
  };


  const heartIconClass = isLiked ? 'bi-heart-fill' : 'bi-heart';

  return (
    <>
      {!deleted && (
        <div className={`col-xl-4 col-lg-4 col-md-6 col-12 ${styles.videoContainer}`}>
          <a href={`/profile/${username}`} className={styles.username}>@{username}</a>
          <div className={styles.video}>
            <video ref={videoRef} muted="muted" onMouseOver={handleVideoHover} onMouseOut={handleVideoHover} onClick={handleCommentClick} src={`${process.env.BASE_URL}/uploads/${video}`} alt="Video" />
          </div>
          {/* <div>{video}</div> */}
          <div className={styles.interaction}>
            <div className={`${styles.likeIcon} ${isLiked ? styles.clicked : ''}`} onClick={handleLikeClick}>
              <i className={`bi ${heartIconClass} ${styles.heartIcon}`}></i>
            </div>
            <div className={`bi bi-chat ${styles.commentIcon}`} onClick={handleCommentClick}></div>
          </div>
          {hashtags.map((tag, index) => (
            <a key={index} href={`/explore?query=${tag}`} className={styles.hashtagLink}>
              #{tag}
              {index < hashtags.length - 1 && ' '}
            </a>
          ))}
          <div className={styles.interactionNum}>
            <div className={styles.like}>{likes} likes |&nbsp;</div>
            <div className={styles.view}>{views} views</div>
          </div>

          {isModalOpen && (
            <Modal onClose={handleModalClose}>
              <div className={styles.container}>
                <div className={styles.modalVideo}>
                  <video ref={openVideoRef} onClick={togglePlay} className={styles.videoElement} onLoadedMetadata={disablePictureInPicture} src={`${process.env.BASE_URL}/uploads/${video}`} alt="Video" controls />
                </div>
                <div className={styles.right}>
                  <div className={styles.top}>
                    <div className={styles.topLeft}>
                      <div className={styles.avatar}>
                        <img src={`${process.env.BASE_URL}/photos/${image}`} alt="Avatar" />
                      </div>
                      {/* <div className={styles.videoUsername}>{username}</div> */}
                      <a href={`/profile/${username}`} className={styles.videoUsername}>{username}</a>
                    </div>
                    {isOwner && (
                      <i className={`bi bi-trash ${styles.trashIcon}`} onClick={delete_video}></i>
                    )}
                  </div>
                  <div className={styles.middle}>
                    <div className={styles.description}>
                      <div className={styles.avatar}>
                        <img src={`${process.env.BASE_URL}/photos/${image}`} alt="Avatar" />
                      </div>
                      <div className={styles.descriptionContent}>
                        <a href={`/profile/${username}`} className={styles.videoUsername}>{username}</a>
                        <div className={styles.hashtagsModal}>
                          {hashtags.map((tag, index) => (
                            <a key={index} href={`/explore?query=${tag}`} className={styles.hashtagLink}>
                              #{tag}
                              {index < hashtags.length - 1 && ' '}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className={styles.comments}>
                      {allComments.map((comment) => (
                        <VideoComment
                          key={comment._id}
                          comment_id={comment._id}
                          content={comment.content}
                          username={comment.user.username}
                          image={comment.user.image}
                          likes={comment.likes}
                          date={comment.createdAt}
                          liked={comment.liked}
                          allComments={allComments}
                          setAllComments={setAllComments}
                        />
                      ))}
                    </div>
                  </div>
                  <div className={styles.bottom}>
                    <div className={styles.interactionInfo}>
                      <div className={styles.interaction}>
                        <div className={`${styles.likeIconEx} ${isLiked ? styles.clicked : ''}`} onClick={handleLikeClick}>
                          <i className={`bi ${heartIconClass} ${styles.heartIcon}`}></i>
                        </div>
                        <div className={`bi bi-chat ${styles.commentIconEx}`} onClick={handleCommentClick}></div>
                      </div>
                      <div className={styles.videoLike}>{likes} likes</div>
                      <div className={styles.date}>{relativeTime}</div>
                      {/* <div className={styles.videoView}>{view} views</div> */}
                    </div>
                  </div>
                  <div className={styles.addComment}>
                    <i className={`bi bi-emoji-smile ${styles.emoji}`}></i>
                    <div className={styles.comment_text}>
                      <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={handleTextareaKeyDown} name="" id="text" placeholder="Add a comment..." ></textarea>
                    </div>
                    <button
                      className={styles.post}
                      onClick={send}
                      disabled={!text.trim()}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}
    </>
  );
}

export default Video;



