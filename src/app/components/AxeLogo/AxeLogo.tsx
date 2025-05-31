import styles from './AxeLogo.module.css';

const AxeLogo = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
      <svg
        width="220"
        height="220"
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Concentric rings */}
        <circle cx="110" cy="110" r="100" stroke="#111" strokeWidth="6" fill="white" />
        <circle cx="110" cy="110" r="80" stroke="#111" strokeWidth="6" fill="none" />
        <circle cx="110" cy="110" r="60" stroke="#111" strokeWidth="6" fill="none" />
        <circle cx="110" cy="110" r="40" stroke="#111" strokeWidth="6" fill="none" />
        <circle cx="110" cy="110" r="20" stroke="#111" strokeWidth="6" fill="none" />
        {/* Bullseye */}
        <circle cx="110" cy="110" r="10" fill="red" stroke="#111" strokeWidth="3" />
        {/* Killshots */}
        <circle cx="50" cy="50" r="8" fill="#2196f3" stroke="#111" strokeWidth="3" />
        <circle cx="170" cy="50" r="8" fill="#2196f3" stroke="#111" strokeWidth="3" />
      </svg>
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-color)', marginTop: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
        Axe Score
      </div>
    </div>
  );
};

export default AxeLogo; 