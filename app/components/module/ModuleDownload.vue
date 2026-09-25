<template>
  <UCard
    :ui="{
      root: 'shadow-md ring-0',
      header: 'px-6 sm:px-10',
      body: 'px-6 sm:px-10',
      footer: 'py-4 sm:py-6',
    }"
  >
    <template #header>
      <div class="flex items-center gap-2 py-2 text-info">
        <ModuleImage :module="module" size="md" />
        <div>
          <div class="text-xl font-bold md:text-4xl">
            Get the Odoo
            <span class="text-secondary">App</span>
          </div>
          <div class="flex gap-1">
            <UBadge
              v-if="module?.license"
              @click="() => {}"
              color="neutral"
              variant="outline"
              size="sm"
              class="rounded-full"
            >
              {{ t('modules.license.label') }}: <b>{{ module?.license }}</b>
            </UBadge>
            <UBadge
              v-if="module?.version"
              color="neutral"
              variant="outline"
              size="sm"
              class="rounded-full"
            >
              {{ t('modules.version.label') }}: <b>{{ module?.version }}</b>
            </UBadge>
            <UBadge
              v-if="module?.maturity"
              color="neutral"
              variant="outline"
              size="sm"
              class="rounded-full"
            >
              {{ t('modules.maturity.label') }}: <b>{{ module?.maturity }}</b>
            </UBadge>
          </div>
        </div>
      </div>
    </template>
    <ModuleInfo v-if="module" :module="module" />
    <template #footer>
      <div
        class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
      >
        <UFormField
          :label="t('modules.series.label')"
          :help="series?.length == 1 ? selectedSerie : ''"
        >
          <template v-if="series && series?.length > 1">
            <USelect
              v-model="selectedSerie"
              :items="series"
              :placeholder="t('modules.version.placeholder')"
              class="w-32"
              @change="() => emits('serieChange', selectedSerie!)"
            />
          </template>
        </UFormField>
        <div class="flex flex-col justify-center gap-2 max-lg:justify-end">
          <UButton
            v-if="module?.githubUrl"
            color="info"
            :href="module?.githubUrl"
            target="_blank"
            leading-icon="github"
            class="px-10"
            :label="t('modules.github.link')"
            size="lg"
          />

          <UButton
            href="https://www.odoo-community.org/how-to-download-an-oca-module-from-github"
            target="_blank"
            icon="help"
            variant="link"
            size="xs"
            class="mx-auto"
            :label="t('modules.runboat.how_to_download')"
          />
        </div>
      </div>
    </template>
  </UCard>
</template>
<script lang="ts" setup>
import type { ModuleGroupedHit, Module } from '~~/models'

const { t } = useI18n()
const emits = defineEmits<{
  (e: 'serieChange', serie: string): void
}>()
const props = defineProps<{
  moduleGrouped: ModuleGroupedHit | null
  selectedModule?: Module | null
}>()
const modules = computed(() => props.moduleGrouped?.hits || [])
const lastSerie = computed(() => modules.value?.[0]?.serie || null)
const selectedSerie = ref<string | null>(
  props?.selectedModule?.serie || lastSerie.value
)
const module = computed(
  () =>
    modules.value.find(({ serie }) => serie == props.selectedModule?.serie) ||
    null
)

const series = computed(() => {
  return props.moduleGrouped?.hits
    ?.reduce((acc: string[], hit) => {
      if (hit.serie && !acc.includes(hit.serie)) {
        acc.push(hit.serie)
      }
      return acc
    }, [])
    .sort((a, b) => parseFloat(a) - parseFloat(b))
})

watch(
  () => props.selectedModule,
  () => {
    selectedSerie.value =
      props.selectedModule?.serie || modules.value?.[0]?.serie
  }
)
</script>
