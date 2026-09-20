<template>
  <div
    v-if="module?.readmeFragments?.usage"
    class="relative flex justify-end py-10 md:py-16"
  >
    <div
      :style="backgroundStyle"
      class="max-lg:bg-size-full absolute bottom-0 left-1/2 -z-10 hidden h-full w-screen -translate-x-1/2 transform  bg-size-[200px_auto] bg-no-repeat opacity-20 lg:block lg:bg-size-[400px_auto] lg:bg-position-[left_-200px_bottom_2rem]"
    />

    <div class="w-full lg:max-w-[75vw] xl:max-w-[75vw] 2xl:max-w-none">
      <ProseH2 class="my-2 text-2xl text-secondary md:text-3xl">
        {{ t('modules.usage.title') }}
      </ProseH2>
      <MDC :value="module.readmeFragments.usage" />
      <div class="text-right">
        <ModuleRunboat :module="module" size="lg" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Module } from '~~/models'
const props = defineProps<{
  module: Module | null
}>()

const colorMode = useColorMode()

const backgroundStyle = computed(() =>
  colorMode.value === 'dark'
    ? `background-image: url(${useAssetUrl('/logo-bg_dark.png')})`
    : `background-image: url(${useAssetUrl('/logo-bg.png')})`
)


const { t } = useI18n()
</script>
