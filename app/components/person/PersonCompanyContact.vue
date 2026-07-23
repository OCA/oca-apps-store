<template>
  <UCard
    reverse
    class=""
    :ui="{
      root: 'ring-0 md:mt-6 bg-muted shadow-md p-4 px-10',
      body: 'bg-transparent',
      header: 'p-0 relative',
      footer: 'flex justify-center',
    }"
  >
    <template #default>
      <div class="p-4">
        <div class="space-y-2">
          <div v-if="person.contact && person.contact.address" class="flex items-center gap-2">
            <UIcon name="location" class="text-gray-500" />
            <div>
              <p class="text-sm font-medium">
                {{ person.contact.address }}
              </p>
              <p v-if="person.contact.city" class="text-sm text-gray-500">
                {{ person.contact.city }}
              </p>
            </div>
          </div>
          <div
            v-if="person.contact && person.contact.phone"
            class="flex items-center gap-2"
          >
            <UIcon name="phone" class="text-gray-500" />
            <p class="text-sm">{{ person.contact.phone }}</p>
          </div>
          <div
            v-if="person.contact && person.contact.website"
            class="flex items-center gap-2"
          >
            <UIcon name="website" class="text-gray-500" />
            <ULink
              v-if="person.contact.website"
              :to="person.contact.website"
              target="_blank"
              class="text-sm hover:underline text-blue-500"
            >
              {{ person.contact.website }}
            </ULink>
          </div>
          <div
            v-if="person.contact && person.contact.email"
            class="flex items-center gap-2"
          >
         
            <UIcon name="email" class="text-gray-500" />
            <ULink
              v-if="person.contact.email"
              :to="`mailto:${person.contact.email}`"
              target="_blank"
              class="text-sm text-blue-500 hover:underline"
            >
              {{ person.contact.email }}
            </ULink>
          </div>
        </div>
      </div>
    </template>
    <template v-if="person.contact && person.contact.email" #footer >
      <UButton
        :to="`mailto:${person.contact.email}`"
        color="primary"
        variant="solid"
        class="mt-4 mx-auto px-6"
        icon="email"
        :label="t('person.contact.sendEmail')"
      />
    </template>
  </UCard>
</template>
<script setup lang="ts">

const { t } = useI18n()
const props = defineProps({
  person: {
    type: Object,
    required: true,
  },
})
</script>
