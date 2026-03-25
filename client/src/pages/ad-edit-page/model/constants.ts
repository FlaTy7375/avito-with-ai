import type { AutoItemParams, RealEstateItemParams, ElectronicsItemParams } from '../../../entities/ad/types'

export const CATEGORY_OPTIONS = [
    { value: 'electronics', label: 'Электроника' },
    { value: 'auto', label: 'Авто' },
    { value: 'real_estate', label: 'Недвижимость' },
]

export const PARAMS_FIELDS = {
    auto: ['brand', 'model', 'yearOfManufacture', 'transmission', 'mileage', 'enginePower'] as (keyof AutoItemParams)[],
    real_estate: ['type', 'address', 'area', 'floor'] as (keyof RealEstateItemParams)[],
    electronics: ['type', 'brand', 'model', 'color', 'condition'] as (keyof ElectronicsItemParams)[],
}

export const PARAM_LABEL_MAP: Record<string, string> = {
    brand: 'Бренд',
    model: 'Модель',
    yearOfManufacture: 'Год выпуска',
    mileage: 'Пробег, км',
    enginePower: 'Мощность, л.с.',
    address: 'Адрес',
    area: 'Площадь, м²',
    floor: 'Этаж',
    color: 'Цвет',
}

export const NUMERIC_FIELDS = new Set(['yearOfManufacture', 'mileage', 'enginePower', 'area', 'floor'])

export const smallLabelStyle = { fontSize: '14px', fontWeight: 400, color: 'rgba(0,0,0,0.85)', marginBottom: '8px' }
export const warningInputStyle = { borderColor: '#faad14' }

export type AiState = 'idle' | 'loading' | 'done' | 'error'
