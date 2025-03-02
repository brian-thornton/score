import styles from './TableHeader.module.css';

type TableHeaderProps = {
  columns: string[];
  editable: boolean | undefined;
  deleteEnabled: boolean;
};

const TableHeader = ({ columns, editable, deleteEnabled }: TableHeaderProps) => {
  return (
    <thead>
      <tr>
        {columns.map((column, index) => (
          <th key={index} className={styles.th}>{column}</th>
        ))}
        {(editable || deleteEnabled) && <th className={styles.th}>Actions</th>}
      </tr>
    </thead>
  )
};

export default TableHeader;