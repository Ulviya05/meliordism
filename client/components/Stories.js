import React, { useEffect, useState } from 'react'
import styles from '../styles/Stories.module.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Story from './Story';
import axios from 'axios';

function Stories({setLoading}) {
    const label = 'Journey to Memories';

    let [allStories, setAllStories] = useState([]);
    const [text, setText] = useState('');
    const [type, setType] = useState([]);
    const [user, setUser] = useState("");
    const [timerExpired, setTimerExpired] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimerExpired(true);
        }, 1000);

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
        fetchStory();
    }, []);

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = localStorage.getItem("username");
                const type = localStorage.getItem("type");
                if (!type || type === "user") {
                    window.location.href = "./pro"
                }
                setUser(user)
                setType(type)
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        const handleEnterKey = (event) => {
            if (event.keyCode === 13 && !event.shiftKey && text.trim() !== '') {
                event.preventDefault();
                send();
            }
        };

        document.addEventListener('keydown', handleEnterKey);

        return () => {
            document.removeEventListener('keydown', handleEnterKey);
        };
    }, [text]);

    const fetchStory = async () => {
        try {
            const response = await axios.get(process.env.BASE_URL + '/story/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("id")}`
                }
            });
            const sortedStories = response.data.stories.reverse();
            setAllStories(sortedStories);
        } catch (error) {
            console.error('Error fetching stories:', error);
        }
    };


    function send() {
        axios
            .post(process.env.BASE_URL + '/story', {
                content: text,
            })
            .then(async function (response) {
                fetchStory();
                setText('');
            })
            .catch(function (error) {
                console.error('Error sending story:', error);
            });
    }

    return (
        <div className={styles.stories}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <Header allStories={allStories} setAllStories={setAllStories} />
            <div className={styles.storiesContainer}>
                <div className={styles.space}></div>
                {/* <h1 className={styles.label}>{label}</h1> */}
                <div className={styles.story}>
                    {type === "pro creator" || type === "pro user" || type === "partner" || type === "creator" ? (
                        allStories.length > 0 ? (
                            allStories.map((story) => (
                                <Story
                                    key={story._id}
                                    story_id={story._id}
                                    story={story.content}
                                    likes={story.likes}
                                    username={story.user?.username}
                                    avatar={story.user?.image}
                                    date={story.createdAt}
                                    deleted={story.deleted}
                                    liked={story.liked}
                                    allStories={allStories}
                                    setAllStories={setAllStories}
                                    user={user}
                                />
                            ))
                        ) : (
                            timerExpired && (
                                <div className={styles.no}>
                                    No story found.
                                </div>
                            )               
                        )
                    ) : (
                        (!type || type==="user") && (
                            <>
                            {/* <div className={styles.space}></div>
                            <div className={styles.storyPayContainer}>
                                <div className={styles.info}>
                                    <div className={styles.price}>
                                        <div className={styles.dollar}>$</div>
                                        <div className={styles.priceNum}>10</div>
                                        <div className={styles.duration}>/month</div>
                                    </div>
                                    <div className={styles.middle}>
                                        <div className={styles.features}>
                                            <i className={`bi bi-check2 ${styles.featureIcon}`}></i>
                                            <div className={styles.feature}>Unlock the stories of the songs</div>
                                        </div>
                                    </div>
                                    <div className={styles.buyButtonContainer}>
                                        <button className={styles.buyButton}>Buy now</button>
                                    </div>
                                </div>
                            </div> */}
                            </>
                        )
                    )}
                </div>
            </div>

            {type === 'creator' || type === 'pro creator' || type === 'partner' ? (
                <div className={styles.addComment}>
                    <i className={`bi bi-emoji-smile ${styles.emoji}`}></i>
                    <div className={styles.comment_text}>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            name="text"
                            id="text"
                            placeholder="Add a story..."
                        ></textarea>
                    </div>
                    <button className={styles.post} onClick={send} disabled={!text.trim()}>
                        Post
                    </button>
                </div>
            ) : null}
        </div>
    )
}

export default Stories;