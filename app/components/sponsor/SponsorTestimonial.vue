<template>
  <div v-if="sponsor.sponsorship?.descriptionWhyOca" class="relative py-18">
    <div
      class="absolute -top-12 left-1/2 -z-10 h-[100%] w-screen -translate-x-1/2 transform bg-primary-500 mt-24"
    />
    <img
      :src="backgroundLogo"
      alt="Illustration"
      class="absolute top-0 -left-100 z-10 h-full w-full object-none object-left opacity-10"
    />
    <UPageCTA
      :title="$t('sponsors.testimonial.title')"
      :description="sponsor.sponsorship.descriptionWhyOca"
      orientation="horizontal"
      :ui="{
        root: 'ring-0 bg-primary-500 mt-8',
        header: 'flex flex-col justify-center ',
        container: 'md:flex lg:flex py-6 sm:py-10 lg:py-16',
        title: 'text-white sm:text-6xl font-extralight py-10',
        description: 'text-white mx-auto text-lg mt-4',
      }"
    >
      <template #description>
        <div class="md:grid md:grid-cols-10">
          <div class="md:col-span-1">
            <icon name="fe:quote-left" class="mb-4 text-6xl text-white" />
          </div>
          <div class="md:col-span-9">
            <MDC
              :value="sponsor.sponsorship.descriptionWhyOca"
              class="text-white"
            />
          </div>
        </div>
      </template>
    </UPageCTA>
  </div>
</template>
<script setup lang="ts">
import type { Sponsor } from '~~/models'

const props = defineProps<{
  sponsor: Sponsor
}>()

const backgroundLogo = useAssetUrl('/img/oca_logo_bckg_white.png')
</script>
