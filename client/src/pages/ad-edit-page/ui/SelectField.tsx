import { useState } from 'react'
import { Select } from '@mantine/core'
import type { SelectProps } from '@mantine/core'
import { ChevronIcon } from './icons'
import styles from '../AdEditPage.module.css'

type SelectFieldProps = Omit<SelectProps, 'rightSection'> & {
    smallLabel?: boolean
    warning?: boolean
}

export const SelectField = (props: SelectFieldProps) => {
    const [open, setOpen] = useState(false)
    const { smallLabel, warning, ...rest } = props
    return (
        <Select
            {...rest}
            rightSection={<ChevronIcon open={open} />}
            onDropdownOpen={() => setOpen(true)}
            onDropdownClose={() => setOpen(false)}
            classNames={{ input: styles.input, wrapper: styles.inputWrapper, ...props.classNames }}
            styles={{
                label: smallLabel
                    ? { fontSize: '14px', fontWeight: 400, color: 'rgba(0,0,0,0.85)', marginBottom: '8px' }
                    : { fontSize: '16px', fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: '8px' },
                input: warning ? { borderColor: '#faad14' } : undefined,
            }}
        />
    )
}
