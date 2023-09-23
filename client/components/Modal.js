import React, { useEffect, useRef } from 'react';
import styles from '../styles/Modal.module.css';

function Modal({ onClose, children }) {
  const modalRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.modal}>
      <div className={styles.closeIcon} onClick={onClose}>
        <i className="bi bi-x"></i>
      </div>
      <div className={styles.modalContent} ref={modalRef}>
        {children}
      </div>
    </div>
  );
}

export default Modal;

