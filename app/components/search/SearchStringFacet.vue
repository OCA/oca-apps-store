<template>
  <div>
    <UFormField v-if="props.searchable" :label="title">
      <UInput v-model="searchQuery" size="sm" clearable icon="search">
        <template v-if="searchQuery?.length" #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="close"
            @click="searchQuery = ''"
          />
        </template>
      </UInput>
    </UFormField>
    <USeparator class="my-2" />
    <slot name="items" :items="transformedItems" :change="refine">
      <div v-if="transformedItems?.length" class="flex flex-col gap-2">
        <UCheckbox
          v-for="item in transformedItems"
          :key="item.value"
          :label="item?.label || item?.value"
          :description="item?.count?.toString()"
          :model-value="values.includes(item?.value)"
          :ui="{
            root: 'min-w-48 pr-2',
            wrapper: 'flex justify-between items-start',
          }"
          @change="refine(item?.value)"
        />
        <div class="flex justify-end">
          <UButton
            v-if="items.length >= 10"
            color="neutral"
            variant="link"
            size="xs"
            :label="
              displayAllValues
                ? t('search.filters.showTop')
                : t('search.filters.showAll')
            "
            @click="displayAllValues = !displayAllValues"
          />
        </div>
      </div>
      <div v-if="values?.length > 0" class="flex justify-end">
        <UButton
          color="neutral"
          variant="link"
          size="xs"
          :label="t('search.filters.reset')"
          @click="reset"
        />
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { UButton } from '#components'
import type { FacetWithResult } from '~~/models'

const emit = defineEmits<{
  (e: 'refine' | 'searchInFacet' | 'labelValue', query: string): void
}>()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const props = defineProps<FacetWithResult>()
const displayAllValues = ref(false)
const searchQuery = ref('')
const searchQueryDebounced = useDebounce(searchQuery, 300)

const parseQueryToValues = (query?: string): string[] => {
  if (!query) return []
  const match = query.match(/:=\[(.*)\]/)
  if (match && match[1]) {
    return match[1].split(',').map((v) => v.replace(/`/g, '').trim())
  }
  return []
}
const parseValuesToQuery = (values: string[]): string => {
  if (values.length === 0) return ''
  return `${props.field}:=[${values.map((v) => `\`${v}\``).join(',')}]`
}

const transformedItems = computed(() => {
  let items = props.items || []
  if (props.transformItems) {
    items = props.transformItems(props.items)
  }

  if (!displayAllValues.value) {
    items = items.slice(0, 10)
  }

  /**
   * Add missing values to items to allow searching for values that are not in the top of the facet results.
   * This is useful when the user has selected a value that is not in the top of the facet results,
   * or when searching in facet values.
   */
  if (values.value?.length > 0) {
    return values.value.reduce((acc: any[], val) => {
      const existing = items.find((i) => i.value === val)
      if (!existing) {
        acc = [{ value: val, label: val, count: null }, ...acc]
      }

      return acc
    }, items || [])
  }
  return items
})

const reset = () => {
  values.value = []
  refine()
}

const refine = (value?: string) => {
  if (value && values.value.includes(value)) {
    values.value = values.value.filter((v) => v !== value)
  } else if (value) {
    values.value.push(value)
  }
  let query = ''
  if (values.value.length > 0) {
    query = parseValuesToQuery(values.value)
  }
  setLabelValue(values.value)
  emit('refine', query)
  router.push({
    query: {
      ...route.query,
      [props?.routeParam || props.field]: values.value,
    },
  })
}

const values = ref<string[]>(parseQueryToValues(props.query))
const field = props.routeParam || props.field
if (values.value.length === 0 && route.query[field]) {
  if (Array.isArray(route.query[field])) {
    values.value = route.query[field] as string[]
  } else if (typeof route.query[field] === 'string') {
    values.value = [route.query[field] as string]
  }
}
const setLabelValue = (values: string[]) => {
  if (values?.length > 1) {
    emit('labelValue', values.length?.toString())
  } else {
    emit('labelValue', values?.[0] || '')
  }
}
/**
 * Declare the facet to the searchBase component.
 * this is necessary to allow the searchBase component to keep track of the facet state and to allow searching in facet values
 */
const initFacet = inject<(field: string, query: string) => void>('init-facet')
if (initFacet) {
  initFacet(props.field, parseValuesToQuery(values.value))
}
setLabelValue(values.value)

/** Watch search query and emit search in facet event */
watch(searchQueryDebounced, () => {
  emit('searchInFacet', searchQueryDebounced.value)
})
</script>
