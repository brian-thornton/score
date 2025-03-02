import styles from './EmptyTable.module.css';

type EmptyTableProps = {
  columns: string[];
  emptyText?: string;
};

const EmptyTable = ({ columns, emptyText }: EmptyTableProps) => {
  return (
    <tbody className={styles.tbody}>
      <tr className={styles.tr}>
        <td colSpan={columns.length} className={styles.td}>{emptyText ?? 'No Data'}</td>
      </tr>
    </tbody>
  )
};

export default EmptyTable;