import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { TextInput, Textarea, Button } from '@mantine/core'
import { getAd, updateAd } from '../../entities/ad/api'
import type { Ad } from '../../entities/ad/types'
import { askOllama } from '../../shared/api/ollama'
import { SelectField } from './ui/SelectField'
import { ParamsFields } from './ui/ParamsFields'
import { ToastSuccess, ToastError, AiErrorTooltip } from './ui/AiTooltip'
import { IconClear, IconSpinner, IconAi } from './ui/icons'
import { CATEGORY_OPTIONS, NUMERIC_FIELDS, type AiState } from './model/constants'
import styles from './AdEditPage.module.css'

type AdEditDraft = {
    title: string
    price: string
    category: Ad['category']
    description: string
    params: Record<string, string>
    updatedAt: number
}

export const AdEditPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useQuery({
        queryKey: ['ad', id],
        queryFn: () => getAd(Number(id)),
    })

    const draftKey = `ad-edit-draft:${id ?? ''}`

    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [titleTouched, setTitleTouched] = useState(false)
    const [priceTouched, setPriceTouched] = useState(false)
    const [category, setCategory] = useState<Ad['category']>('electronics')
    const [description, setDescription] = useState('')
    const [params, setParams] = useState<Record<string, string>>({})

    const [priceAiState, setPriceAiState] = useState<AiState>('idle')
    const [priceAiResult, setPriceAiResult] = useState<string | null>(null)
    const [descAiState, setDescAiState] = useState<AiState>('idle')
    const [descAiResult, setDescAiResult] = useState<string | null>(null)

    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [notificationExiting, setNotificationExiting] = useState(false)

    useEffect(() => {
        if (!notification) return
        const showId = setTimeout(() => setNotificationExiting(false), 0)
        const hideTimer = setTimeout(() => setNotificationExiting(true), 4700)
        const removeTimer = setTimeout(() => setNotification(null), 5000)
        return () => { clearTimeout(showId); clearTimeout(hideTimer); clearTimeout(removeTimer) }
    }, [notification])

    useEffect(() => {
        if (!data) return
        const timeoutId = setTimeout(() => {
            let draft: AdEditDraft | null = null
            try {
                const raw = localStorage.getItem(draftKey)
                if (raw) draft = JSON.parse(raw) as AdEditDraft
            } catch {
                draft = null
            }

            if (draft) {
                setTitle(draft.title ?? '')
                setPrice(draft.price ?? '')
                setCategory(draft.category ?? data.category)
                setDescription(draft.description ?? '')
                setParams(draft.params ?? {})
                return
            }

            setTitle(data.title ?? '')
            setPrice(data.price != null ? String(data.price) : '')
            setCategory(data.category)
            setDescription(data.description ?? '')
            const p = data.params as Record<string, unknown>
            const filled: Record<string, string> = {}
            Object.entries(p).forEach(([k, v]) => { filled[k] = v != null ? String(v) : '' })
            setParams(filled)
        }, 0)
        return () => clearTimeout(timeoutId)
    }, [data, draftKey])

    useEffect(() => {
        if (!id) return
        const timeoutId = setTimeout(() => {
            const draft: AdEditDraft = {
                title,
                price,
                category,
                description,
                params,
                updatedAt: Date.now(),
            }
            try {
                localStorage.setItem(draftKey, JSON.stringify(draft))
            } catch {
                // -
            }
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [id, title, price, category, description, params, draftKey])

    const mutation = useMutation({
        mutationFn: (body: Omit<Ad, 'id' | 'needsRevision'>) => updateAd(Number(id), body),
        onSuccess: () => {
            setNotificationExiting(false)
            try { localStorage.removeItem(draftKey) } catch { /* ignore */ }
            setNotification({ type: 'success', message: 'Изменения сохранены' })
            setTimeout(() => navigate(`/ads/${id}`), 1500)
        },
        onError: () => {
            setNotificationExiting(false)
            setNotification({ type: 'error', message: 'Ошибка сохранения' })
        },
    })

    const titleError = titleTouched && !title.trim() ? 'Название должно быть заполнено' : undefined
    const priceError = priceTouched && !price.trim() ? 'Цена должна быть указана' : undefined
    const isValid = title.trim() !== '' && price.trim() !== ''

    const handleSave = () => {
        setTitleTouched(true)
        setPriceTouched(true)
        if (!isValid) return
        const cleanParams: Record<string, unknown> = {}
        Object.entries(params).forEach(([k, v]) => {
            if (v === '') return
            cleanParams[k] = NUMERIC_FIELDS.has(k) ? Number(v) : v
        })
        mutation.mutate({ category, title, description, price: Number(price), params: cleanParams } as Omit<Ad, 'id' | 'needsRevision'>)
    }

    const handlePriceAiRequest = async () => {
        setPriceAiState('loading')
        setPriceAiResult(null)
        try {
            const prompt = `Ты эксперт по оценке товаров на российском рынке.
Объявление: "${title}", категория: "${category}".
Верни JSON объект с двумя полями:
- "text": короткое описание цены на русском (1 предложение)
- "value": среднее числовое значение цены в рублях (только целое число без пробелов)
Пример: {"text":"Средняя цена на рынке — около 15 000 ₽","value":15000}
Верни только JSON, без пояснений.`
            const result = await askOllama(prompt)
            const json = JSON.parse(result.trim().replace(/```json|```/g, '').trim())
            setPriceAiResult(JSON.stringify(json))
            setPriceAiState('done')
        } catch {
            setPriceAiState('error')
        }
    }

    const applyPriceFromAi = () => {
        if (!priceAiResult) return
        try {
            const json = JSON.parse(priceAiResult)
            setPrice(String(json.value))
        } catch {
            setPrice(priceAiResult.replace(/\D/g, ''))
        }
        setPriceAiState('idle')
    }

    const handleDescAiRequest = async () => {
        setDescAiState('loading')
        setDescAiResult(null)
        try {
            const isEmpty = !description.trim()
            const prompt = isEmpty
                ? `Напиши продающее описание на русском языке для объявления о продаже: "${title}". Только текст описания, 2-3 предложения. Без заголовков, без вводных слов типа "Конечно" или "Вот описание".`
                : `Перепиши это описание объявления, сделай его более продающим и привлекательным на русском языке. Исправь ошибки, улучши стиль, добавь убедительности. Верни только готовый текст без пояснений:\n\n${description}`
            const result = await askOllama(prompt)
            setDescAiResult(result.trim())
            setDescAiState('done')
        } catch {
            setDescAiState('error')
        }
    }

    const setParam = (key: string, value: string) => setParams(p => ({ ...p, [key]: value }))

    if (isLoading) return <div>Загрузка...</div>
    if (!data) return <div>Ошибка</div>

    return (
        <div className={styles.page}>
            <div className={styles.inner}>
            {notification && notification.type === 'success' && (
                <div className={`${styles.notification} ${notificationExiting ? styles.notificationOut : styles.notificationIn}`}>
                    <ToastSuccess message={notification.message} />
                </div>
            )}
            {notification && notification.type === 'error' && (
                <div className={`${styles.notification} ${notificationExiting ? styles.notificationOut : styles.notificationIn}`}>
                    <ToastError title="Ошибка сохранения" message="При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже." />
                </div>
            )}

            <h1 className={styles.title}>Редактирование объявления</h1>

            <div className={styles.form}>
                <div className={styles.field}>
                    <SelectField label="Категория" data={CATEGORY_OPTIONS} value={category} onChange={v => setCategory(v as Ad['category'])} />
                </div>

                <hr className={styles.divider} />

                <div className={styles.fieldRow}>
                    <div className={styles.fieldWithAi}>
                        <TextInput
                            label={<span><span className={styles.required}>*</span> Название</span>}
                            value={title}
                            onChange={e => setTitle(e.currentTarget.value)}
                            onBlur={() => setTitleTouched(true)}
                            error={titleError}
                            rightSection={title ? <IconClear onClick={() => setTitle('')} /> : null}
                            classNames={{ label: styles.label, input: styles.input, wrapper: styles.inputWrapper }}
                        />
                    </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.fieldRow}>
                    <div className={styles.fieldWithAi}>
                        <TextInput
                            label={<span><span className={styles.required}>*</span> Цена</span>}
                            value={price}
                            onChange={e => setPrice(e.currentTarget.value)}
                            onBlur={() => setPriceTouched(true)}
                            error={priceError}
                            rightSection={price ? <IconClear onClick={() => setPrice('')} /> : null}
                            classNames={{ label: styles.label, input: styles.input, wrapper: styles.inputWrapper }}
                        />
                    </div>
                    <div className={styles.priceAiSide}>
                        {priceAiState === 'idle' && (
                            <button className={styles.aiDescBtn} onClick={handlePriceAiRequest}>
                                <IconAi /> Узнать рыночную цену
                            </button>
                        )}
                        {priceAiState === 'loading' && (
                            <button className={styles.aiDescBtn} disabled>
                                <IconSpinner className={styles.spinIcon} /> Выполняется запрос...
                            </button>
                        )}
                        {(priceAiState === 'done' || priceAiState === 'error') && (
                            <div className={styles.retryWrapper}>
                                <div className={priceAiState === 'error' ? styles.aiResultError : styles.aiResult}>
                                    {priceAiState === 'done' && priceAiResult ? (
                                        <>
                                            <p className={styles.aiPopupTitle}>Ответ AI:</p>
                                            <p className={styles.aiPopupText}>{(() => { try { return JSON.parse(priceAiResult).text } catch { return priceAiResult } })()}</p>
                                            <div className={styles.aiResultActions}>
                                                <Button color="#1890FF" size="xs" style={{'--button-color': '#fff', '--button-radius': '4px', '--button-fz': '14px', fontWeight: '400', '--button-padding-x': '7px', height: '22px'}} onClick={applyPriceFromAi}>Применить</Button>
                                                <Button color="#fff" size="xs" style={{'--button-color': '#000000D9', '--button-radius': '4px', '--button-fz': '14px', fontWeight: '400', '--button-padding-x': '7px', height: '22px', border: '1px solid #D9D9D9'}} onClick={() => setPriceAiState('idle')}>Закрыть</Button>
                                            </div>
                                        </>
                                    ) : (
                                        <AiErrorTooltip onClose={() => setPriceAiState('idle')} />
                                    )}
                                </div>
                                <button className={styles.aiRetry} onClick={handlePriceAiRequest}>
                                    <IconSpinner /> Повторить запрос
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Характеристики</h2>
                    <ParamsFields category={category} params={params} setParam={setParam} />
                </div>

                <hr className={styles.divider} />

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Описание</h2>
                    <div className={styles.textareaWrapper}>
                        <Textarea
                            resize="vertical"
                            value={description}
                            onChange={e => setDescription(e.currentTarget.value)}
                            maxLength={1000}
                            styles={{ input: { minHeight: '60px' } }}
                            classNames={{ input: styles.textarea, wrapper: styles.inputWrapper }}
                        />
                        <span className={styles.charCount}>{description.length} / 1000</span>
                    </div>
                    <div className={styles.retryWrapper}>
                        {(descAiState === 'done' || descAiState === 'error') && (
                            <div className={descAiState === 'error' ? styles.aiResultError : styles.aiResult}>
                                {descAiState === 'done' && descAiResult ? (
                                    <>
                                        <p className={styles.aiPopupTitle}>Ответ AI:</p>
                                        <p className={styles.aiPopupText}>{descAiResult}</p>
                                        <div className={styles.aiResultActions}>
                                            <Button color="#1890FF" size="xs" style={{'--button-color': '#fff', '--button-radius': '4px', '--button-fz': '14px', fontWeight: '400', '--button-padding-x': '7px', height: '22px'}} onClick={() => { setDescription(descAiResult); setDescAiState('idle') }}>Применить</Button>
                                            <Button color="#fff" size="xs" style={{'--button-color': '#000000D9', '--button-radius': '4px', '--button-fz': '14px', fontWeight: '400', '--button-padding-x': '7px', height: '22px', border: '1px solid #D9D9D9'}} onClick={() => setDescAiState('idle')}>Закрыть</Button>
                                        </div>
                                    </>
                                ) : (
                                    <AiErrorTooltip onClose={() => setDescAiState('idle')} />
                                )}
                            </div>
                        )}
                        <button className={styles.aiDescBtn} onClick={handleDescAiRequest} disabled={descAiState === 'loading'}>
                            {descAiState === 'loading' ? <><IconSpinner className={styles.spinIcon} /> Выполняется запрос...</>
                            : (descAiState === 'done' || descAiState === 'error') ? <><IconSpinner /> Повторить запрос</>
                            : description.trim() ? <><IconAi /> Улучшить описание</>
                            : <><IconAi /> Придумать описание</>}
                        </button>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button color="#1890FF" size="md" disabled={!isValid || mutation.isPending}
                        style={{'--button-color': '#F3F3F3', '--button-radius': '8px', '--button-fz': '16px', fontWeight: '400', '--button-padding-x': '12px', '--mantine-color-disabled-color': '#F3F3F3', '--mantine-color-disabled': '#D9D9D9'}}
                        onClick={handleSave}>
                        {mutation.isPending ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                    <Button color="#D9D9D9" size="md"
                        style={{'--button-color': '#5A5A5A', '--button-radius': '8px', '--button-fz': '16px', fontWeight: '400', '--button-padding-x': '12px'}}
                        onClick={() => navigate(`/ads/${id}`)}>
                        Отменить
                    </Button>
                </div>
            </div>
            </div>
        </div>
    )
}
