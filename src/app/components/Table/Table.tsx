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
  selectable,
  tableHeading,
}: TableProps) => {
  const [rows, setRows] = useState<any[]>(data);
  const [filter, setFilter] = useState("");

  const onFilterChange = (column: string, filter: string) => {
    setRows(data.filter((row) => row[columns.indexOf(column)].toLowerCase().includes(filter.toLowerCase())));
  };

  useEffect(() => {
    setRows(data);
  }, [data]);

  return (
    <div className={styles.innerContainer}>
      {tableHeading && <div className={styles.tableHeading}>{tableHeading}</div>}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <TableHeader columns={columns} editable={editable} deleteEnabled={deleteEnabled} />
          {enableFilter && rows.length > 0 && (
            <Filters columns={columns} emptyRightColumn={true} onFilterChange={onFilterChange} />
          )}
          {rows.length === 0 ? (
            <EmptyTable emptyText={emptyText} columns={columns} />
          ) : (
            <TableRows
              columns={columns}
              deleteEnabled={deleteEnabled}
              editable={editable}
              onDeleteClick={onDeleteClick}
              onEditClick={onEditClick}
              onRowAddClick={onRowAddClick}
              rows={rows}
              selectable={selectable}
            />
          )}
        </table>
        {editable && allowAdd && (
          <div className={styles.inputRow}>
            <button
              className={styles.button}
              onClick={() => {
                if (addUrl) {
                  window.location.replace(addUrl);
                } else {
                  setRows(data);
                }
              }}
            >
              Add
            </button>
            {onDone && <button className={styles.button} onClick={onDone}>Done</button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;