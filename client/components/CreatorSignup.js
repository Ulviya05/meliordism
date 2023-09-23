import React, { useState } from 'react';
import styles from '../styles/Login.module.css';
import axios from 'axios';

function CreatorSignup() {
  const [isCodeSelected, setIsCodeSelected] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const handleRadioChange = () => {
    setIsCodeSelected(!isCodeSelected);
  };

  function createCreator() {
    const image = "user-icon.jpeg";
    let type = "creator";
    axios
      .post(`${process.env.BASE_URL}/user/`, {
        username: username,
        password: password,
        image: image,
        type: type,
        content: code
      })
      .then(function (response) {
        console.log(response);
        const { data } = response;
        // window.location.href = '/login';
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <div className={styles.heading}>
          <h1>Sign up</h1>
        </div>
        <div className={styles.input}>
          <div className={styles.username}>Username</div>
          <div className={styles.text}>
            <input
              type="text"
              placeholder="Type your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.input}>
          <div className={styles.password}>Password</div>
          <div className={styles.text}>
            <input
              type="password"
              placeholder="Type your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.codeOption}>
          <input
            className={styles.radioButton}
            type="radio"
            id="code"
            name="option"
            value="code"
            checked={isCodeSelected}
            onChange={handleRadioChange}
          />
          <label className={styles.code} htmlFor="code">Code</label>
        </div>
        {isCodeSelected && (
          <div className={styles.text}>
            <input
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        )}
        <div className={styles.login_button}>
          <button onClick={createCreator} type="button">
            SIGN UP
          </button>
        </div>
        <div className={styles.link}>
          Already have an account? <a className={styles.login_link} href="/login">Log in</a>
        </div>
      </div>
    </div>
  );
}

export default CreatorSignup;
