import React from 'react';
import styles from '../styles/MyHome.module.css';
import Stories from '@/components/Stories';

function Story({setLoading}) {


  return (
     <Stories setLoading={setLoading} />
  );
}

export default Story;
