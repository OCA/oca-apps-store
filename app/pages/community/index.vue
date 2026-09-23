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
      <div class="w-full">
        <UAlert
          color="neutral"
          variant="naked"
          :description="t('person.search.members_displayed')!"
          icon="lucide:info"
          class="text-xs"
        />
      </div>
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
import type {
  Facet,
  FacetSearchParam,
  FacetSearchResult,
  Person,
} from '~~/models'
const { t } = useI18n()
const route = useRoute()

const { data: content } = await useAsyncData(`community-modules`, () => {
  return queryCollection('docs').path(route.path).first()
})
useSeoMeta(content.value?.seo || {})

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
const sortBy = ref('collaboration_index:desc')
const query = computed(() => {
  return {
    q: searchTermsDebounced.value,
    query_by: 'name,github_users,company.name',
  }
})
const displayMode = ref<'grid' | 'list'>('grid')
const perPage = 12
const searchTerms = ref('')
const searchTermsDebounced = useDebounce(searchTerms, 500)
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
  const res = await personService.facetSearch(query, facets)
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
