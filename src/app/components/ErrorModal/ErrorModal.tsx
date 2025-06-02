import styles from './ErrorModal.module.css';

type ErrorModalProps = {
  message: string;
  onClose: () => void;
};

const ErrorModal = ({ message, onClose }: ErrorModalProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Error</h2>
        <p className={styles.message}>{message}</p>
        <button className={styles.button} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default ErrorModal; 