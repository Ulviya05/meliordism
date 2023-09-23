import React, { useEffect, useState } from 'react'
import styles from '../styles/Header.module.css';
import SearchBar from './SearchBar';
import axios from 'axios';

function Header({ allTweets, setAllTweets, allVideos, setAllVideos, allStories, setAllStories, view }) {
    // console.log("uu",notifications)

    const [allseen, setAllSeen] = useState(false);
    const [type, setType] = useState([]);
    const [notifications, setNotifications] = useState([]);

    function logout() {
        localStorage.clear();
        window.location.href = '/login';
    }

    useEffect(() => {
        const getType = async () => {
            try {
                const type = localStorage.getItem('type');
                setType(type);
            } catch (error) {
                console.error('Error:', error);
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


    return (

        <div className={styles.top}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <div className={styles.logo}>
                        <img src="/logo.png" alt="Logo" />
                    </div>
                    <div className={styles.link_meliordism}>
                        <a href="/explore" className={styles.meliordism}>Meliordism</a>
                    </div>
                    {(type === 'user' || type === 'creator' || type === 'partner' || type === 'pro creator' || type === 'pro user') ? (
                        <div className={styles.link_login}>
                            {/* <div className={styles.login} onClick={logout}>Log out</div> */}
                        </div>
                    ) : (
                        <div className={styles.sign}>
                            {/* <div className={styles.link_login}>
                                <a href="/login" className={styles.login}>Log in</a>
                            </div>
                            <div className={styles.link_login}>
                                <a href="/signup" className={styles.login}>Join</a>
                            </div> */}
                        </div>
                    )}

                </div>
                <div className={styles.right}>
                    <div className={styles.searchBar}>
                        <SearchBar
                            allVideos={allVideos}
                            setAllVideos={setAllVideos}
                            allTweets={allTweets}
                            setAllTweets={setAllTweets}
                            allStories={allStories}
                            setAllStories={setAllStories}
                        />
                    </div>
                    <div className={styles.link_amygdala}>
                        <div className={styles.link}>
                            <h3 className={styles.amygdala}>Amygdala</h3>
                            <i class={`bi bi-chevron-down ${styles.down}`}></i>
                        </div>
                        <div className={styles.submenu}>
                            <a href="/stories" className={styles.submenuItem}>Journey to memories</a>
                            <a href="/tweets" className={styles.submenuItem}>Music Tweets</a>
                        </div>
                    </div>
                    {(type === 'creator' || type === 'user' || !type) && (
                        <div className={styles.link_pro}>
                            <div className={styles.link}>
                                <h3 className={styles.pro}>PRO</h3>
                                <i class={`bi bi-chevron-down ${styles.down}`}></i>
                            </div>
                            <div className={styles.submenu}>
                                <a href="/pro" className={styles.submenuItem}>User/Creator</a>
                            </div>
                        </div>)}

                    {(type === 'user' || type === 'pro user') && (
                        <div className={styles.link_new}>
                            <div className={styles.link}>
                                <h3 className={styles.pro}>New</h3>
                                <i class={`bi bi-chevron-down ${styles.down}`}></i>
                            </div>
                            <div className={styles.submenu}>
                                <a href="/tweets" className={styles.submenuItem}>Create Tweet</a>
                            </div>
                        </div>)}
                    {(type === 'creator' || type === 'partner' || type === 'pro creator') && (
                        <div className={styles.link_new}>
                            <div className={styles.link}>
                                <h3 className={styles.pro}>New</h3>
                                <i className={`bi bi-chevron-down ${styles.down}`}></i>
                            </div>
                            <div className={styles.submenu}>
                                <a href="/upload" className={styles.submenuItem}>Upload Video</a>
                                <a href="/tweets" className={styles.submenuItem}>Create Tweet</a>
                                <a href="/stories" className={styles.submenuItem}>Share Story</a>
                            </div>
                        </div>
                    )}
                    {type === 'partner' && (
                        <div className={styles.link_pro2}>
                            <div className={styles.link_pro2}>
                                <div className={styles.notification}>
                                    <a href="/notifications" className={`bi bi-bell ${styles.bell}`}></a>
                                    {!allseen && !view && (notifications.filter(notification => notification.status === 'accepted').length + notifications.filter(notification => notification.status === 'rejected').length) > 0 && (
                                        <div className={styles.notificationCount}>
                                            {notifications.filter(notification => notification.status === 'accepted' && !notification.seen).length + notifications.filter(notification => notification.status === 'rejected' && !notification.seen).length}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {!view && (
                                <div className={styles.submenu}>
                                    {(notifications.length === 0 || allseen) ? (
                                        <div className={styles.submenuItem}>
                                            No new notifications.
                                        </div>
                                    ) : (
                                        (() => {
                                            let lastNotification = null;

                                            for (let i = notifications.length - 1; i >= 0; i--) {
                                                if (!notifications[i].seen && (notifications[i].status === 'accepted' || notifications[i].status === 'rejected')) {
                                                    lastNotification = notifications[i];
                                                    break;
                                                } else if (!notifications[i].seen && (notifications[i].status === 'sent' || notifications[i].status === 'rejected by partner')) {
                                                    continue;
                                                }
                                            }

                                            if (lastNotification) {
                                                return (
                                                    <div key={lastNotification._id} className={styles.submenuItem} onClick={() => seen(lastNotification._id)}>
                                                        {lastNotification.status === 'accepted' && (
                                                            <div>
                                                                Congratulations! Your collaboration request with Creator {lastNotification.recipient.username} has been accepted.
                                                                Get ready to create amazing content together!
                                                            </div>
                                                        )}

                                                        {lastNotification.status === 'rejected' && (
                                                            <div>
                                                                We regret to inform you that your collaboration request with Creator {lastNotification.recipient.username} has been rejected.
                                                                Don't worry, there are plenty of opportunities ahead!
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <div className={styles.submenuItem}>
                                                        No new notifications.
                                                    </div>
                                                );
                                            }
                                        })()
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {type === 'pro creator' && (
                        <div className={styles.link_pro2}>
                            <div className={styles.notification}>
                                <a href="/notifications" className={`bi bi-bell ${styles.bell}`}></a>
                                {!view && (notifications.filter(notification => notification.status === 'sent').length > 0) && (
                                    <div className={styles.notificationCount}>
                                        {notifications.filter(notification => notification.status === 'sent').length}
                                    </div>
                                )}
                            </div>
                            {!view && (
                                <div className={styles.submenu}>
                                    {notifications.length === 0 ? (
                                        <div className={styles.submenuItem}>
                                            No new notifications.
                                        </div>
                                    ) : (
                                        (() => {
                                            const sentNotification = notifications.slice().reverse().find(notification => notification.status === 'sent');
                                            if (sentNotification) {
                                                return (
                                                    <div key={sentNotification._id} className={styles.submenuItem}>
                                                        <>
                                                            Good news! Partner {sentNotification.user.username} is interested in collaborating with you.
                                                            This collaboration could help your video reach an even wider audience and achieve greater success.
                                                            Are you interested in exploring this opportunity further?
                                                            <div className={styles.options}>
                                                                <button className={styles.option} onClick={() => accept(sentNotification._id)}>
                                                                    Accept
                                                                </button>
                                                                <button className={styles.option} onClick={() => reject(sentNotification._id)}>
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </>
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <div className={styles.submenuItem}>
                                                        No new notifications.
                                                    </div>
                                                );
                                            }
                                        })()
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <i class={`bi bi-globe2 ${styles.globeIcon}`}></i>
                </div>
            </div>
        </div>
    )
}

export default Header;