<template>
  <NuxtLink
    :to="localePath('/')"
    class="flex items-center space-x-2"
    aria-label="OCA App Store"
  >
    <UColorModeImage
      :light="lightLogo"
      :dark="darkLogo"
      class="max-w-24"
      alt="OCA App Store"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const lightLogo = useAssetUrl('/oca-logo.png')
const darkLogo = useAssetUrl('/oca-logo-light.png')
</script>
