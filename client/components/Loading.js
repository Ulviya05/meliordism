import React from 'react'
import styles from '../styles/Loading.module.css';

function Loading() {
  return (
    <div className={styles.preloader} bis_skin_checked="1" >
      <div class={styles.lineLoader} bis_skin_checked="1">
        <div class={styles.line} bis_skin_checked="1"></div>
        <div class={styles.line} bis_skin_checked="1"></div>
        <div class={styles.line} bis_skin_checked="1"></div>
        <div class={styles.line} bis_skin_checked="1"></div>
        <div class={styles.line} bis_skin_checked="1"></div>
        <div class={styles.line} bis_skin_checked="1"></div>
        <div class={styles.line} bis_skin_checked="1"></div>
        <div class={styles.line} bis_skin_checked="1"></div>
        <div class={styles.line} bis_skin_checked="1"></div>
        <div class={styles.line} bis_skin_checked="1"></div>
        <div class={styles.line} bis_skin_checked="1"></div>
      </div>
    </div>
  )
}

export default Loading