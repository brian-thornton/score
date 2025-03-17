"use client";
import { useEffect, useState } from "react";
import styles from "./Table.module.css";
import Filters from "./Filters/Filters";
import TableHeader from "./TableHeader/TableHeader";
import EmptyTable from "./EmptyTable/EmptyTable";
import TableRows from "./TableRows/TableRows";

type TableProps = {
  columns: string[];
  data: string[][];
  addUrl?: string;
  allowAdd?: boolean;
  deleteEnabled: boolean;
  editable?: boolean;
  emptyText?: string;
  enableFilter?: boolean;
  onDeleteClick?: (index: number) => void;
  onDone?: () => void;
  onEditClick?: (index: number) => void;
  onRowAddClick?: (rowObject: any) => void;
  onSave?: (obj: any) => void;
  selectable?: boolean;
  tableHeading?: string;
};

const Table = ({
  addUrl,
  allowAdd,
  columns,
  data,
  deleteEnabled,
  editable,
  emptyText,
  enableFilter,
  onDeleteClick,
  onDone,
  onEditClick,
  onRowAddClick,
  onSave,
  selectable,
  tableHeading,
}: TableProps) => {
  const [addMode, setAddMode] = useState<boolean>(false);
  const [rows, setRows] = useState<any[]>(data);

  const onFilterChange = (column: string, filter: string) => {
    setRows(data.filter((row) => row[columns.indexOf(column)].includes(filter)));
  };

  useEffect(() => {
    setRows(data);
  }, [data]);

  return (
    <>
      {tableHeading && <div className={styles.tableHeading}>{tableHeading}</div>}
      <div className={styles.tableContainer}>
        {enableFilter && rows.length > 0 && <Filters columns={columns} onFilterChange={onFilterChange} />}
        <table className={styles.table}>
          <TableHeader columns={columns} editable={editable} deleteEnabled={deleteEnabled} />
          {rows.length === 0 && !addMode ? (
            <EmptyTable emptyText={emptyText} columns={columns} />
          ) : (
            <TableRows
              addMode={addMode}
              columns={columns}
              deleteEnabled={deleteEnabled}
              editable={editable}
              onDeleteClick={onDeleteClick}
              onEditClick={onEditClick}
              onRowAddClick={onRowAddClick}
              onSave={onSave}
              rows={rows}
              selectable={selectable}
              setAddMode={setAddMode}
            />
          )}
        </table>
        {!addMode && editable && allowAdd && (
          <div className={styles.inputRow}>
            <button
              className={styles.button}
              onClick={() => {
                if (addUrl) {
                  window.location.replace(addUrl);
                } else {
                  setAddMode(true);
                }
              }}
            >
              Add
            </button>
            {onDone && <button className={styles.button} onClick={onDone}>Done</button>}
          </div>
        )}
      </div>
    </>
  );
};

export default Table;