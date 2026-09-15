<template>
  <div class="flex w-full justify-start gap-6 md:justify-start md:gap-22">
    <div
      v-if="company.membersCount"
      class="justify-tart flex flex-col items-center max-md:items-start gap-2 md:flex-row"
    >
      <div class="flex items-center gap-1 text-xl text-secondary-500">
        {{ company.membersCount }}
      </div>
      <div class="max-md:text-xs">
        {{ $t('company.stats.members') }}
      </div>
    </div>
    <div
      v-if="company.contributorsCount"
      class="flex flex-col items-center max-md:items-start justify-start gap-2 md:flex-row"
    >
      <div class="flex items-center gap-1 text-xl text-secondary-500">
        {{ company.contributorsCount }}
      </div>
      <div class="max-md:text-xs">
        {{ $t('company.stats.contributors') }}
      </div>
    </div>
    <div
      v-if="company.modulesCount"
      class="flex flex-col items-center max-md:items-start justify-start gap-2 md:flex-row"
    >
      <div class="flex items-center gap-1 text-xl text-secondary-500">
        {{ company.modulesCount }}
      </div>
      <div class="max-md:text-xs">
        <UTooltip :text="$t('company.stats.modules_tooltip')" :delay-duration="0">
          <UButton variant="link" class="text-md">{{ $t('company.stats.modules') }}*</UButton>
        </UTooltip>
        
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Company } from '~~/models'
const props = defineProps<{
  company: Company
}>()
const statistics = computed(() => {
  return [
    { label: 'Members', value: props.company.membersCount },
    { label: 'Contributors', value: props.company.contributorsCount },
    { label: 'Modules', value: props.company.modulesCount },
  ]
})
</script>
