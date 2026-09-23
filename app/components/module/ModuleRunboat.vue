<template>
  <div
    v-if="module && module?.runboatURL"
    class="inline-flex flex-col items-center justify-end gap-2"
  >
    <UButton
      variant="solid"
      color="secondary"
      :href="module?.runboatURL"
      size="lg"
      icon="runboat"
      target="_blank"
      class="max-lg:px-10"
    >
      <div class="text-nowrap">
        {{ t('modules.runboat.try') }}
        <span class="font-bold"> {{ t('modules.runboat.name') }} ! </span>
      </div>
    </UButton>

    <UButton
      href="https://odoo-community.org/how-to-test-odoo-oca-module"
      target="_blank"
      icon="help"
      variant="link"
      size="xs"
      :label="t('modules.runboat.how_to_test')"
    />
  </div>
</template>
<script setup lang="ts">
import type { Module } from '~~/models'
const props = defineProps<{
  module: Module | null
}>()

const { t } = useI18n()
</script>
