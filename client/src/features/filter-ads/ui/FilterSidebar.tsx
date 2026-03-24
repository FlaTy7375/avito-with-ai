import { Checkbox } from '@mantine/core';
import { useState } from 'react';
import styles from './FilterSidebar.module.css'
import { useAppSelector, useAppDispatch } from '../../../shared/lib/hooks';
import { setCategories, setNeedsRevision, resetFilters } from '../model/slice';
import { Switch } from '../../../shared/ui/Switch';

export const FilterSidebar = () => {
    const dispatch = useAppDispatch();
    const { categories, needsRevision } = useAppSelector(state => state.filter);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

    const handleCategoryChange = (category: 'auto' | 'real_estate' | 'electronics', checked: boolean) => {
        if (checked) {
            dispatch(setCategories([...categories, category]))
        } else {
            dispatch(setCategories(categories.filter(c => c !== category)))
        }
    }

    return (
        <div className={styles.filter}>
            <div className={styles.filterContainer}>
                <h3 className={styles.filterTitle}>Фильтры</h3>
                <button className={styles.dropdownMenu} style={{ marginBottom: isCategoriesOpen ? undefined : '20px' }} onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
                    Категория
                    <svg
                        width="11" height="7" viewBox="0 0 11 7" fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${styles.arrow} ${!isCategoriesOpen ? styles.arrowClosed : ''}`}
                    >
                        <path d="M0.106807 6.85718H1.11127C1.17957 6.85718 1.24386 6.8237 1.28404 6.76878L5.08895 1.52414L8.89386 6.76878C8.93404 6.8237 8.99833 6.85718 9.06663 6.85718H10.0711C10.1581 6.85718 10.209 6.75807 10.1581 6.68709L5.43583 0.17682C5.2644 -0.0588941 4.9135 -0.0588941 4.74341 0.17682L0.0210925 6.68709C-0.0311397 6.75807 0.0197535 6.85718 0.106807 6.85718V6.85718Z" fill="black" />
                    </svg>
                </button>
                {isCategoriesOpen && (
                    <div className={styles.categoriesList}>
                        <Checkbox label="Авто"
                            checked={categories.includes('auto')}
                            onChange={e => handleCategoryChange('auto', e.currentTarget.checked)}
                            classNames={{ label: styles.checkboxLabel, body: styles.checkboxBody, input: styles.categoriesCheckbox, inner: styles.checkboxInner }}
                        />
                        <Checkbox label="Электроника"
                            checked={categories.includes('electronics')}
                            onChange={e => handleCategoryChange('electronics', e.currentTarget.checked)}
                            classNames={{ label: styles.checkboxLabel, body: styles.checkboxBody, input: styles.categoriesCheckbox, inner: styles.checkboxInner }}
                        />
                        <Checkbox label="Недвижимость"
                            checked={categories.includes('real_estate')}
                            onChange={e => handleCategoryChange('real_estate', e.currentTarget.checked)}
                            classNames={{ label: styles.checkboxLabel, body: styles.checkboxBody, input: styles.categoriesCheckbox, inner: styles.checkboxInner }}
                        />
                    </div>
                )}
                <Switch label="Только требующие доработок"
                    checked={needsRevision}
                    onChange={(checked) => dispatch(setNeedsRevision(checked))}
                />
            </div>
            <div>
                <button className={styles.filterReset} onClick={() => dispatch(resetFilters())}>
                    Сбросить фильтры
                </button>
            </div>
        </div>
    )
}
