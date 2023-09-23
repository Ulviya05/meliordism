import React, { useEffect, useState } from 'react'
import styles from '../styles/Tweet.module.css';
import { getRelativeTime } from '@/utils/time';
import axios from 'axios';

function Tweet({ tweet_id, likes, tweet, username, avatar, date, deleted, liked, allTweets, setAllTweets, user, type }) {
  const videoDate = new Date(date);
  const relativeTime = getRelativeTime(videoDate);

  // const [text, setText] = useState("")
  const [isCommentLiked, setIsCommentLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isOwner, setisOwner] = useState(false);
  const [editedContent, setEditedContent] = useState(tweet);
  const [dataType, setDataType] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditedContent(e.target.value);
  };

  useEffect(() => {
    const isOwner = async () => {
      if (user === username) {
        setisOwner(true)
      }
    };

    isOwner();
  }, [user]);


  const edit = () => {
    axios.put(`${process.env.BASE_URL}/tweet/message/${tweet_id}`, {
      edited_content: editedContent
    })
      .then(function (response) {
        console.log(response);
        const { data } = response;
        const tweets = [...allTweets];
        tweets.forEach(_tweet => {
          if (_tweet._id === tweet_id) {
            _tweet.content = data.tweet.content
          }
        })
        setAllTweets(tweets)
      })
    setIsEditing(false);
  }

  function delete_tweet() {
    axios.delete(`${process.env.BASE_URL}/tweet/message/${tweet_id}`)
      .then(function (response) {
        console.log(response);
        const { data } = response;
        const tweets = [...allTweets];
        tweets.forEach(_tweet => {
          if (_tweet._id === tweet_id) {
            _tweet.deleted = true
          }
        })
        setAllTweets(tweets)
      })

  }


  useEffect(() => {
    setIsCommentLiked(liked);
  }, [liked]);

  // console.log("is",isCommentLiked)

  const handleCommentLikeClick = () => {
    if (type === null) {
      window.location.href = '/login';
    } else {
      setIsCommentLiked(!isCommentLiked);
      const tweets = allTweets.map(tweet => {
        if (tweet._id === tweet_id) {
          const newLikes = isCommentLiked ? Math.max(tweet.likes - 1, 0) : tweet.likes + 1;
          return { ...tweet, likes: newLikes };
        }
        return tweet;
      });
      setAllTweets(tweets);
      axios.post(process.env.BASE_URL + "/tweet/like", {
        tweet_id: tweet_id,
      }, {
        DISABLE_LOADING: true
      })
        .then(function (response) {
          const { data } = response;
          const tweets = [...allTweets];
          tweets.forEach(tweet => {
            if (tweet._id === tweet_id) {
              tweet.likes = data.tweet.likes;
            }
          });
          setAllTweets(tweets);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  const heartIconClass = isCommentLiked ? 'bi-heart-fill' : 'bi-heart';

  return (
    <>
      {!deleted && (
        <div className={styles.tweetContainer}>
          <div className={styles.left}>
            <div className={styles.avatar}>
              <img src={`${process.env.BASE_URL}/photos/${avatar}`} alt="Avatar" />
            </div>
          </div>
          <div className={styles.middle}>
            <div className={styles.middleTop}>
              <a href={`/profile/${username}`} className={styles.username}>@{username}</a>
              {isEditing ? (
                <i className={`bi bi-trash ${styles.trashIcon}`} onClick={delete_tweet}></i>
              ) : (
                isOwner && (
                  <i className={`bi bi-pencil-square ${styles.editIcon}`} onClick={handleEditClick}></i>
                )
              )}
            </div>
            <div className={styles.tweet}>
              {!isEditing ? (
                <p>{tweet}</p>
              ) : (
                <div className={styles.comment_container}>
                  <div className={styles.comment_text} style={{ paddingLeft: 0 }}>
                    <textarea
                      id={`etext-${tweet_id}`}
                      placeholder="Edit your tweet"
                      value={editedContent}
                      onChange={handleEditChange}
                      data-type="message"
                    ></textarea>
                  </div>
                  <div className={styles.send}>
                    <button type="button" onClick={edit}>UPDATE</button>
                    {/* <button type="button" onClick={handleCancelClick}>CANCEL</button> */}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.middleBottom}>
              <div className={styles.date}>{relativeTime}</div>
              {/* <div className={styles.reply}>Reply</div> */}
            </div>
          </div>
          <div className={styles.right}>
            <div className={`${styles.like} ${isCommentLiked ? styles.clicked : ''}`} onClick={handleCommentLikeClick}>
              <i className={`bi ${heartIconClass} ${styles.heartIcon}`}></i>
            </div>
            <div className={styles.likeNum}>{likes}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default Tweet;
