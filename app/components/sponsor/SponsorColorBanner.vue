<template>
  <div class="relative pt-14 pb-1 md:pt-32 md:pb-10">
    <div
      class="absolute top-0 left-1/2 -z-10 h-[120%] w-screen -translate-x-1/2 -skew-y-3 transform opacity-5"
      :class="bcgSponsorColor"
    />
    <div class="flex justify-between gap-1">
      <div
        class="mb-2 text-3xl font-bold"
        :style="{
          color: sponsorship?.color || '#FD9182 ',
        }"
      >
        <slot name="title">
          {{ sponsorship.title }}
        </slot>
      </div>
      <div class="hidden md:block">
        <UButton
          :href="buttonUrl"
          :label="t('sponsors.become', { name: sponsorship?.name })"
          color="neutral"
          variant="solid"
          icon="contribute"
          target="_blank"
        />
      </div>
    </div>
    <slot name="description"> </slot>
  </div>
</template>
<script setup lang="ts">
import type { SponsorLevelsCollectionItem } from '@nuxt/content'

const { t } = useI18n()
const props = defineProps<{
  sponsorship: SponsorLevelsCollectionItem
}>()

const bcgSponsorColor = computed(() => {
  switch (props.sponsorship.name) {
    case 'Platinum':
      return 'bg-platinum light:opacity-10 '
    case 'Gold':
      return 'bg-gold light:opacity-10 dark:bg-gold/75'
    case 'Silver':
      return 'bg-silver light:opacity-10 '
    case 'Bronze':
      return 'bg-bronze light:opacity-10 '
    default:
      return ''
  }
})
const buttonUrl = computed(() => {
  switch (props.sponsorship?.level) {
    case '1':
      return ' https://www.odoo-community.org/shop/26-spp-2026-oca-platinum-sponsorship-716967'

    case '2':
      return 'https://www.odoo-community.org/shop/26-spg-2026-oca-gold-sponsorship-716966'

    case '3':
      return 'https://www.odoo-community.org/shop/26-sps-2026-oca-silver-sponsorship-716965'

    case '4':
      return 'https://www.odoo-community.org/shop/26-spb-2026-oca-bronze-sponsorship-716964 '

    default:
      return 'https://odoo-community.org/get-involved/become-a-sponsor'
  }
})
</script>
<style scoped>
.background-style::before {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  right: -50%;
  bottom: 0;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.platinum-image::before {
  background-color: #fafbfa;
}

.gold-image::before {
  background-color: #fffbf5;
}

.silver-image::before {
  background-color: #fafbfa;
}

.bronze-image::before {
  background-color: #e0c483;
}
</style>
