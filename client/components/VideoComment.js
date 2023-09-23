import { useEffect, useState } from 'react';
import styles from '../styles/VideoComment.module.css';
import axios from 'axios';
import { getRelativeTime } from '@/utils/time';

function VideoComment({ comment_id, username, image, content, likes, date, liked, allComments, setAllComments }) {
  const commentDate = new Date(date);
  const relativeTime = getRelativeTime(commentDate);
  const [isCommentLiked, setIsCommentLiked] = useState(false);
  const [showReplySection, setShowReplySection] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    setIsCommentLiked(liked);
  }, [liked]);

  const handleCommentLikeClick = () => {
    setIsCommentLiked(!isCommentLiked);
    const comments = allComments.map(comment => {
      if (comment._id === comment_id) {
        const newLikes = isCommentLiked ? Math.max(comment.likes - 1, 0) : comment.likes + 1;
        return { ...comment, likes: newLikes };
      }
      return comment;
    });
    setAllComments(comments);
    axios.post(process.env.BASE_URL + "/message/like", {
      message_id: comment_id,
    }, {
      DISABLE_LOADING: true
    })
      .then(function (response) {
        const { data } = response;
        const comments = [...allComments];
        comments.forEach(message => {
          if (message._id === comment_id) {
            message.likes = data.message.likes;
          }
        });
        setAllComments(comments);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const heartIconClass = isCommentLiked ? 'bi-heart-fill' : 'bi-heart';

  return (
    <div className={styles.container}>
      <div className={styles.comment}>
        <div className={styles.left}>
          <div className={styles.avatar}>
            <img src={`${process.env.BASE_URL}/photos/${image}`} alt="Avatar" />
          </div>
          <div className={styles.middle}>
            <div className={styles.middleTop}>
              <a href={`/profile/${username}`} className={styles.username}>{username}</a>
              <div className={styles.content}>{content}</div>
            </div>
            <div className={styles.middleBottom}>
              <div className={styles.commentDate}>{relativeTime}</div>
              {/* <div className={styles.reply} onClick={handleReplyClick}>Reply</div> */}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={`${styles.like} ${isCommentLiked ? styles.clicked : ''}`} onClick={handleCommentLikeClick}>
            <i className={`bi ${heartIconClass} ${styles.heartIcon}`}></i>
          </div>
          <div className={styles.likeNum}>{likes}</div>
        </div>
      </div>

      {/* {showReplySection && (
        <div className={styles.replySection}>
          <div className={styles.comment_text}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              name="text"
              id="text"
              placeholder="Add a tweet..."
            ></textarea>
          </div>
          <button className={styles.post} disabled={!text.trim()} onClick={reply}>
            Post
          </button>
        </div>
      )} */}
    </div>
  )
}

export default VideoComment;
