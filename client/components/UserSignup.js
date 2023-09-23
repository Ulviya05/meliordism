import React, { useEffect, useState } from 'react';
import styles from '../styles/Login.module.css';
import axios from 'axios';

function UserSignup() {
  function createUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const image = "user-icon.jpeg";
    const type = "user";

    axios
      .post(`${process.env.BASE_URL}/user/`, {
        username: username,
        password: password,
        image: image,
        type: type
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
            <input id="username" type="text" placeholder="Type your username" />
          </div>
        </div>
        <div className={styles.input}>
          <div className={styles.password}>Password</div>
          <div className={styles.text}>
            <input id="password" type="password" placeholder="Type your password" />
          </div>
        </div>
        <div className={styles.login_button}>
          <button onClick={createUser} type="button">
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

export default UserSignup;

