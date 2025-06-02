"use client";
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './InputRow.module.css';

type InputRowProps = {
  columns: string[];
  onSave?: (obj: any) => void | undefined;
  setAddMode: (addMode: boolean) => void;
};

const InputRow = ({ columns, onSave, setAddMode }: InputRowProps) => {
  const [newRow, setNewRow] = useState<string[]>(Array(columns.length).fill(""));

  const handleInputChange = (index: number, value: string) => {
    const updatedRow = [...newRow];
    updatedRow[index] = value;
    setNewRow(updatedRow);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(newRow);
    }
    setAddMode(false);
  };

  return (
    <tr className={styles.tr}>
      {columns.map((column, index) => (
        <td key={index} className={styles.td}>
          <input 
            className={styles.input}
            value={newRow[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        </td>
      ))}
      <td className={styles.td}>
        <button className={styles.button} onClick={handleSave}>Save</button>
        <button className={styles.button} onClick={() => setAddMode(false)}>Cancel</button>
      </td>
    </tr>
  );
};

export default InputRow;