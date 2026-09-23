<template>
  <UCard
    :ui="{
      root: ui?.root,
      body: ui?.body,
      header: ui?.header,
      footer: ui?.footer,
    }"
    @click="goToPerson"
  >
    <template #header>
      <div class="flex-1">
        <UUser
          :name="person.name"
          size="lg"
          :avatar="avatar"
          :ui="{
            description: 'items-center flex gap-0.5',
          }"
        >
          <template
            #description
            v-if="person.githubUsers && person.githubUsers.length > 0"
          >
            <UButton
              variant="ghost"
              :to="`https://github.com/${person.githubUsers[0]}`"
              leading-icon="line-md:github"
              size="xs"
              :label="person.githubUsers[0]"
              target="_blank"
              :ui="{
                base: 'p-0 sm:p-0 hover:bg-transparent hover:underline gap-0.5',
                label: 'text-gray-500 dark:text-gray-600 text-sm',
              }"
            />
          </template>
        </UUser>
      </div>
      <div
        :class="{
          'flex flex-col items-start': variant === 'grid',
          'inline-flex flex-row items-center gap-1': variant == 'list',
        }"
      >
        <PersonCountry :person="person" />
      </div>
    </template>
    <PersonBadges :person="person" />
    <PersonCompany :person="person" />
    <div v-if="hasStatisticalInfo" class="flex flex-col gap-2 pt-4 text-sm">
      <PersonStats :person="person" />
    </div>
    <template #footer>
      <div class="flex justify-end">
        <UButton
          color="neutral"
          variant="outline"
          label="View more"
          size="sm"
          trailing
          class="ml-auto"
          :to="`/${person.urlKey}`"
        />
      </div>
    </template>
  </UCard>
</template>
<script setup lang="ts">
import type { Person } from '~~/models'
import { twMerge } from 'tailwind-merge'
const props = defineProps<{
  person: Person
  variant?: 'grid' | 'list'
  ui?: {
    root?: string
    body?: string
    header?: string
    footer?: string
  }
}>()

const ui = computed(() => {
  const ui = {
    root: 'w-full shadow cursor-pointer justify-start flex flex-col dark:bg-elevated/50',
    header: ' flex items-center gap-3 p-3 sm:p-4',
    body: 'p-3 sm:p-4 py-2 sm:py-2 flex-1 h-full grow border-b-0',
    footer: 'p-3 sm:p-4 ',
  }
  if (props?.variant === 'list') {
    ui.root = twMerge(
      ui.root,
      'grid grid-cols-1 grid-cols-6 gap-4 p-5 ring-0 divide-none shadow-none rounded-none border-b border-neutral-100'
    )
    ui.header = twMerge(ui.header, 'col-span-2 flex-col items-start gap-2')
    ui.body = twMerge(ui.body, 'col-span-3')
    ui.footer = twMerge(ui.footer, '')
  }
  return {
    root: twMerge(ui.root, props.ui?.root || ''),
    body: twMerge(ui.body, props.ui?.body || ''),
    header: twMerge(ui.header, props.ui?.header || ''),
    footer: twMerge(ui.footer, props.ui?.footer || ''),
  }
})
const avatar = computed(() => {
  if (props.person.logoUrls && props.person.logoUrls.s) {
    return {
      src: props.person?.logoUrls?.s,
      alt: props.person.name,
    }
  } else {
    return {
      src: null,
      alt: props.person.name,
    }
  }
})
const hasStatisticalInfo = computed(() => {
  if (
    props.person.collaborationIndex == '' &&
    props.person.translations == '' &&
    props.person.modulesMaintained == '' &&
    props.person.psc == ''
  ) {
    return false
  } else {
    return true
  }
})

const goToPerson = () => {
  if (props?.person?.urlKey) {
    navigateTo(`/${props.person.urlKey}`)
  }
}
</script>
