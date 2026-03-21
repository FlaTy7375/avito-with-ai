export type Ad = {
    id: number;
    category: 'auto' | 'real_estate' | 'electronics';
    title: string;
    price: number;
    description?: string;
    params: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
    needsRevision: boolean;
}

export type AdListItem = {
  id: number;
  category: 'auto' | 'real_estate' | 'electronics';
  title: string
  price: number
  needsRevision: boolean
}

export type AutoItemParams = {
    brand?: string;
    model?: string;
    yearOfManufacture?: number;
    transmission?: 'automatic' | 'manual';
    mileage?: number;
    enginePower?: number;
};
 
export type RealEstateItemParams = {
    type?: 'flat' | 'house' | 'room';
    address?: string;
    area?: number;
    floor?: number;
};
 
export type ElectronicsItemParams = {
    type?: 'phone' | 'laptop' | 'misc';
    brand?: string;
    model?: string;
    condition?: 'new' | 'used';
    color?: string;
};

export type AdResponse = {
    items: Ad[];
    total: number;
}

export type AdsResponse = {
    items: AdListItem[];
    total: number;
}

export type AdsParams = {
    q?: string;
    limit?: number;
    skip?: number;
    needsRevision?: boolean;
    categories?: 'auto' | 'real_estate' | 'electronics';
    sortColumn?: 'title' | 'createdAt';
    sortDirection?: 'asc' | 'desc';
}