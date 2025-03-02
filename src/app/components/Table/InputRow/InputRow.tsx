"use client";
import { useState } from 'react';

import styles from './InputRow.module.css';
import { v4 as uuidv4 } from 'uuid';

type InputRowProps = {
  columns: string[];
  onSave?: (obj: any) => void | undefined;
  setAddMode: (addMode: boolean) => void;
};

const InputRow = ({ columns, onSave, setAddMode }: InputRowProps) => {
  const [newRow, setNewRow] = useState<any>({});

  return (
    <tr className={styles.tr}>
    {columns.map((column, index) => (
      <td key={index} className={styles.td}>
        <input className={styles.input}
          onChange={() => {
            // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'event' implicitly has an 'any' type.
            setNewRow({ ...newRow, id: uuidv4(), [column.toLowerCase()]: event.target.value });
          }} />
      </td>
    ))}
    <td className={styles.td}>
      <button className={styles.button} onClick={() => {
        setAddMode(false);
        onSave && onSave(newRow);
      }}>
        Save
      </button>
      <button className={styles.button} onClick={() => setAddMode(false)}>Cancel</button>
    </td>
  </tr>
  );
}

export default InputRow;