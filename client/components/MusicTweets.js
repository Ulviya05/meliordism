import React, { useEffect, useState } from 'react';
import styles from '../styles/Tweets.module.css';
import Header from './Header';
import Tweet from './Tweet';
import Sidebar from './Sidebar';
import axios from 'axios';

function MusicTweets({setLoading}) {
  const label = 'Music Tweets';

  const [allTweets, setAllTweets] = useState([]);
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
    fetchTweet();
  }, []);


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

  const fetchTweet = async () => {
    try {
      const response = await axios.get(process.env.BASE_URL + '/tweet/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("id")}`
        }
      });
      const sortedTweets = response.data.tweets.reverse();
      setAllTweets(sortedTweets);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };


  function send() {
    axios
      .post(process.env.BASE_URL + '/tweet', {
        content: text,
      })
      .then(async function (response) {
        fetchTweet();
        setText('');
      })
      .catch(function (error) {
        console.error('Error sending tweet:', error);
      });
  }

  console.log(allTweets);

  return (
    <div className={styles.tweets}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <Header allTweets={allTweets} setAllTweets={setAllTweets} />
      <div className={styles.tweetsContainer}>
        <div className={styles.space}></div>
        {/* <h1 className={styles.label}>{label}</h1> */}
        <div className={styles.tweet}>
          {allTweets.map((tweet) => (
            console.log(tweet.liked),
            <Tweet
              key={tweet._id}
              tweet_id={tweet._id}
              tweet={tweet.content}
              likes={tweet.likes}
              username={tweet.user?.username}
              avatar={tweet.user?.image}
              date={tweet.createdAt}
              deleted={tweet.deleted}
              liked={tweet.liked}
              allTweets={allTweets}
              setAllTweets={setAllTweets}
              user={user}
              type={type}
            />
          ))}
        </div>
      </div>
      {type === 'creator' || type === 'user' || type === 'pro creator' || type === 'pro user' || type === 'partner' ? (
        <div className={styles.addComment}>
          <i className={`bi bi-emoji-smile ${styles.emoji}`}></i>
          <div className={styles.comment_text}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              name="text"
              id="text"
              placeholder="Add a tweet..."
            ></textarea>
          </div>
          <button className={styles.post} onClick={send} disabled={!text.trim()}>
            Post
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default MusicTweets;
