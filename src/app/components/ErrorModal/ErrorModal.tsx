"use client";
import styles from './ErrorModal.module.css';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ErrorModal = ({ isOpen, onClose, message }: ErrorModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Error</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        <div className={styles.content}>
          <p>{message}</p>
        </div>
        <div className={styles.footer}>
          <button onClick={onClose} className={styles.button}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal; 