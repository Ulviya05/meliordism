import React, { useEffect, useState } from 'react'
import styles from '../styles/Pro.module.css';
import Header from './Header';
import Sidebar from './Sidebar';
import axios from 'axios';

function Pro() {
    const label = 'User/Creator';
    const [expirationDate, setExpirationDate] = useState(null);
    const [type, setType] = useState([]);

    useEffect(() => {
        const getType = async () => {
            try {
                const type = localStorage.getItem("type");
                setType(type)
            } catch (error) {
                console.error('Error fetching type:', error);
            }
        };

        getType();
    }, []);

    const updateToProUser = () => {
        if (type === null) {
            window.location.href = '/login';
        } else {
            axios.put(`${process.env.BASE_URL}/user`, {
                type: 'pro user'
            })
                .then(function (response) {
                    console.log(response);
                    const { data } = response;
                    localStorage.clear();
                    window.location.href = '/login';
                })
        }
    }

    const updateToProCreator = () => {
        if (type === null) {
            window.location.href = '/login';
        } else {
            axios.put(`${process.env.BASE_URL}/user`, {
                type: 'pro creator'
            })
                .then(function (response) {
                    console.log(response);
                    const { data } = response;
                    localStorage.clear();
                    window.location.href = '/login';
                })
        }
    }

    useEffect(() => {
        if (type === 'user' || type === 'creator' || type === 'partner' || type === 'pro creator' || type === 'pro user') {
            setTimeout(() => {
                const checkFreeTrial = () => {
                    axios.get(`${process.env.BASE_URL}/user`, {
                    })
                        .then(function (response) {
                            console.log(response);
                            const { data } = response;
                            setExpirationDate(data.user.expirationDate);
                            // console.log(data.user.expirationDate)
                        })
                }

                checkFreeTrial();
            }, 200);
        }
    }, [type]);

    console.log(expirationDate)


    return (
        <div className={styles.userAdmin}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <Header />
            <div className={styles.userAdminContainer}>
                {/* <h1 className={styles.label}>{label}</h1> */}
                <div className={styles.container}>
                    <div className={styles.flipCard}>
                        <div className={styles.flipCardInner}>
                            <div className={styles.flipCardFront}>
                                <div className={styles.userContainer}>
                                    <div className={styles.icon}>
                                        <img src="/user-icon.png" alt="Icon" />
                                    </div>
                                    <div className={styles.user}>Pro User</div>
                                    <div className={styles.user_ability}>
                                        <div className={styles.ability}>
                                            <i class={`bi bi-check2 ${styles.featureIcon}`}></i>
                                            <div className={styles.feature}>Ability to use the program without advertising</div>
                                        </div>
                                        <div className={styles.ability}>
                                            <i class={`bi bi-check2 ${styles.featureIcon}`}></i>
                                            <div className={styles.feature}>The ability to download videos in the program</div>
                                        </div>
                                        <div className={styles.ability}>
                                            <i class={`bi bi-check2 ${styles.featureIcon}`}></i>
                                            <div className={styles.feature}>Being able to read stories about account holders</div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {type && expirationDate !== undefined ? (
                                <div className={styles.flipCardBack}>
                                    <div className={styles.only}>ONLY</div>
                                    <div className={styles.price}>
                                        $10
                                    </div>
                                    <div className={styles.buyButtonContainer}>
                                        <button className={styles.buyButton}>Buy Now!</button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.flipCardBack}>
                                    <div className={styles.try}>Try It Free For</div>
                                    <div className={styles.days}>
                                        30 Days
                                    </div>
                                    <div className={styles.buyButtonContainer}>
                                        <button className={styles.buyButton} onClick={updateToProUser}>Start free trial</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className={styles.flipCard}>
                        <div className={styles.flipCardInner}>
                            <div className={styles.flipCardFront}>
                                <div className={styles.adminContainer}>
                                    <div className={styles.icon}>
                                        <img src="/user-icon.png" alt="Icon" />
                                    </div>
                                    <div className={styles.admin}>Pro Creator</div>
                                    <div className={styles.admin_ability}>
                                        <div className={styles.ability}>
                                            <i class={`bi bi-check2 ${styles.featureIcon}`}></i>
                                            <div className={styles.feature}>Share stories</div>
                                        </div>
                                        <div className={styles.ability}>
                                            <i class={`bi bi-check2 ${styles.featureIcon}`}></i>
                                            <div className={styles.feature}>Contract information (for advertising)</div>
                                        </div>
                                        <div className={styles.ability}>
                                            <i class={`bi bi-check2 ${styles.featureIcon}`}></i>
                                            <div className={styles.feature}>Ability to embed video into the program</div>
                                        </div>
                                        <div className={styles.ability}>
                                            <i class={`bi bi-check2 ${styles.featureIcon}`}></i>
                                            <div className={styles.feature}>Ability to generate income</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {type && expirationDate !== undefined ? (
                                <div className={styles.flipCardBack}>
                                    <div className={styles.only}>ONLY</div>
                                    <div className={styles.price}>
                                        $30
                                    </div>
                                    <div className={styles.buyButtonContainer}>
                                        <button className={styles.buyButton}>Buy Now!</button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.flipCardBack}>
                                    <div className={styles.try}>Try It Free For</div>
                                    <div className={styles.days}>
                                        30 Days
                                    </div>
                                    <div className={styles.buyButtonContainer}>
                                        <button className={styles.buyButton} onClick={updateToProCreator}>Start free trial</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pro;
