import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAd } from '../../entities/ad/api'
import { getMissingFields, getAdParams, formatDate } from '../../entities/ad/lib'
import styles from './AdViewPage.module.css'

export const AdViewPage = () => {
    const { id } = useParams()
    const [activePhoto, setActivePhoto] = useState(0)

    const { data, isLoading, error } = useQuery({
        queryKey: ['ad', id],
        queryFn: () => getAd(Number(id))
    })

    if (isLoading) return <div>Загрузка...</div>
    if (error || !data) return <div>Ошибка</div>

    const mockPhotos = [
        'https://placehold.co/480x360/e8e8e8/999?text=Фото+1',
        'https://placehold.co/480x360/d0d0d0/999?text=Фото+2',
        'https://placehold.co/480x360/c0c0c0/999?text=Фото+3',
        'https://placehold.co/480x360/b0b0b0/999?text=Фото+4',
        'https://placehold.co/480x360/a0a0a0/999?text=Фото+5',
        'https://placehold.co/480x360/909090/999?text=Фото+6',
    ]

    const missingFields = getMissingFields(data)
    const needsRevision = missingFields.length > 0
    const params = getAdParams(data)

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>{data.title}</h1>
                    <Link to="edit" className={styles.editBtn}>
                        Редактировать
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.92701 12.8571C2.96719 12.8571 3.00737 12.8531 3.04755 12.8471L6.42656 12.2545C6.46674 12.2464 6.50491 12.2283 6.53304 12.1982L15.0489 3.68237C15.0675 3.66378 15.0823 3.64171 15.0924 3.6174C15.1024 3.5931 15.1076 3.56705 15.1076 3.54074C15.1076 3.51443 15.1024 3.48837 15.0924 3.46407C15.0823 3.43977 15.0675 3.41769 15.0489 3.39911L11.71 0.058259C11.6719 0.0200893 11.6217 0 11.5674 0C11.5132 0 11.4629 0.0200893 11.4248 0.058259L2.90893 8.57411C2.87879 8.60424 2.86071 8.6404 2.85268 8.68058L2.26004 12.0596C2.2405 12.1672 2.24748 12.278 2.28039 12.3823C2.31329 12.4866 2.37113 12.5813 2.44888 12.6583C2.58147 12.7868 2.74821 12.8571 2.92701 12.8571V12.8571ZM4.28103 9.35357L11.5674 2.0692L13.04 3.54174L5.75357 10.8261L3.96763 11.1415L4.28103 9.35357V9.35357ZM15.4286 14.5446H0.642857C0.287277 14.5446 0 14.8319 0 15.1875V15.9107C0 15.9991 0.0723214 16.0714 0.160714 16.0714H15.9107C15.9991 16.0714 16.0714 15.9991 16.0714 15.9107V15.1875C16.0714 14.8319 15.7842 14.5446 15.4286 14.5446Z" fill="white"/>
                        </svg>
                    </Link>
                </div>
                <div className={styles.meta}>
                    <p className={styles.price}>{data.price.toLocaleString('ru-RU')} ₽</p>
                    <p className={styles.date}>Опубликовано: {formatDate(data.createdAt)}</p>
                    <p className={styles.date}>Отредактировано: {formatDate(data.updatedAt)}</p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.gallery}>
                    <img className={styles.mainImage} src={mockPhotos[activePhoto]} alt="Фото объявления" />
                    <div className={styles.thumbsRow}>
                        {mockPhotos.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`Фото ${i + 1}`}
                                className={`${styles.thumb} ${i === activePhoto ? styles.thumbActive : ''}`}
                                onClick={() => setActivePhoto(i)}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.info}>
                    {needsRevision && (
                        <div className={styles.revision}>
                            <div className={styles.revisionTitle}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.875 0C3.52617 0 0 3.52617 0 7.875C0 12.2238 3.52617 15.75 7.875 15.75C12.2238 15.75 15.75 12.2238 15.75 7.875C15.75 3.52617 12.2238 0 7.875 0ZM7.3125 4.07812C7.3125 4.00078 7.37578 3.9375 7.45312 3.9375H8.29688C8.37422 3.9375 8.4375 4.00078 8.4375 4.07812V8.85938C8.4375 8.93672 8.37422 9 8.29688 9H7.45312C7.37578 9 7.3125 8.93672 7.3125 8.85938V4.07812ZM7.875 11.8125C7.65421 11.808 7.44398 11.7171 7.28942 11.5594C7.13486 11.4016 7.0483 11.1896 7.0483 10.9688C7.0483 10.7479 7.13486 10.5359 7.28942 10.3781C7.44398 10.2204 7.65421 10.1295 7.875 10.125C8.09579 10.1295 8.30603 10.2204 8.46058 10.3781C8.61514 10.5359 8.7017 10.7479 8.7017 10.9688C8.7017 11.1896 8.61514 11.4016 8.46058 11.5594C8.30603 11.7171 8.09579 11.808 7.875 11.8125Z" fill="#FFA940"/>
                                </svg>
                                Требуются доработки
                            </div>
                            <p className={styles.revisionText}>У объявления не заполнены поля:</p>
                            <ul className={styles.revisionList}>
                                {missingFields.map(field => (
                                    <li key={field}>{field}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className={styles.params}>
                        <h3 className={styles.paramsTitle}>Характеристики</h3>
                        {params.map(({ label, value }) => (
                            <div key={label} className={styles.paramRow}>
                                <span className={styles.paramKey}>{label}</span>
                                <span className={styles.paramValue}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.description}>
                <h3 className={styles.descriptionTitle}>Описание</h3>
                <p className={styles.descriptionText}>{data.description?.trim() || 'Отсутствует'}</p>
            </div>
        </div>
    )
}
