<template>
  <UCard
    :ui="ui"
    :style="style"
    @click="onClick(sponsorLevel)"
    class="cursor-pointer"
  >
    <template #header>
      <div class="flex h-full flex-col items-end justify-between">
        <div class="flex w-full items-center justify-between gap-4">
          <nuxt-img
            v-if="sponsorLevel"
            :src="company?.logoUrls?.m"
            alt="Logo"
            class="ml-0 max-h-20 rounded-md object-contain p-4"
            sizes="100px md:128px"
          />
          <div class="flex flex-col items-end justify-end gap-2">
            <SponsorLogo
              v-if="sponsorLevel"
              :sponsor-level="sponsorLevel"
              size="sm"
              class="min-w-20"
            />
          </div>
        </div>
        <div class="flex w-full items-start justify-between gap-1">
          <div
            class="flex w-full justify-between text-lg font-semibold text-primary"
          >
            <nuxt-link :to="`/${company.urlKey}`">
              {{ company.name }}
            </nuxt-link>
            <UButton
              v-if="company.website?.url"
              variant="link"
              size="sm"
              :label="company.website?.label || company?.website?.url"
              icon="website"
              :to="company.website.url"
              target="_blank"
              class="w-auto text-right"
            />
          </div>
        </div>
      </div>
    </template>

    <div class="flex space-x-2">
      <template v-for="country in company.countries" :key="country.label">
        <UBadge variant="solid" class="rounded-full" color="primary" size="sm">
          {{ country.label }}
        </UBadge>
      </template>
    </div>

    <template #footer>
      <div class="flex justify-between gap-1">
        <div class="grid grid-cols-1 gap-2 xl:grid-cols-2">
          <div class="flex items-start space-x-1 md:space-x-2">
            <UIcon name="members" class="text-primary" />
            <span class="text-sm">
              <span class="text-secondary">{{ company.membersCount }}</span>
              {{ $t('company.stats.members') }}
            </span>
          </div>
          <div class="flex items-start space-x-1 md:space-x-2">
            <UIcon name="award" class="text-primary" />
            <span class="text-sm"
              >{{ $t('company.stats.collaboration_index') }}:
              <span class="text-secondary">{{
                company.collaborationIndex
              }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <UButton
          color="primary"
          variant="outline"
          label="View more"
          size="sm"
          trailing
          class="ml-auto cursor-pointer"
          @click="onClick(sponsorLevel)"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { isReturnStatement } from 'typescript'
import type { Company } from '~~/models'
const props = defineProps<{
  company: Company
}>()
const onClick = (sponsorLevel: any) => {
  navigateTo(`/${props.company.urlKey}`)
}
const { $sponsor } = useNuxtApp()
const sponsorLevel = $sponsor.getSponsorLevel(props.company)


const ui = computed(() => {
  const baseUi = {
    root: ' ring ring-default hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col ',
    header:
      'border-b-0 sm:px-4 pb-0 sm:pb-0 j-full flex-1 justify-end align-bottom  ',
    body: 'pb-2 sm:pb-3 pt-0 sm:pt-1 sm:px-4 border-b-1 border-default flex-1 ',
  }
  return baseUi
})
</script>
