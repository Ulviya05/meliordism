import React from 'react';
import styles from '../styles/MyHome.module.css';
import MusicTweets from '@/components/MusicTweets';

function Tweets({setLoading}) {


  return (
    <MusicTweets setLoading={setLoading} />
  );
}

export default Tweets;