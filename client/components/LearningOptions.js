import React, { useState } from "react";
import styles from '../styles/LearningOptions.module.css';

const LearningOptions = (props) => {
  const [clickedOptions, setClickedOptions] = useState([]);
  const options = [
    {
      text: "Interested",
      handler: props.actionProvider.handleInterested,
      id: 1,
    },
    {
      text: "Not Interested",
      handler: props.actionProvider.handleNotInterested,
      id: 2
    },
  ];

  const handleOptionClick = (optionId) => {
    if (!clickedOptions.includes(optionId)) {
      setClickedOptions([1, 2]);
      const option = options.find(option => option.id === optionId);
      option.handler();
    }
  };

  const optionsMarkup = options.map((option) => (
    <button
      className={`${styles.learningOptionButton} ${clickedOptions.includes(option.id) ? styles.disabledButton : ''}`}
      key={option.id}
      onClick={() => handleOptionClick(option.id)}
      disabled={clickedOptions.includes(option.id)}
    >
      {option.text}
    </button>
  ));

  return <div className={styles.learningOptionsContainer}>{optionsMarkup}</div>;
};

export default LearningOptions;


