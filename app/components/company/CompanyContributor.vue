<template>
  <div
    ref="container"
    class="scroll-mt-20 py-4 pb-32"
  >
    <slot name="header">
      <ProseH2 class="mt-28 mb-4 text-3xl font-extrabold text-primary lg:text-4xl">
        <span class="pr-1 uppercase">{{ company.name }}</span>
        <span class="text-secondary">{{ t('company.members.title') }}</span>
      </ProseH2>
    </slot>

    <div class="flex flex-col items-end justify-between gap-2 pb-5 md:flex-row md:items-center">
      <UFormField class="min-w-72">
        <SearchBox
          v-model="searchTerms"
          :placeholder="[t('person.search.placeholder')]"
        />
      </UFormField>

      <div class="flex flex-1 items-center gap-2">
        <div class="flex-1">
          <SearchFacetsList
            :facets="facets"
            :results="facetResults"
            :query-facets="queryFacets"
            @refine="onChangeFilter"
            @search-in-facet="onSearchInFacet"
          />
        </div>

        <div class="flex items-center gap-2">
          <div class="flex flex-col gap-0">
            <SearchSortSelector
              :options="sortOptions"
              :value="sortBy"
              class="my-0"
              @change="onSort"
            />
            <UButton
              href="https://www.odoo-community.org/blog/news-updates-1/oca-new-kpi-s-for-ranking-our-contributors-195"
              target="_blank"
              icon="help"
              variant="link"
              size="xs"
              class="mx-auto text-neutral"
              :label="t('companies.sort.collaboration_index_explanation_btn')"
            />
          </div>

          <UFieldGroup class="hidden sm:flex">
            <UButton
              color="neutral"
              :variant="displayMode === 'list' ? 'subtle' : 'outline'"
              leading-icon="i-mdi-view-list"
              @click="displayMode = 'list'"
            />
            <UButton
              color="neutral"
              :variant="displayMode === 'grid' ? 'subtle' : 'outline'"
              leading-icon="i-mdi-view-grid"
              @click="displayMode = 'grid'"
            />
          </UFieldGroup>
        </div>
      </div>
    </div>

  
    <div v-if="error" class="mx-auto my-10 max-w-lg">
      <UAlert
        type="error"
        color="error"
        icon="error"
        variant="outline"
        orientation="horizontal"
        :title="t('search.error.title')"
        :description="error?.message || 'An error occurred during the search'"
        :actions="[{ label: t('search.error.retry'), color: 'neutral', onClick: search }]"
      />
    </div>

    
    <div v-else-if="!isLoading && results.hits.length === 0" class="py-10 text-center text-muted">
      {{ t('search.noresults') }}
    </div>

    <template v-else>
      <div class="min-h-8 pb-3">
        <div v-if="!isLoading" class="text-xs text-muted">
          {{ t('search.results.count', { count: results.found }) }}
        </div>
      </div>

      <UPageGrid :class="displayMode === 'list' ? 'flex flex-col gap-3 sm:gap-4' : 'gap-3 sm:gap-5'">
        <template v-if="!isLoading">
          <PersonHit
            v-for="person in results.hits"
            :key="person.id"
            :variant="displayMode"
            :person="person"
          />
        </template>
        
   
        <template v-else>
          <UCard
            v-for="n in perPage"
            :key="n"
            :ui="{ header: 'p-0 sm:p-0 h-64 sm:h-48 md:h-64' }"
          >
            <template #header>
              <USkeleton class="h-64 w-full sm:h-48 md:h-64" />
            </template>
            <div class="grid gap-2">
              <USkeleton class="h-4 w-62.5" />
              <USkeleton class="h-4 w-50" />
            </div>
          </UCard>
        </template>
      </UPageGrid>

    
      <div class="mt-10 flex items-end justify-center gap-4">
        <UFormField :label="t('search.pagination.perPage')">
          <USelect
            v-model="perPage"
            :items="perPageItems"
            class="w-full"
          />
        </UFormField>
        <UPagination
          v-if="results.found > perPage"
          v-model:page="page"
          :items-per-page="perPage"
          :total="results.found"
          @update:page="handlePageChange"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type {
  Company,
  Facet,
  FacetSearchParam,
  FacetSearchResult,
  FacetWithResult,
  Person,
} from '~~/models'

const props = defineProps<{ company: Company }>()

const { t } = useI18n()
const route = useRoute()
const { start, finish } = useLoadingIndicator()
const personService = useService('persons')
const container = useTemplateRef<HTMLDivElement>('container')

// State
const perPageCookie = useCookie('search_per_page')
const searchTerms = ref('')
const searchTermsDebounced = useDebounce(searchTerms, 500)
const page = ref(1)
const perPage = ref(Number(perPageCookie.value) || 12)
const displayMode = ref<'grid' | 'list'>('grid')
const isLoading = ref(false)
const error = ref<Error | null>(null)

const searchInFacet = reactive<Record<string, string>>({})
const queryFacets = reactive<Record<string, string>>({})
let initFacetCount = 0


const perPageItems = [12, 24, 48, 96]
const sortOptions = computed(() => [
  { label: t('person.sort.collaboration_index_desc'), value: 'collaboration_index:desc' },
  { label: t('person.sort.name_asc'), value: 'name:asc' },
  { label: t('person.sort.name_desc'), value: 'name:desc' },
])
const sortBy = ref(sortOptions.value[0]?.value || 'collaboration_index:desc')

const facets = computed<Facet[]>(() => [
  { field: 'country.label', title: t('person.filters.countries'), searchable: true },
  { field: 'roles.name', title: t('person.filters.roles') },
])

const hasFacetQuery = computed(() => 
  facets.value.some((f) => route.query[f.routeParam || f.field])
)


const buildFacetData = (): FacetSearchParam[] => 
  facets.value.map((f) => ({
    field: f.field,
    query: queryFacets[f.field] || '',
    searchTerm: searchInFacet[f.field] || undefined,
    sortBy: f.sortBy,
    perPage: f.perPage || 10,
  }))

const performSearchQuery = (): Promise<FacetSearchResult<Person>> => {
  const searchQuery = {
    q: searchTermsDebounced.value,
    query_by: 'name,github_users,company.name',
    filter_by: `company.id:=${props.company.id}`,
    per_page: perPage.value,
    sort_by: sortBy.value,
    page: page.value,
  }
  return personService.facetSearch(searchQuery, buildFacetData())
}

// Initial Async Load
const { data } = await useAsyncData<FacetSearchResult<Person> | null>(
  `company-contributors-${props.company.id}-${route.fullPath}`,
  () => (hasFacetQuery.value ? null : performSearchQuery()),
  { watch: [() => route.path] }
)

if (hasFacetQuery.value) isLoading.value = true

const results = reactive<FacetSearchResult<Person>>({
  hits: data.value?.hits || [],
  found: data.value?.found || 0,
  facets: data.value?.facets || ([] as unknown as FacetSearchResult<Person>['facets']),
})

const facetResults = computed(() => results as unknown as FacetWithResult)


const search = async (resetPage = false) => {
  if (resetPage) page.value = 1

  isLoading.value = true
  error.value = null

  try {
    start({ force: true })
    const response = await performSearchQuery()
    results.hits = response.hits || []
    results.found = response.found || 0
    results.facets = response.facets || ([] as unknown as FacetSearchResult<Person>['facets'])
  } catch (err) {
    console.error(err)
    error.value = err as Error
  } finally {
    isLoading.value = false
    finish()
  }
}

const onChangeFilter = (facetName: string, facetQuery: string) => {
  queryFacets[facetName] = facetQuery
  search(true)
}

const onSearchInFacet = async (facetName: string, facetQuery: string) => {
  searchInFacet[facetName] = facetQuery
  const response = await performSearchQuery()
  results.facets = response.facets || ([] as unknown as FacetSearchResult<Person>['facets'])
}

const onSort = (value: string) => {
  if (sortBy.value === value) return
  sortBy.value = value
  search()
}

const handlePageChange = () => {
  container.value?.scrollIntoView({ behavior: 'instant' })
  search()
}


provide('init-facet', (field: string, facetQuery: string) => {
  if (facetQuery) queryFacets[field] = facetQuery
  initFacetCount++
  if (initFacetCount >= facets.value.length && hasFacetQuery.value) {
    search()
  }
})

onMounted(() => {
  if (!data.value) search()
})


watch([searchTermsDebounced, perPage], () => {
  if (perPage.value) perPageCookie.value = perPage.value.toString()
  search(true)
})
</script>