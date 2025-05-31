import styles from './DeleteConfirmation.module.css';

type DeleteConfirmationProps = {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const DeleteConfirmation = ({ itemName, onConfirm, onCancel }: DeleteConfirmationProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Confirm Delete</h2>
        <p className={styles.message}>
          Are you sure you want to delete {itemName}? This action cannot be undone.
        </p>
        <div className={styles.buttonGroup}>
          <button 
            className={styles.deleteButton} 
            onClick={onConfirm}
          >
            Delete
          </button>
          <button 
            className={styles.cancelButton} 
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation; 