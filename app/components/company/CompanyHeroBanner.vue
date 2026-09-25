<template>
  <UPageCard
    v-if="company"
    orientation="horizontal"
    :ui="{
      root: 'ring-0 relative pt-8',
      title:
        'max-md:px-0 flex items-start justify-start md:col-span-1 gap-0 md:pb-4 w-full font-normal',
      description: 'w-full md:px-4',
      container:
        'max-md:w-full max-md:max-w-full flex-col-reverse justify-center items-center lg:grid-cols-3  md:grid-cols-3 lg:items-start',
      wrapper: 'md:col-span-2',
      body: 'w-full',
      header: 'p-0 relative',
    }"
  >
    <template #title>
      <slot name="left" />
      <div class="md:max-w-full">
        <ProseH1
          v-if="company?.name"
          class="mb-0 pt-2 text-2xl font-bold text-primary uppercase md:text-3xl lg:text-4xl xl:text-5xl"
        >
          {{ company.name }}
        </ProseH1>

        <div class="flex items-start gap-2 pt-4 max-md:flex-wrap md:pt-4">
          <template v-if="countries.length > 0">
            <UBadge
              v-for="(loc, i) in countries"
              :key="i"
              variant="solid"
              class="gap-3 rounded-full"
              color="primary"
              size="md"
              :label="loc.label"
            />
          </template>
          <UPageLinks orientation="horizontal" :links="links"></UPageLinks>
        </div>
      </div>
    </template>
    <template #description>
      <slot name="description">
        <div>
          <div class="flex flex-wrap gap-4 p-4 max-md:px-0 md:gap-6 md:pl-0">
            <template v-for="contact in company.contacts" :key="contact.name">
              <CompanyContact :contact="contact" company="company" />
            </template>
          </div>
          <MDC
            v-if="company.sponsorship?.description"
            :value="company.sponsorship.description"
          />
          <div v-else>
            {{ company?.sponsorship?.shortDescription }}
          </div>
        </div>
      </slot>
      <div class="flex flex-wrap justify-start gap-2 py-3">
        <CompanyStats :company="company" />
      </div>
    </template>
    <div
      v-if="company?.logoUrls?.l && company.sponsorship"
      class="pb-4 md:pb-0"
    >
      <nuxt-img
        :src="company.logoUrls?.l"
        :alt="company.logoUrls?.alt"
        class="m-4 ml-0 dark:brightness-10 dark:grayscale dark:invert"
        sizes="128px md:300px"
      />
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import type { Company, Sponsor } from '~~/models'
import type { UPageLink } from '@nuxt/ui'
const props = defineProps<{
  company: Company | Sponsor
}>()

const countries = computed(() => {
  const countriesList: any[] = []
  if (!props.company.contacts) return []
  props.company.contacts.map((contact) => {
    return countriesList.push(contact.country)
  })

  return countriesList
})
const links = computed<UPageLink[]>(() => {
  const items: UPageLink[] = []
  if (props.company?.website.url && props.company.sponsorship) {
    items.push({
      label: props.company.website.label,
      icon: 'website',
      to: props.company.website.url,
      target: '_blank',
    })
  }
  return items
})
</script>
