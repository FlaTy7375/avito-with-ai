import { Link } from 'react-router-dom'
import type { AdListItem } from '../../entities/ad/types'
import styles from './AdCard.module.css'
import { useAppSelector } from '../../shared/lib/hooks'

const CATEGORY_LABELS: Record<AdListItem['category'], string> = {
  auto: 'Авто',
  real_estate: 'Недвижимость',
  electronics: 'Электроника',
}

export const AdCard = ({ id, category, title, price, needsRevision }: AdListItem) => {
    const filters = useAppSelector(state => state.filter);
    const cols = filters.layout === 'grid' ? 5 : 1;
    
    return (
        <Link to={`/ads/${id}`} className={cols === 5 ? `${styles.card} ${styles.grid}` : `${styles.card} ${styles.list}`}>
        <div className={styles.image}></div>
        <div className={styles.body}>
            <span className={styles.category}>{CATEGORY_LABELS[category]}</span>
            <p className={styles.title}>{title}</p>
            <p className={styles.price}>{price} ₽</p>
            {needsRevision && <span className={styles.revision}>Требует доработок</span>}
        </div>
        </Link>
  )
}
