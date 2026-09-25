<!-- ~/components/sponsorHit.vue -->
<template>
  <UCard
    :ui="{
      root: isClickable
        ? 'hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer'
        : '',
      header: 'border-b-0 sm:px-4',
      body: 'py-2 sm:py-3 sm:px-4 border-b-0',
    }"
    @click="onClick"
  >
    <template #header>
      <div class="flex flex-col items-start justify-between">
        <div class="m-4 ml-0 flex min-h-28 items-center max-md:m-1">
          <nuxt-img
            :src="sponsor?.logoUrls?.m"
            :alt="sponsor.name"
            sizes="128px md:180px"
            class="md:max-h-28 md:max-w-64 dark:brightness-10 dark:grayscale dark:invert"
            fit="contain"
            loading="lazy"
            quality="80"
            :to="`/sponsors/${sponsor.urlKey}`"
          />
        </div>
        <div class="flex w-full items-center justify-between gap-1">
          <div class="flex-1 text-xl font-semibold">
            <nuxt-link v-if="isClickable" :to="`/${sponsor.urlKey}`">
              {{ sponsor.name }}
            </nuxt-link>
            <span v-else>{{ sponsor.name }}</span>
          </div>
          <div v-if="sponsor.website?.url">
            <UButton
              variant="link"
              size="sm"
              :label="sponsor.website?.label || sponsor?.website?.url"
              icon="website"
              :to="sponsor.website.url"
              target="_blank"
            />
          </div>
        </div>
      </div>
    </template>

    <div class="flex space-x-2">
      <UBadge
        v-for="(loc, i) in sponsor.countries"
        :key="i"
        variant="solid"
        class="rounded-full"
        color="primary"
        size="sm"
      >
        {{ loc.label }}
      </UBadge>
    </div>

    <p
      v-if="sponsor.sponsorship?.shortDescription"
      class="mt-4 text-sm text-muted"
      v-html="sponsor.sponsorship?.shortDescription"
    />

    <template #footer>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center space-x-1 md:space-x-2">
          <UIcon name="group" class="text-primary" />
          <span class="text-sm">
            <span class="text-secondary">{{ sponsor.membersCount }}</span>
            {{ $t('company.stats.members') }}
          </span>
        </div>
        <div class="flex items-center space-x-1 md:space-x-2">
          <UIcon name="award" class="text-primary" />
          <span class="text-sm"
            >{{ $t('company.stats.collaboration_index') }}:
            <span class="text-secondary">{{ sponsor.collaborationIndex }}</span>
          </span>
        </div>
        <div
          v-if="sponsor?.sponsorship?.collaborators?.length > 0"
          class="flex items-center space-x-1 md:space-x-2"
        >
          <UIcon name="code" class="text-primary" />
          <span class="text-sm">
            <span class="text-secondary"
              >{{ sponsor.sponsorship?.collaborators?.length }}
            </span>
            Contributors
          </span>
        </div>
        <div
          v-if="sponsor?.sponsorship?.industries?.length > 0"
          class="flex items-center space-x-1 md:space-x-2"
        >
          <UIcon name="industries" class="text-primary" />
          <span class="text-sm">
            <span class="text-secondary">{{
              sponsor?.sponsorship?.industries?.length
            }}</span>
            Industries
          </span>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { Sponsor } from '~~/models'
const props = defineProps<{
  sponsor: Sponsor
}>()
const isClickable = computed(() => {
  const levelWithpage = [1, 2, 3, 4]
  return levelWithpage.includes(props.sponsor?.sponsorship?.level?.id)
})

const onClick = () => {
  if (isClickable.value) {
    navigateTo(`/${props.sponsor.urlKey}`)
  }
}
</script>
