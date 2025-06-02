"use client";
import { useEffect, useState } from "react";
import styles from "./TargetList.module.css";
import { getTargetSets, saveTargetSet, deleteTargetSet } from "@/app/lib/api-clients/target-set-helper";

interface TargetSet {
  id: string;
  name: string;
  targets: string[];
}

interface TargetListProps {
  onTargetsChange: (targetSet: any) => void;
}

const TargetList = ({ onTargetsChange }: TargetListProps) => {
  const [targets, setTargets] = useState<string[]>([]);
  const [newTarget, setNewTarget] = useState("");
  const [targetSets, setTargetSets] = useState<TargetSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [newSetName, setNewSetName] = useState("");

  useEffect(() => {
    loadTargetSets();
  }, []);

  const loadTargetSets = () => {
    const sets = getTargetSets();
    setTargetSets(sets);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTarget();
    }
  };

  const addTarget = () => {
    if (newTarget.trim() && !targets.includes(newTarget.trim())) {
      const updatedTargets = [...targets, newTarget.trim()];
      setTargets(updatedTargets);
      setNewTarget("");
      onTargetsChange({ targets: updatedTargets });
    }
  };

  const removeTarget = (index: number) => {
    const updatedTargets = targets.filter((_, i) => i !== index);
    setTargets(updatedTargets);
    onTargetsChange({ targets: updatedTargets });
  };

  const saveCurrentSet = () => {
    if (!newSetName.trim()) return;
    
    const newSet: TargetSet = {
      id: crypto.randomUUID(),
      name: newSetName.trim(),
      targets: targets
    };
    
    saveTargetSet(newSet);
    setTargetSets([...targetSets, newSet]);
    setNewSetName("");
  };

  const loadSet = (setId: string) => {
    const set = targetSets.find(s => s.id === setId);
    if (set) {
      setTargets(set.targets);
      setSelectedSet(setId);
      onTargetsChange({ targets: set.targets });
    }
  };

  const deleteSet = (setId: string) => {
    deleteTargetSet(setId);
    setTargetSets(targetSets.filter(s => s.id !== setId));
    if (selectedSet === setId) {
      setTargets([]);
      setSelectedSet("");
      onTargetsChange({ targets: [] });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.savedSets}>
        <h3>Saved Target Sets</h3>
        <div className={styles.setList}>
          {targetSets.map((set) => (
            <div key={`set-${set.id || crypto.randomUUID()}`} className={styles.setItem}>
              <button
                className={`${styles.setButton} ${selectedSet === set.id ? styles.selected : ''}`}
                onClick={() => loadSet(set.id)}
              >
                {set.name}
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => deleteSet(set.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className={styles.saveSet}>
          <input
            type="text"
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
            placeholder="New set name"
            className={styles.input}
          />
          <button
            onClick={saveCurrentSet}
            disabled={!newSetName.trim() || targets.length === 0}
            className={styles.saveButton}
          >
            Save Current Set
          </button>
        </div>
      </div>
      <div className={styles.targetInput}>
        <input
          type="text"
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter target number"
          className={styles.input}
        />
        <button onClick={addTarget} className={styles.addButton}>
          Add Target
        </button>
      </div>
      <div className={styles.targetList}>
        {targets.map((target, index) => (
          <div key={`target-${target}-${index}`} className={styles.targetItem}>
            <span>{target}</span>
            <button
              onClick={() => removeTarget(index)}
              className={styles.removeButton}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TargetList;