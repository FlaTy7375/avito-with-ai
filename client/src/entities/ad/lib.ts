import type { Ad, AutoItemParams, RealEstateItemParams, ElectronicsItemParams } from './types';

// Обязательные поля по категориям
const REQUIRED_AUTO_FIELDS: { key: keyof AutoItemParams; label: string }[] = [
    { key: 'brand', label: 'Марка' },
    { key: 'model', label: 'Модель' },
    { key: 'yearOfManufacture', label: 'Год выпуска' },
    { key: 'transmission', label: 'Коробка передач' },
    { key: 'mileage', label: 'Пробег' },
    { key: 'enginePower', label: 'Мощность двигателя' },
];

const REQUIRED_REAL_ESTATE_FIELDS: { key: keyof RealEstateItemParams; label: string }[] = [
    { key: 'type', label: 'Тип недвижимости' },
    { key: 'address', label: 'Адрес' },
    { key: 'area', label: 'Площадь' },
    { key: 'floor', label: 'Этаж' },
];

const REQUIRED_ELECTRONICS_FIELDS: { key: keyof ElectronicsItemParams; label: string }[] = [
    { key: 'type', label: 'Тип устройства' },
    { key: 'brand', label: 'Бренд' },
    { key: 'model', label: 'Модель' },
    { key: 'condition', label: 'Состояние' },
    { key: 'color', label: 'Цвет' },
];

// Возвращает список незаполненных полей
export const getMissingFields = (ad: Ad): string[] => {
    const missing: string[] = [];

    if (!ad.title?.trim()) missing.push('Название');
    if (!ad.description?.trim()) missing.push('Описание');
    if (ad.price == null) missing.push('Цена');

    const params = ad.params as Record<string, unknown>;

    if (ad.category === 'auto') {
        for (const { key, label } of REQUIRED_AUTO_FIELDS) {
            if (params[key] == null || params[key] === '') missing.push(label);
        }
    } else if (ad.category === 'real_estate') {
        for (const { key, label } of REQUIRED_REAL_ESTATE_FIELDS) {
            if (params[key] == null || params[key] === '') missing.push(label);
        }
    } else if (ad.category === 'electronics') {
        for (const { key, label } of REQUIRED_ELECTRONICS_FIELDS) {
            if (params[key] == null || params[key] === '') missing.push(label);
        }
    }

    return missing;
};

export const doesAdNeedRevision = (ad: Ad): boolean => getMissingFields(ad).length > 0;

// Форматирование даты
export const formatDate = (iso: string): string => {
    const date = new Date(iso);
    return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Человекочитаемые лейблы для параметров
const AUTO_LABELS: Record<keyof AutoItemParams, string> = {
    brand: 'Марка',
    model: 'Модель',
    yearOfManufacture: 'Год выпуска',
    transmission: 'Коробка передач',
    mileage: 'Пробег, км',
    enginePower: 'Мощность, л.с.',
};

const REAL_ESTATE_LABELS: Record<keyof RealEstateItemParams, string> = {
    type: 'Тип',
    address: 'Адрес',
    area: 'Площадь, м²',
    floor: 'Этаж',
};

const ELECTRONICS_LABELS: Record<keyof ElectronicsItemParams, string> = {
    type: 'Тип устройства',
    brand: 'Бренд',
    model: 'Модель',
    condition: 'Состояние',
    color: 'Цвет',
};

const TRANSMISSION_LABELS: Record<string, string> = {
    automatic: 'Автомат',
    manual: 'Механика',
};

const REAL_ESTATE_TYPE_LABELS: Record<string, string> = {
    flat: 'Квартира',
    house: 'Дом',
    room: 'Комната',
};

const ELECTRONICS_TYPE_LABELS: Record<string, string> = {
    phone: 'Телефон',
    laptop: 'Ноутбук',
    misc: 'Другое',
};

const CONDITION_LABELS: Record<string, string> = {
    new: 'Новое',
    used: 'Б/у',
};

// Форматирует значение параметра в читаемый вид
const formatParamValue = (category: Ad['category'], key: string, value: unknown): string => {
    if (value == null) return '—';
    if (category === 'auto' && key === 'transmission') return TRANSMISSION_LABELS[value as string] ?? String(value);
    if (category === 'real_estate' && key === 'type') return REAL_ESTATE_TYPE_LABELS[value as string] ?? String(value);
    if (category === 'electronics' && key === 'type') return ELECTRONICS_TYPE_LABELS[value as string] ?? String(value);
    if (category === 'electronics' && key === 'condition') return CONDITION_LABELS[value as string] ?? String(value);
    return String(value);
};

// Возвращает массив { label, value } для рендера характеристик
export const getAdParams = (ad: Ad): { label: string; value: string }[] => {
    const params = ad.params as Record<string, unknown>;
    let labels: Record<string, string>;

    if (ad.category === 'auto') labels = AUTO_LABELS;
    else if (ad.category === 'real_estate') labels = REAL_ESTATE_LABELS;
    else labels = ELECTRONICS_LABELS;

    return Object.entries(labels).map(([key, label]) => ({
        label,
        value: formatParamValue(ad.category, key, params[key]),
    }));
};
