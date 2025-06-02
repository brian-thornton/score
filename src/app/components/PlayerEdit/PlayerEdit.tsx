import { Player } from "@/app/lib/types";
import styles from "./PlayerEdit.module.css";

type PlayerEditProps = {
  player: Player;
  onSave: (player: Player) => void;
  onCancel: () => void;
};

const PlayerEdit = ({ player, onSave, onCancel }: PlayerEditProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updatedPlayer: Player = {
      id: player.id,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };

    onSave(updatedPlayer);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={player.name}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={player.email}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={player.phone}
          className={styles.input}
        />
      </div>
      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.saveButton}>Save</button>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>Cancel</button>
      </div>
    </form>
  );
};

export default PlayerEdit; 