import styles from '@/app/styles/FilterBar.module.css';

interface Filters {
  date: string;
  doctor_name: string;
  shift: 'morning' | 'evening' | '';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label>Date</label>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onFilterChange({ ...filters, date: e.target.value })}
          className={styles.input}
        />
      </div>

      <div className={styles.filterGroup}>
        <label>Doctor Name</label>
        <input
          type="text"
          value={filters.doctor_name}
          onChange={(e) => onFilterChange({ ...filters, doctor_name: e.target.value })}
          placeholder="Search doctor..."
          className={styles.input}
        />
      </div>

      <div className={styles.filterGroup}>
        <label>Shift</label>
        <select
          value={filters.shift}
          onChange={(e) => onFilterChange({ 
            ...filters, 
            shift: e.target.value as Filters['shift']
          })}
          className={styles.select}
        >
          <option value="">All Shifts</option>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label>Status</label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ 
            ...filters, 
            status: e.target.value as Filters['status']
          })}
          className={styles.select}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
} 