import { useQuery } from '@tanstack/react-query'
import { getAds } from '../../entities/ad/api'
import { AdCard } from '../../widgets/ad-card'
import { FilterSidebar } from '../../features/filter-ads/ui/FilterSidebar'
import { SearchHeader } from '../../widgets/search-header'
import { SimpleGrid } from '@mantine/core'
import { useAppSelector, pluralize } from '../../shared/lib/hooks'
import styles from './AdsListPage.module.css'
import { PaginationAds } from '../../features/pagination-ads'

export const AdsListPage = () => {
  const filters = useAppSelector(state => state.filter)
  const cols = filters.layout === 'grid' ? 5 : 1
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['ads', filters.searchStr, filters.categories, filters.needsRevision, filters.currentPage, filters.sortColumn, filters.sortDirection],
    queryFn: () => getAds({
      q: filters.searchStr,
      categories: filters.categories.join(',') || undefined,
      needsRevision: filters.needsRevision || undefined,
      limit: 10,
      skip: (filters.currentPage - 1) * 10,
      sortColumn: filters.sortColumn ?? undefined,
      sortDirection: filters.sortDirection ?? undefined,
    }),
  })

  if (error) return <div>Ошибка</div>

  return (
    <div className={styles.adsListPage}>
      <div className={styles.inner}>
        <h1 className={styles.adsTitle}>Мои объявления</h1>
        <p className={styles.adsValue}>{isLoading ? '...' : `${data?.total} ${pluralize(data?.total ?? 0, 'объявление', 'объявления', 'объявлений')}`}</p>
        <SearchHeader />
        <div className={styles.adsListContainer}>
          <FilterSidebar />
          <div className={styles.adsWrapper}>
            {filters.layout === 'list' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: isFetching ? 0.5 : 1 }}>
                {isLoading
                  ? <div>Загрузка...</div>
                  : data?.items.map(ad => <AdCard key={ad.id} {...ad} />)}
              </div>
            ) : (
              <SimpleGrid cols={{ base: 1, xxs: 2, md: 3, lg: cols }} style={{ opacity: isFetching ? 0.5 : 1, flex: 1 }}>
                {isLoading
                  ? <div>Загрузка...</div>
                  : data?.items.map(ad => <AdCard key={ad.id} {...ad} />)}
              </SimpleGrid>
            )}
            <PaginationAds data={data}/>
          </div>
        </div>
      </div>
    </div>
  )
}
