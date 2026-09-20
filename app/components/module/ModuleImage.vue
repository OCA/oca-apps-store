<template>
  <div>
    <NuxtImg
      :class="sizeClasses"
      :src="imageSrc"
      :alt="module?.name"
      loading="lazy"
      fetchpriority="low"
      :sizes="sizeString"
    />
    
  </div>
</template>
<script lang="ts" setup>
import type { Module } from '~~/models'

const props = withDefaults(
  defineProps<{
    module: Module | null
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    size: 'md',
  }
)

const colorMode = useColorMode()

const imageSrc = computed(() => {
  if (props.module?.iconUrl) return props.module.iconUrl

  return colorMode.value === 'dark'
    ? useAssetUrl('/img/oca_modules_logo_vertical_dark.png')
    : useAssetUrl('/img/oca_modules_logo_vertical.png')
})
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-12 h-12 '
    case 'md':
      return 'max-w-16 h-16'
    case 'lg':
      return 'max-w-48 h-48'
    default:
      return 'max-w-24 h-24'
  }
})
const sizeString = computed(() => {
  switch (props.size) {
    case 'sm':
      return '48px'
    case 'md':
      return '64px'
    case 'lg':
      return '96px'
    default:
      return '96px'
  }
})
</script>
