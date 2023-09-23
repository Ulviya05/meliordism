import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Explore.module.css';
import Video from './Video';
import Header from './Header';
import App from './App';
import Sidebar from './Sidebar';
import axios from 'axios';

function Explore() {
  const [allVideos, setAllVideos] = useState([]);
  const [videoIdsToSend, sendVideoIdsToChatbot] = useState([]);
  const [recipient_id, setRecipientId] = useState(null);
  const [type, setType] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const getType = async () => {
      try {
        const type = localStorage.getItem("type");
        setType(type)
      } catch (error) {
        console.error('Error fetching type:', error);
      }
    };

    getType();
  }, []);

  useEffect(() => {
    if (type === 'pro creator' || type === 'partner') {
      const getNotifications = () => {
        axios.get(process.env.BASE_URL + "/user/notifications"
          , {
            DISABLE_LOADING: true
          })
          .then(function (response) {
            const notifications = response.data.notifications;
            setNotifications(notifications);
            console.log("hh", notifications);
          })
          .catch(function (error) {
            console.log(error);
          });
      }

      getNotifications();
    }
  }, [type]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryParamValue = searchParams.get('query');
    const fetchVideos = async () => {
      try {
        const response = await axios.get(process.env.BASE_URL + "/video/");
        const sortedVideos = response.data.videos.sort((a, b) => {
          const scoreA = a.likes + a.views;
          const scoreB = b.likes + b.views;

          if (scoreA === scoreB) {
            return b.likes - a.likes;
          } else {
            return scoreB - scoreA;
          }
        });

        if (type === 'partner') {
          const uniqueUserIds = new Set();
          const videosToSend = sortedVideos.filter(video => {
            if (video.user.type === "pro creator") {
              let isRecipient = true;

              notifications.forEach(notification => {
                if (video.user.username === notification.recipient.username) {
                  isRecipient = false;
                  return;
                }
              });

              if (!uniqueUserIds.has(video.user.uaername) && isRecipient) {
                uniqueUserIds.add(video.user.uaername);
                return video.views >= 0 && video.likes >= 0;
              }

              return false;
            }
          });

          const videoIdsToSend = videosToSend.map((video) => video._id);
          const recipientIdsToSend = videosToSend.map((video) => video.user.username);
          sendVideoIdsToChatbot(videoIdsToSend);
          setRecipientId(recipientIdsToSend);
        }

        setAllVideos(sortedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    // if (!queryParamValue && type && (type !== 'partner' && type !== 'pro creator')) {
    //   fetchVideos();
    //   console.log("1")
    // }

    if (type && (type === 'partner' || type === 'pro creator')) {
      if (notifications) {
        fetchVideos();
        // console.log("2")
      }
    }

    if (!type) {
      fetchVideos();
    }

  }, [type, notifications]);


  const router = useRouter();
  const path = router.query.tag;

  let filteredVideos = allVideos;

  useEffect(() => {
    if (type === 'partner' && videoIdsToSend.length > 0) {
      console.log(videoIdsToSend)
      const timerId = setTimeout(() => {
        setShowApp(true);
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [type, videoIdsToSend]);

  return (
    <div className={styles.explore}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <Header
        allVideos={allVideos}
        setAllVideos={setAllVideos}
      />
      <div className={styles.explore_container}>
        {/* <h1 className={styles.label}>Music Valley</h1> */}
        <div className={styles.content}>
          <div className="row">
            {filteredVideos.map((video) => (
              <Video
                key={video._id}
                video_id={video._id}
                video={video.video}
                deleted={video.deleted}
                username={video.user.username}
                image={video.user.image}
                hashtags={video.hashtags}
                likes={video.likes}
                views={video.views}
                date={video.createdAt}
                liked={video.liked}
                allVideos={allVideos}
                setAllVideos={setAllVideos}
              />
            ))}
          </div>
        </div>
      </div>
      {showApp && <App recipient_id={recipient_id[0]} video_id={videoIdsToSend[0]} />}
    </div>
  );
}

export default Explore;
