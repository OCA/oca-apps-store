<template>
  <div class="">
    <div v-if="module" class="relative mt-15 py-16 lg:py-20 xl:py-24">
      <div
        class="dark:to-highlighted/50 absolute top-0 left-1/2 -z-5 h-full w-screen -translate-x-1/2 transform overflow-hidden bg-primary-500 bg-linear-to-r from-primary-500 via-primary-600 to-secondary-900/50 content-[''] dark:bg-transparent dark:from-elevated/75 dark:via-elevated/50 dark:to-elevated"
      >
        <UIcon
          name="i-solar-bug-bold"
          class="absolute top-5 -right-20 hidden size-64 -rotate-45 border text-white opacity-15 md:flex xl:top-10 xl:right-10 2xl:top-10 2xl:right-20"
        />
      </div>
      <div class="relative flex items-center gap-16 md:px-10">
        <div class="w-full md:w-10/12">
          <ProseH2
            class="my-2 text-2xl text-secondary md:text-3xl dark:text-highlighted"
          >
            {{ t('modules.bugTracker.title') }}
          </ProseH2>
          <MDC
            v-if="module?.bugTracker?.instructions"
            :value="module.bugTracker.instructions"
            class="text-white"
          />
          <ProseP v-else class="text-white">
            {{ t('modules.bugTracker.description') }}
          </ProseP>
          <div class="flex justify-end py-3">
            <UButton
              v-if="module?.bugTracker?.url"
              :href="module.bugTracker.url"
              variant="solid"
              size="lg"
              color="secondary"
              target="_blank"
              class="mt-4"
              :label="t('modules.bugTracker.goTo')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Module } from '~~/models'

const props = defineProps<{
  module: Module | null
}>()

const { t } = useI18n()
</script>
