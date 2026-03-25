import { TextInput } from '@mantine/core'
import type { Ad } from '../../../entities/ad/types'
import { SelectField } from './SelectField'
import { IconClear } from './icons'
import { PARAMS_FIELDS, PARAM_LABEL_MAP, smallLabelStyle, warningInputStyle } from '../model/constants'
import styles from '../AdEditPage.module.css'

type ParamsFieldsProps = {
    category: Ad['category']
    params: Record<string, string>
    setParam: (key: string, value: string) => void
}

export const ParamsFields = ({ category, params, setParam }: ParamsFieldsProps) => {
    const currentParams = PARAMS_FIELDS[category] as string[]

    return (
        <>
            {currentParams.map(key => {
                const val = params[key] ?? ''
                const isEmpty = val.trim() === ''

                if (key === 'transmission') return (
                    <div key={key} className={styles.field}>
                        <SelectField
                            label="Коробка передач"
                            data={[{ value: 'automatic', label: 'Автомат' }, { value: 'manual', label: 'Механика' }]}
                            value={val || null}
                            onChange={v => setParam(key, v ?? '')}
                            smallLabel
                            warning={isEmpty}
                        />
                    </div>
                )
                if (key === 'type' && category === 'real_estate') return (
                    <div key={key} className={styles.field}>
                        <SelectField
                            label="Тип"
                            data={[{ value: 'flat', label: 'Квартира' }, { value: 'house', label: 'Дом' }, { value: 'room', label: 'Комната' }]}
                            value={val || null}
                            onChange={v => setParam(key, v ?? '')}
                            smallLabel
                            warning={isEmpty}
                        />
                    </div>
                )
                if (key === 'type' && category === 'electronics') return (
                    <div key={key} className={styles.field}>
                        <SelectField
                            label="Тип устройства"
                            data={[{ value: 'phone', label: 'Телефон' }, { value: 'laptop', label: 'Ноутбук' }, { value: 'misc', label: 'Другое' }]}
                            value={val || null}
                            onChange={v => setParam(key, v ?? '')}
                            smallLabel
                            warning={isEmpty}
                        />
                    </div>
                )
                if (key === 'condition') return (
                    <div key={key} className={styles.field}>
                        <SelectField
                            label="Состояние"
                            data={[{ value: 'new', label: 'Новое' }, { value: 'used', label: 'Б/У' }]}
                            value={val || null}
                            onChange={v => setParam(key, v ?? '')}
                            smallLabel
                            warning={isEmpty}
                        />
                    </div>
                )

                return (
                    <div key={key} className={styles.field}>
                        <TextInput
                            label={PARAM_LABEL_MAP[key] ?? key}
                            value={val}
                            onChange={e => setParam(key, e.currentTarget.value)}
                            rightSection={<IconClear onClick={() => setParam(key, '')} />}
                            classNames={{ input: styles.input, wrapper: styles.inputWrapper }}
                            styles={{
                                label: smallLabelStyle,
                                input: isEmpty ? warningInputStyle : undefined,
                            }}
                        />
                    </div>
                )
            })}
        </>
    )
}
