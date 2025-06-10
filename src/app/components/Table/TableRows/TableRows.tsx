"use client";
import { useState } from "react";
import { BsTrash3, BsPencil } from "react-icons/bs";

import styles from './TableRows.module.css';
import InputRow from '../InputRow/InputRow';

type TableRowsProps = {
  rows: string[][];
  onDeleteClick?: (index: number) => void;
  onEditClick?: (index: number) => void;
  columns: string[];
  deleteEnabled: boolean;
  selectable?: boolean;
  editable?: boolean;
  onRowAddClick?: (rowObject: any) => void;
  onSave?: (obj: any) => void;
  allowAdd: boolean;
};

const TableRows = ({
  columns,
  deleteEnabled,
  editable,
  onDeleteClick,
  onEditClick,
  onRowAddClick,
  onSave,
  rows,
  selectable,
  allowAdd,
}: TableRowsProps) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  return (
    <tbody className={styles.tbody}>
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex} className={styles.tr}>
          {row.map((cell: any, cellIndex: number) => (
            <td key={cellIndex} className={styles.td}>{cell}</td>
          ))}
          {!selectable ? (
            <td className={styles.td}>
              {editable && <BsPencil className={styles.editIcon} onClick={() => onEditClick && onEditClick(rowIndex)} />}
              {deleteEnabled && <BsTrash3 className={styles.deleteIcon} onClick={() => onDeleteClick && onDeleteClick(rowIndex)} />}
            </td>
          ) : (
            <>
              {onRowAddClick && (
                <td className={styles.td}>
                  <button className={selectedRows.includes(rowIndex) ? styles.selected : styles.button} onClick={(e) => {
                    onRowAddClick(row);
                    setSelectedRows([...selectedRows, rowIndex]);
                  }}>Select</button>
                </td>
              )}
            </>
          )}
        </tr>
      ))}
      {onRowAddClick && editable && allowAdd && (
        <InputRow
          columns={columns}
          onSave={onSave}
          setAddMode={() => {}}
        />
      )}
    </tbody>
  );
};

export default TableRows;