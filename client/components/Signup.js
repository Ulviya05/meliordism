import React, { useEffect, useState } from 'react';
import styles from '../styles/Signup.module.css';
import axios from 'axios';

function Signup() {
    return (
        <div className={styles.container}>
            <div className={styles.flipCard}>
                <div className={styles.flipCardInner}>
                    <div className={styles.flipCardFront}>
                        <div className={styles.userContainer}>
                            <div className={styles.icon}>
                                <img src="/user-icon.png" alt="Icon" />
                            </div>
                            <div className={styles.user}>User</div>
                            <div className={styles.user_ability}>
                                <div className={styles.ability}>
                                    <i class={`bi bi-check2 ${styles.featureIcon}`}></i>
                                    <div className={styles.feature}>Watch the videos of the content creators </div>
                                </div>
                                <div className={styles.ability}>
                                    <i class={`bi bi-check2 ${styles.featureIcon}`}></i>
                                    <div className={styles.feature}>Add your own thoughts</div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={styles.flipCardBack}>
                        <div className={styles.buyButtonContainer}>
                            <a className={styles.buyButton} href="/signup/user">Sign up</a>
                        </div>
                    </div>
                </div>
            </div>


            <div className={styles.flipCard}>
                <div className={styles.flipCardInner}>
                    <div className={styles.flipCardFront}>
                        <div className={styles.adminContainer}>
                            <div className={styles.icon}>
                                <img src="/user-icon.png" alt="Icon" />
                            </div>
                            <div className={styles.admin}>Creator</div>
                            <div className={styles.admin_ability}>
                                <div className={styles.ability}>
                                    <i class={`bi bi-check2 ${styles.featureIcon}`}></i>
                                    <div className={styles.feature}>Upload videos</div>
                                </div>
                                <div className={styles.ability}>
                                    <i class={`bi bi-check2 ${styles.featureIcon}`}></i>
                                    <div className={styles.feature}>Share Stories</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.flipCardBack}>
                        <div className={styles.buyButtonContainer}>
                            <a className={styles.buyButton} href="/signup/creator">Sign up</a>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className={styles.userContainer}>
        <div className={styles.icon}>
            <img src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png" alt="Icon" />
        </div>
        <div className={styles.user}>User</div>
        <div className={styles.user_ability}>
            <div>You can watch the videos of the admins</div>
            <div>and add your own thoughts</div>
        </div>

    </div> */}
            {/* <div className={styles.adminContainer}>
        <div className={styles.icon}>
            <img src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png" alt="Icon" />
        </div>
        <div className={styles.admin}>Admin</div>
        <div className={styles.admin_ability}>
            <div>You can add video</div>
            <div>You can add story</div>
        </div>
    </div> */}
        </div>
    );
}

export default Signup;