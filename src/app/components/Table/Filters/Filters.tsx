import styles from './Filters.module.css';

type FilterProps = {
  columns: string[];
  onFilterChange: (column: string, filter: string) => void;
};

const Filters = ({ columns, onFilterChange }: FilterProps) => {
  return (
    <div className={styles.filterRow}>
      {columns.map((column, index) => (
        <input
          key={index}
          onChange={(event) => onFilterChange(column, event.target.value)}
          placeholder={`Filter by ${column}`}
          className={styles.input}
        />
      ))}
    </div>
  );
};

export default Filters;