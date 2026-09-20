<template>
  <NuxtLink
    to="https://www.odoo-community.org/"
    target="_blank"
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
const lightLogo = useAssetUrl('/oca-logo.png')
const darkLogo = useAssetUrl('/oca-logo-light.png')
</script>
