<template>
  <SearchBase
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
      <ContentRenderer v-if="content" :value="content" />
    </template>
    <template #actions>
      <UFormField>
        <UInput
          v-model="searchTerms"
          :placeholder="t('companies.search.placeholder')"
          size="lg"
          trailing-icon="search"
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
    <template #hit="{ hit: company, index, total }">
      <CompanyHit :variant="displayMode" :company="company" />
    </template>
  </SearchBase>
</template>

<script setup lang="ts">
import type {
  Facet,
  FacetSearchParam,
  FacetSearchResult,
  Company,
} from '~~/models'

const { t } = useI18n()
const route = useRoute()

const { data: content } = await useAsyncData(`companies-modules`, () => {
  return queryCollection('docs').path(route.path).first()
})
useSeoMeta(content.value?.seo || {})
const companyService = useService('companies')
const sortOptions = computed(() => {
  return [
    {
      label: t('companies.sort.collaboration_index_desc'),
      value: 'collaboration_index:desc',
    },
    { label: t('companies.sort.name_asc'), value: 'name:asc' },
    { label: t('companies.sort.name_desc'), value: 'name:desc' },
  ]
})

const sortBy = ref('collaboration_index:desc')
const query = computed(() => {
  return {
    q: searchTerms.value,
    query_by: 'name',
  }
})
const displayMode = useCookie<'grid' | 'list'>('modules_display_mode', {
  default: () => 'grid',
})
const perPage = 12
const searchTerms = ref('')
const facets: Facet[] = [
  {
    field: 'countries.label',
    title: t('sponsors.filters.countries'),
    sortBy: '_alpha:asc',
    routeParam: 'countries',
    searchable: true,
  },
]

const searchFunction = async (
  query: any,
  facets: FacetSearchParam[]
): Promise<FacetSearchResult<Company>> => {
  const res = await companyService.facetSearch(query, facets)
  return res
}

const ui = computed(() => {
  return {
    results:
      displayMode.value === 'list'
        ? 'flex flex-col gap-3 sm:gap-4'
        : 'lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5',
  }
})
</script>
