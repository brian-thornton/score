import styles from './Confirm.module.css';

type ConfirmProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const Confirm = ({message, onConfirm, onCancel}: ConfirmProps) => {
  return (
    <div>
      <h2 className={styles.header}>Confirm</h2>
      <p className={styles.message}>{message}</p>
      <button className={styles.controlButton} onClick={onConfirm}>Yes</button>
      <button className={styles.controlButton} onClick={onCancel}>No</button>
    </div>
  );
};

export default Confirm;