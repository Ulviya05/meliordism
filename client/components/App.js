import React, { useEffect, useState } from 'react';
import Chatbot, { createChatBotMessage } from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import styles from '../styles/App.module.css';
import ActionProvider from './ActionProvider';
import MessageParser from './MessageParser';
import config from './config';
import Explore from './Explore';

function App({ recipient_id, video_id }) {
  App.recipient_id = recipient_id
  const [chatbotOpen, setChatbotOpen] = useState(true);
  const [closeButtonVisible, setCloseButtonVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCloseButtonVisible(true);
    }, 250);
  }, []);


  const updatedMessages = [
    createChatBotMessage("Hey there! Exciting news from Meliordism Video Bot! 🎉 One of our videos has achieved an impressive milestone – 3000 likes and 3000 views. 🚀"),
    createChatBotMessage("We're wondering if you'd like to cooperate with the video's creator. Your collaboration could help this video reach even more people and achieve great things."),
    createChatBotMessage(<a className={styles.link} href={`${window.location.origin}/explore/${video_id}`}>Video Link</a>, { widget: "learningOptions" }),
  ];

  config.initialMessages = updatedMessages;

  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
    if (!closeButtonVisible) {
      setTimeout(() => {
        setCloseButtonVisible(!closeButtonVisible);
      }, 250);
    } else {
      setCloseButtonVisible(!closeButtonVisible);
    }
  };

  const handleChatbotHeaderClick = () => {
    if (!chatbotOpen) {
      toggleChatbot();
    }
  };

  return (
    <div className={`${styles.container} ${chatbotOpen ? styles.chatbotOpen : styles.containerClosed}`}>
      {Explore.video_id !== "undefined" && closeButtonVisible && (
        <img
          className={`${styles.close} ${!chatbotOpen ? styles.open : ''}`}
          onClick={toggleChatbot}
          src="/close-circle.svg"
        />
      )}
      {Explore.video_id !== "undefined" && (
        <div
          className={`${styles.App} ${chatbotOpen ? styles.chatbotOpen : ''}`}
          onClick={handleChatbotHeaderClick}
        >
          <header className={styles.AppHeader}>
            <div className={styles.chatbotContainer}>
              <Chatbot config={config} actionProvider={ActionProvider} messageParser={MessageParser} />
            </div>
          </header>
        </div>
      )}
    </div>
  );


}

export default App;

