import styles from './Filters.module.css';

type FilterProps = {
  columns: string[];
  emptyRightColumn?: boolean;
  onFilterChange: (column: string, filter: string) => void;
};

const Filters = ({ columns, onFilterChange, emptyRightColumn }: FilterProps) => {
  return (
    <tbody>
      <tr className={styles.filterRow}>
        {columns.map((column, index) => (
          <td key={index}>
            <input
              onChange={(event) => onFilterChange(column, event.target.value)}
              placeholder={`Filter by ${column}`}
              className={styles.input}
            />
          </td>
        ))}
        {emptyRightColumn && <td></td>}
      </tr>
    </tbody>
  );
};

export default Filters;