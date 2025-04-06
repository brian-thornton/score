"use client";
import { useState, useEffect } from "react";

import styles from "./TargetList.module.css";

type TargetListProps = {
  onTargetsChange: (targets: string[]) => void;
};

const TargetList = ({ onTargetsChange }: TargetListProps) => {
  const [targetList, setTargetList] = useState([]);

  useEffect(() => {
    onTargetsChange(targetList);
  }, [targetList]);

  const addTarget = (target) => {
    setTargetList([...targetList, target]);
  };

  const removeTarget = (target) => {
    setTargetList(targetList.filter((t) => t !== target));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Target List</h2>
      <ul className={styles.targetList}>
        {targetList.map((target, index) => (
          <li key={index} className={styles.targetItem}>
            {target}
            <button onClick={() => removeTarget(target)} className={styles.removeButton}>Remove</button>
          </li>
        ))}
      </ul>
      <input
        className={styles.input}
        type="text"
        placeholder="Add target"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addTarget(e.target.value);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
};

export default TargetList;