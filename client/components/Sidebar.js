import React, { useEffect, useState } from 'react';
import styles from '../styles/Sidebar.module.css';
import axios from 'axios';

function Sidebar({ view }) {
  const [user, setUser] = useState(null);
  const [type, setType] = useState(null);
  const [activeOption, setActiveOption] = useState('explore');
  const [notifications, setNotifications] = useState([]);
  const [allseen, setAllSeen] = useState(false);


  useEffect(() => {
    const getUser = async () => {
      try {
        const currentPath = window.location.pathname;
        const parts = currentPath.split('/');
        const storedActiveOption = parts[1]
        if (storedActiveOption) {
          setActiveOption(storedActiveOption);
        }
        const user = localStorage.getItem("username");
        const type = localStorage.getItem("type");
        setUser(user);
        setType(type);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
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

  const updateActiveOption = (option) => {
    setActiveOption(option);
  };

  function logout() {
    localStorage.clear();
    setActiveOption(null);
    window.location.href = '/login';
  }

  function login() {
    window.location.href = '/login';
  }

  useEffect(() => {
    const checkSeen = async () => {
      try {
        if (notifications.every(notification => notification.status === 'sent' || notification.status === 'rejected by partner' || notification.seen !== false)) {
          setAllSeen(true);
        } else {
          setAllSeen(false);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkSeen();
  }, [notifications]);

  console.log("seen",allseen)

  return (
    <div className={styles.sidebar}>
      <ul>
        <a
          className={activeOption === 'explore' ? `${styles.option} ${styles.active}` : styles.option}
          href="/explore"
          onClick={() => updateActiveOption('explore')}
        >
          <div className={styles.icon}>
            <i className="bi bi-compass"></i>
          </div>
          <li>Explore</li>
        </a>
        <a
          className={activeOption === 'stories' ? `${styles.option} ${styles.active}` : styles.option}
          href="stories"
          onClick={() => updateActiveOption('stories')}
        >
          <div className={styles.icon}>
            <i class={`bi bi-hourglass-split ${styles.storyIcon}`}></i>
          </div>
          <li>Stories</li>
        </a>
        <a
          className={activeOption === 'tweets' ? `${styles.option} ${styles.active}` : styles.option}
          href="/tweets"
          onClick={() => updateActiveOption('tweets')}
        >
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class={`bi bi-feather ${styles.tweetIcon}`} viewBox="0 0 16 16">
              <path d="M15.807.531c-.174-.177-.41-.289-.64-.363a3.765 3.765 0 0 0-.833-.15c-.62-.049-1.394 0-2.252.175C10.365.545 8.264 1.415 6.315 3.1c-1.95 1.686-3.168 3.724-3.758 5.423-.294.847-.44 1.634-.429 2.268.005.316.05.62.154.88.017.04.035.082.056.122A68.362 68.362 0 0 0 .08 15.198a.528.528 0 0 0 .157.72.504.504 0 0 0 .705-.16 67.606 67.606 0 0 1 2.158-3.26c.285.141.616.195.958.182.513-.02 1.098-.188 1.723-.49 1.25-.605 2.744-1.787 4.303-3.642l1.518-1.55a.528.528 0 0 0 0-.739l-.729-.744 1.311.209a.504.504 0 0 0 .443-.15c.222-.23.444-.46.663-.684.663-.68 1.292-1.325 1.763-1.892.314-.378.585-.752.754-1.107.163-.345.278-.773.112-1.188a.524.524 0 0 0-.112-.172ZM3.733 11.62C5.385 9.374 7.24 7.215 9.309 5.394l1.21 1.234-1.171 1.196a.526.526 0 0 0-.027.03c-1.5 1.789-2.891 2.867-3.977 3.393-.544.263-.99.378-1.324.39a1.282 1.282 0 0 1-.287-.018Zm6.769-7.22c1.31-1.028 2.7-1.914 4.172-2.6a6.85 6.85 0 0 1-.4.523c-.442.533-1.028 1.134-1.681 1.804l-.51.524-1.581-.25Zm3.346-3.357C9.594 3.147 6.045 6.8 3.149 10.678c.007-.464.121-1.086.37-1.806.533-1.535 1.65-3.415 3.455-4.976 1.807-1.561 3.746-2.36 5.31-2.68a7.97 7.97 0 0 1 1.564-.173Z" />
            </svg>
          </div>
          <li>Tweets</li>
        </a>
        {type === 'pro creator' || type === 'partner' || type === 'creator' ? (
          <a
            className={activeOption === 'upload' ? `${styles.option} ${styles.active}` : styles.option}
            href="/upload"
            onClick={() => updateActiveOption('upload')}
          >
            <div className={styles.icon}>
              <i class="bi bi-camera-video"></i>
            </div>
            <li>Upload</li>
          </a>
        ) : null}

        {type === 'pro creator' || type === 'partner' ? (
          <>
            {type === 'partner' && (
              !allseen && !view && (
                notifications.filter(notification => ['accepted', 'rejected'].includes(notification.status)).length > 0 && (
                  <div className={styles.notificationCount}>
                    {notifications.filter(notification => ['accepted', 'rejected'].includes(notification.status) && !notification.seen).length}
                  </div>
                )
              )
            )}
            {type === 'pro creator' && (
              !view && (
                notifications.filter(notification => notification.status === 'sent').length > 0 && (
                  <div className={styles.notificationCount}>
                    {notifications.filter(notification => notification.status === 'sent').length}
                  </div>
                )
              )
            )}
            <a
              className={activeOption === 'notifications' ? `${styles.option} ${styles.active}` : styles.option}
              href="/notifications"
              onClick={() => updateActiveOption('notifications')}
            >
              <div className={styles.icon}>
                <i className="bi bi-bell"></i>
              </div>
              <li>Notifications</li>
            </a>
          </>
        ) : null}


        <a
          className={activeOption === 'profile' ? `${styles.option} ${styles.active}` : styles.option}
          href={type ? `/profile/${user}` : '/login'}
          onClick={() => updateActiveOption('profile')}
        >
          <div className={styles.icon}>
            <i className="bi bi-person"></i>
          </div>
          <li>Profile</li>
        </a>
        {type ? (
          <a
            className={styles.option}
            onClick={logout}
          >
            <div className={styles.icon}>
              <i className="bi bi-box-arrow-right"></i>
            </div>
            <li>Log out</li>
          </a>
        ) : (
          <div className={styles.upload_button}>
            <button type="button" onClick={login}>
              Log in
            </button>
          </div>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;

