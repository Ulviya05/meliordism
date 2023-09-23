import React, { useEffect, useState } from 'react'
import styles from '../styles/Story.module.css';
import { getRelativeTime } from '@/utils/time';
import axios from 'axios';

function Story({ story_id, likes, story, username, avatar, date, deleted, liked, allStories, setAllStories, user }) {
  const videoDate = new Date(date);
  const relativeTime = getRelativeTime(videoDate);
  console.log("likedl", liked)

  // const [text, setText] = useState("")
  const [isCommentLiked, setIsCommentLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isOwner, setisOwner] = useState(false);
  const [editedContent, setEditedContent] = useState(story);
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
    axios.put(`${process.env.BASE_URL}/story/message/${story_id}`, {
      edited_content: editedContent
    })
      .then(function (response) {
        console.log(response);
        const { data } = response;
        const stories = [...allStories];
        stories.forEach(_story => {
          if (_story._id === story_id) {
            _story.content = data.story.content
          }
        })
        setAllStories(stories)
      })
    setIsEditing(false);
  }

  function delete_story() {
    axios.delete(`${process.env.BASE_URL}/story/message/${story_id}`)
      .then(function (response) {
        console.log(response);
        const { data } = response;
        const stories = [...allStories];
        stories.forEach(_story => {
          if (_story._id === story_id) {
            _story.deleted = true
          }
        })
        setAllStories(stories)
      })

  }

  useEffect(() => {
    setIsCommentLiked(liked);
  }, [liked]);

  console.log("is", isCommentLiked)

  const handleCommentLikeClick = () => {
    setIsCommentLiked(!isCommentLiked);
    const stories = allStories.map(story => {
      if (story._id === story_id) {
        const newLikes = isCommentLiked ? Math.max(story.likes - 1, 0) : story.likes + 1;
        return { ...story, likes: newLikes };
      }
      return story;
    });
    setAllStories(stories);
    axios.post(process.env.BASE_URL + "/story/like", {
      story_id: story_id,
    }, {
      DISABLE_LOADING: true
    })
      .then(function (response) {
        const { data } = response;
        const stories = [...allStories];
        stories.forEach(story => {
          if (story._id === story_id) {
            story.likes = data.story.likes;
          }
        });
        setAllStories(stories);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const heartIconClass = isCommentLiked ? 'bi-heart-fill' : 'bi-heart';
  return (
    <>
      {!deleted && (
        <div className={styles.storyContainer}>
          <div className={styles.left}>
            <div className={styles.avatar}>
              <img src={`${process.env.BASE_URL}/photos/${avatar}`} alt="Avatar" />
            </div>
          </div>
          <div className={styles.middle}>
            <div className={styles.middleTop}>
              <a href={`/profile/${username}`} className={styles.username}>@{username}</a>
              {isEditing ? (
                <i className={`bi bi-trash ${styles.trashIcon}`} onClick={delete_story}></i>
              ) : (
                isOwner && (
                  <i className={`bi bi-pencil-square ${styles.editIcon}`} onClick={handleEditClick}></i>
                )
              )}
            </div>
            <div className={styles.story}>
              {!isEditing ? (
                <p>{story}</p>
              ) : (
                <div className={styles.comment_container}>
                  <div className={styles.comment_text} style={{ paddingLeft: 0 }}>
                    <textarea
                      id={`etext-${story_id}`}
                      placeholder="Edit your story"
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
  );
}

export default Story