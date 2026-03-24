import styles from './Switch.module.css'

type SwitchProps = {
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const Switch = ({ label, checked, onChange }: SwitchProps) => {
  return (
    <label className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div
        className={`${styles.track} ${checked ? styles.checked : ''}`}
        onClick={() => onChange(!checked)}
      >
        <div className={styles.thumb} />
      </div>
    </label>
  )
}
