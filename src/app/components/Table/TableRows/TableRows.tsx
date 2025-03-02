import styles from './TableRows.module.css';
import { BsTrash3, BsPencil } from "react-icons/bs";
import InputRow from '../InputRow/InputRow';

type TableRowsProps = {
  rows: string[][];
  onDeleteClick?: (index: number) => void;
  onEditClick?: (index: number) => void;
  columns: string[];
  deleteEnabled: boolean;
  selectable?: boolean;
  editable?: boolean;
  addMode: boolean;
  onRowAddClick?: (rowObject: any) => void;
  onSave?: (obj: any) => void;
  setAddMode: (addMode: boolean) => void;
};

const TableRows = ({
  addMode,
  columns,
  deleteEnabled,
  editable,
  onDeleteClick,
  onEditClick,
  onRowAddClick,
  onSave,
  rows,
  selectable,
  setAddMode,
}: TableRowsProps) => {
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
                  <button className={styles.button} onClick={(e) => onRowAddClick(row)}>Select</button>
                </td>
              )}
            </>
          )}
        </tr>
      ))}
      {addMode && (
        <InputRow
          columns={columns}
          onSave={onSave}
          setAddMode={setAddMode}
        />
      )}
    </tbody>
  );
};

export default TableRows;