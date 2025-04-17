"use client";
import { useState, useEffect } from "react";

import styles from "./TargetList.module.css";
import { TargetSet } from "@/app/lib/types";
import { v4 } from "uuid";

type TargetListProps = {
  onTargetsChange: (targets: TargetSet) => void;
};

const TargetList = ({ onTargetsChange }: TargetListProps) => {
  const [targetList, setTargetList] = useState<string[]>([]);
  const [targetSetName, setTargetSetName] = useState("");

  useEffect(() => {
    onTargetsChange({
      name: targetSetName,
      targets: targetList,
    });
  }, [targetList]);

  const addTarget = (target: string) => {
    setTargetList([...targetList, target]);
  };

  const removeTarget = (target: string) => {
    setTargetList(targetList.filter((t) => t !== target));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Target List</h2>
      <div className={styles.targetRow}>
        {targetList.map((target, index) => (
          <div className={styles.targetItem} key={v4()}>
            {target}
            <button onClick={() => removeTarget(target)} className={styles.removeButton}>X</button>
          </div>
        ))}
      </div>
      <input
        className={styles.input}
        type="text"
        placeholder="Target Set Name"
        onChange={(e) => setTargetSetName(e.target.value)}
      />
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
    </div >
  );
};

export default TargetList;