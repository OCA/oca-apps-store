<template>
  <SearchBase
    v-model:page="page"
    v-model:sort-by="sortBy"
    :query="query"
    :facets="facets"
    :sort-options="sortOptions"
    :infinite-scroll="false"
    :search-function="searchFunction"
    :per-page="perPage"
    :ui="ui"
  >
    <template #header>
      
      <ProseH2 class="mt-28 mb-4 text-3xl font-extrabold text-primary lg:text-4xl">
        <span class="pr-1 uppercase">
          {{ company.name }}
        </span>
        <span class="text-secondary">
          {{ t('company.members.title') }}
        </span>
      </ProseH2>
    </template>
    <template #actions>
      <UFormField class="min-w-72">
        <SearchBox
          v-model="searchTerms"
          :placeholder="[t('person.search.placeholder')]"
        />
      </UFormField>
    </template>
    <template #sort="{ sortOptions, value, change }">
      <div class="flex items-center gap-2">
        <div class="flex flex-col gap-0">
          <SearchSortSelector
            :options="sortOptions"
            :value="value"
            class="my-0"
            @change="change"
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
    </template>

    <template #hit="{ hit: person, index, total }">
      <PersonHit :variant="displayMode" :person="person" />
    </template>
   
    
  </SearchBase>
</template>
<script setup lang="ts">
import type { Company, PersonRole, Facet,
  FacetSearchParam,
  FacetSearchResult,
  Person } from '~~/models'

  const props = defineProps<{
  company: Company
}>()
const { t } = useI18n()
const searchTerms = ref('')
const searchTermsDebounced = useDebounce(searchTerms, 500)
const page = ref(1)
const perPage = 12

const displayMode = ref<'grid' | 'list'>('grid')

const personService = useService('persons')

const sortOptions = computed(() => {
  return [
    {
      label: t('person.sort.collaboration_index_desc'),
      value: 'collaboration_index:desc',
    },
    { label: t('person.sort.name_asc'), value: 'name:asc' },
    { label: t('person.sort.name_desc'), value: 'name:desc' },
  ]
})
const query = computed(() => {
  return {
    q: searchTermsDebounced.value,
    query_by: 'name,github_users,company.name',
    filter_by: `company.id:=${props.company.id}`,
  }
})
const sortBy = ref('collaboration_index:desc')


const facets: Facet[] = [
  {
    field: 'country.label',
    title: t('person.filters.countries'),
    searchable: true,
  },
  {
    field: 'roles.name',
    title: t('person.filters.roles'),
  },
]
const searchFunction = async (
  query: any,
  facets: FacetSearchParam[]
): Promise<FacetSearchResult<Person>> => {
  const companyFilter = `company.id:=${props.company.id}`

  const scopedQuery = {
    ...query,
    filter_by: query.filter_by
      ? `${companyFilter} && ${query.filter_by}`
      : companyFilter,
  }

  const res = await personService.facetSearch(scopedQuery, facets)
  return res
}
const ui = computed(() => {
  return {
    results:
      displayMode.value === 'list'
        ? 'flex flex-col gap-3 sm:gap-4'
        : 'gap-3 sm:gap-5',
  }
})
</script>
