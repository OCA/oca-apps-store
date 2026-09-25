<template>
  <UPageCard
    class=""
    :ui="{
      root: 'ring-0  bg-transparent rounded-sm  h-full',
      container: 'p-2 sm:p-4',
      body: 'sm:px-0 sm:py-2 bg-transparent text-center w-full',
      header: 'sm:px-2 mb-2 w-full relative border-0 ',
      footer: 'p-0 w-full flex justify-center items-center w-full',
    }"
  >
    <template #header v-if="group.name">
      <div class="py-4 text-center">
        <UAvatar
          icon="community"
          class="mr-2 mb-0 text-secondary dark:bg-primary-700"
          size="3xl"
        />
      </div>

      <h3 class="text-center font-bold text-primary">{{ group.name }}</h3>
    </template>
    <template #body v-if="group.description">
      <div class=" ">
        <div class="align space-y-1 text-base text-gray-500 dark:text-gray-400">
          {{ group.description }}
        </div>
      </div>
    </template>
  </UPageCard>
</template>
<script setup lang="ts">
import type { Workgroup } from '~~/models'

const props = defineProps<{
  group: Workgroup
}>()
</script>
