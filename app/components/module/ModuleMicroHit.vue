<template>
  <UCard v-if="moduleGrouped" :ui="ui" @click="onClick">
    <ModuleImage :module="module" size="sm" class="w-12" />
    <div class="w-full">
      <div class="line-clamp-2 pb-3 text-lg leading-5 font-bold">
        <nuxt-link
          v-if="module?.urlKey"
          :to="`/modules/${module.urlKey}`"
          class="break-all hover:underline"
        >
          {{ module?.name }}
        </nuxt-link>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1 text-sm text-muted">
          <UIcon name="repository" class="text-primary" />
          {{ module?.repository?.name }}
        </div>
      </div>
      <ModuleSerieList :module-grouped="moduleGrouped" size="sm" class="py-1" />
      <div class="text-sm text-muted">
        {{ module?.summary }}
      </div>
      <div class="flex justify-end pt-4">
        <UButton
          v-if="module?.urlKey"
          color="neutral"
          variant="outline"
          size="sm"
          leading-icon="module"
          :label="t('modules.link')"
          :to="`/modules/${module.urlKey}`"
        />
      </div>
    </div>
  </UCard>
</template>
<script lang="ts" setup>
import type { ModuleGroupedHit } from '~~/models'

const props = defineProps<{
  moduleGrouped: ModuleGroupedHit | null
}>()
const { t } = useI18n()
const modules = computed(() => props.moduleGrouped?.hits || [])
const module = computed(() => modules.value[modules.value.length - 1] || null)
const ui = computed(() => {
  return {
    root:
      'bg-elevated ' +
      (module.value?.urlKey
        ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer'
        : ''),
    body: 'flex items-start gap-3',
  }
})

const onClick = () => {
  if (module.value?.urlKey) {
    navigateTo(`/modules/${module.value.urlKey}`)
  }
}
</script>
