import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type FilterState = {
    searchStr: string;
    categories: ('auto' | 'real_estate' | 'electronics')[];
    needsRevision: boolean;
    currentPage: number;
    sortColumn: 'title' | 'createdAt' | 'price' | null;
    sortDirection: 'asc' | 'desc' | null;
    layout: 'grid' | 'list';
}

const initialState: FilterState = {
    searchStr: '',
    categories: [],
    needsRevision: false,
    currentPage: 1,
    sortColumn: 'createdAt' as const,
    sortDirection: 'desc' as const,
    layout: 'grid'
}

export const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.searchStr = action.payload
        },
        setCategories: (state, action: PayloadAction<('auto' | 'real_estate' | 'electronics')[]>) => {
            state.categories = action.payload
        },
        setNeedsRevision: (state, action: PayloadAction<boolean>) => {
            state.needsRevision = action.payload
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload
        },
        setSort: (state, action: PayloadAction<{ sortColumn: FilterState['sortColumn'], sortDirection: FilterState['sortDirection'] }>) => {
            state.sortColumn = action.payload.sortColumn
            state.sortDirection = action.payload.sortDirection
        },
        setLayout: (state, action: PayloadAction<'grid' | 'list'>) => {
            state.layout = action.payload
        },
        resetFilters: () => initialState
    }
})

export const { setSearch, setCategories, setNeedsRevision, setCurrentPage, setSort, setLayout, resetFilters } = filterSlice.actions