import React, { useEffect, useState } from 'react'
import styles from '../styles/Notifications.module.css';
import Header from './Header';
import Sidebar from './Sidebar';
import axios from 'axios';
import { set } from 'lodash';

function Notifications({setLoading}) {
    const [type, setType] = useState(null);
    let [notifications, setNotifications] = useState(null);
    const [allseen, setAllSeen] = useState(false);
    const [timerExpired, setTimerExpired] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
          setTimerExpired(true);
        }, 5000);
      
        return () => {
          clearTimeout(timer);
        };
      }, []);
      
      if(!timerExpired) {
        setLoading(true)
      } else {
        setLoading(false)
      }
      

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
            axios.get(process.env.BASE_URL + "/user/notifications", {
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
      

    const seen = (interaction_id) => {
        axios.put(`${process.env.BASE_URL}/interaction/seen`, {
            interaction_id: interaction_id
        })
            .then(function (response) {
                setNotifications(prevNotifications => {
                    const updatedNotifications = prevNotifications.map(notification =>
                        notification._id === interaction_id ? { ...notification, seen: true } : notification
                    );

                    if (updatedNotifications.every(notification => notification.seen !== false)) {
                        return [];
                    } else {
                        return updatedNotifications;
                    }
                });
            })
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

    // Filter and reverse unseen notifications
    const unseenNotifications = (notifications || []).filter(notification => !notification.seen).reverse();

    // Filter and reverse seen notifications
    const seenNotifications = (notifications || []).filter(notification => notification.seen).reverse();

    // Concatenate the two arrays to get the desired order
    notifications = unseenNotifications.concat(seenNotifications);

    const accept = (interaction_id) => {
        axios.put(`${process.env.BASE_URL}/interaction`, {
            interaction_id: interaction_id,
            status: 'accepted'
        })
            .then(function (response) {
                setNotifications(prevNotifications => {
                    const updatedNotifications = prevNotifications.map(notification =>
                        notification._id === interaction_id ? { ...notification, status: 'accepted' } : notification
                    );

                    if (updatedNotifications.every(notification => notification.status !== 'sent')) {
                        return [];
                    } else {
                        return updatedNotifications;
                    }
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    const reject = (interaction_id) => {
        axios.put(`${process.env.BASE_URL}/interaction`, {
            interaction_id: interaction_id,
            status: 'rejected'
        })
            .then(function (response) {
                setNotifications(prevNotifications => {
                    const updatedNotifications = prevNotifications.map(notification =>
                        notification._id === interaction_id ? { ...notification, status: 'rejected' } : notification
                    );

                    if (updatedNotifications.every(notification => notification.status !== 'sent')) {
                        return [];
                    } else {
                        return updatedNotifications;
                    }
                });
            })
    }


    return (
        <section class={styles.container}>
            <div className={styles.sidebar}>
                <Sidebar
                    view={true}
                 />
            </div>
            <Header
                view={true}
            />
            <div className={styles.notificationsContainer}>
                <div class={styles.topBar}>
                    <div class={styles.left}>
                        <div className={styles.label}>Notifications</div>
                        {type === "partner" && !allseen && (notifications.filter(notification => notification.status === 'accepted').length + notifications.filter(notification => notification.status === 'rejected').length) > 0 && (
                            <div className={styles.number}>
                                {notifications.filter(notification => notification.status === 'accepted' && !notification.seen).length + notifications.filter(notification => notification.status === 'rejected' && !notification.seen).length}
                            </div>
                        )}
                        {type === "partner" && allseen && timerExpired &&
                            <div className={styles.number}>
                                    0
                            </div>
                        }
                        {type === 'pro creator' && timerExpired &&(
                            <div className={styles.number}>
                                {notifications.filter(notification => notification.status === 'sent').length}
                            </div>
                        )}
                    </div>
                    <div class={styles.right}>
                        {/* <h3 onclick="allRead()">Mark all as read</h3> */}
                    </div>
                </div>
                {type === 'pro creator' && (
                    <div className={styles.notifications}>
                        {notifications?.filter(
                            (notification) => (notification.status === 'sent')
                        ).length === 0 ? (
                            <div className={styles.notification2}>
                                No new notifications
                            </div>
                        ) : (
                            notifications
                                .filter((notification) => notification.status === 'sent')
                                .map((notification) => (
                                    <div key={notification._id} className={`${styles.notification2}`}>
                                        {notification.status === 'sent' && (
                                            <div>
                                                Good news! Partner {notification.user.username} is interested in collaborating with you.
                                                This collaboration could help your video reach an even wider audience and achieve greater success.
                                                Are you interested in exploring this opportunity further?
                                                <div className={styles.options}>
                                                    <button className={styles.option} onClick={() => accept(notification._id)}>
                                                        Accept
                                                    </button>
                                                    <button className={styles.option} onClick={() => reject(notification._id)}>
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                        )}
                    </div>
                )}

                {type === 'partner' && (
                    <div className={styles.notifications}>
                        {notifications?.filter(
                            (notification) =>
                                (notification.status === 'accepted' || notification.status === 'rejected')
                        ).length === 0 &&timerExpired ? (
                            <div className={styles.notification}>
                                No new notifications
                            </div>
                        ) : (
                            notifications
                                .filter(
                                    (notification) =>
                                        notification.status === 'accepted' || notification.status === 'rejected'
                                )
                                .map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`${styles.notification} ${notification.seen ? styles.seen : styles.unread
                                            }`}
                                        onClick={() => !notification.seen && seen(notification._id)}
                                    >
                                        {notification.status === 'accepted' && (
                                            <div>
                                                Congratulations! Your collaboration request with Creator{' '}
                                                {notification.recipient.username} has been accepted. Get ready to
                                                create amazing content together!
                                            </div>
                                        )}

                                        {notification.status === 'rejected' && (
                                            <div>
                                                We regret to inform you that your collaboration request with Creator{' '}
                                                {notification.recipient.username} has been rejected. Don't worry,
                                                there are plenty of opportunities ahead!
                                            </div>
                                        )}
                                    </div>
                                ))
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Notifications