import { IconSuccess, IconError } from './icons'
import styles from '../AdEditPage.module.css'

export const ToastSuccess = ({ message }: { message: string }) => (
    <div className={styles.toastSuccess}>
        <div className={styles.toastIcon} style={{ background: 'transparent' }}>
            <IconSuccess />
        </div>
        <span className={styles.toastText}>{message}</span>
    </div>
)

export const ToastError = ({ title, message }: { title: string; message: string }) => (
    <div className={styles.toastError}>
        <div className={styles.toastErrorHeader}>
            <div className={styles.toastIcon} style={{ background: 'transparent' }}>
                <IconError />
            </div>
            <span className={styles.toastErrorTitle}>{title}</span>
        </div>
        <p className={styles.toastErrorText}>{message}</p>
    </div>
)

export const AiErrorTooltip = ({ onClose }: { onClose: () => void }) => (
    <div className={styles.aiErrorTooltip}>
        <p className={styles.aiErrorTitle}>Произошла ошибка при запросе к AI</p>
        <p className={styles.aiErrorText}>Попробуйте повторить запрос или закройте уведомление</p>
        <button className={styles.aiErrorClose} onClick={onClose}>Закрыть</button>
    </div>
)
