<template>
  <div class="flex flex-col gap-5 pb-6">
    <div
      v-for="(item, index) in info"
      :key="item.label"
      class="flex flex-wrap items-center gap-2"
    >
      <UAvatar :icon="item.icon" />
      <div class="flex-1">
        <div class="text-sm font-bold">
          {{ item.label }}
        </div>
        <div class="text-sm">
          <span v-if="item?.authors">
            <template
              v-for="(author, authorIndex) in item.authors"
              :key="author.urlKey"
            >
              <NuxtLink
                v-if="author.urlKey"
                :to="`/${author.urlKey}`"
                class="text-primary hover:underline"
              >
                {{ author.name }}
              </NuxtLink>
              <span v-else>
                {{ author.name }}
              </span>
              <span v-if="authorIndex < item.authors.length - 1">{{ ', ' }}</span>
            </template>
          </span>
          <a
            v-else-if="item?.link"
            :href="item.link"
            target="_blank"
            class="flex items-center gap-1 text-primary hover:underline"
          >
            {{ item.value }}
            <UIcon name="external" />
          </a>
          <span v-else>
            {{ item.value }}
          </span>
        </div>
      </div>
      <ModuleRunboat
        v-if="index == 0 && module"
        :module="module"
        size="sm"
        class="flex-1 items-end justify-end"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { type Module, type ModuleAuthor } from '~~/models'

const props = defineProps<{
  module: Module
}>()
const { t } = useI18n()
const info = computed(() => {
  const info: {
    label: string
    icon: string
    value?: string
    link?: string
    authors?: ModuleAuthor[]
  }[] = [
    {
      label: t('modules.technical_name'),
      value: props.module?.techname,
      icon: 'module',
    },
  ]
  if (props.module?.repository?.name) {
    info.push({
      label: t('modules.repository.name'),
      value: props.module.repository.name,
      link: props.module.repository.url,
      icon: 'repository',
    })
  }
  if (props.module?.authors && props.module?.authors.length > 0) {
    info.push({
      label: t('modules.author.name'),
      authors: props.module.authors,
      icon: 'author',
    })
  }
  return info
})
</script>
