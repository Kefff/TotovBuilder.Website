<template>
  <ContainerSummary :item="backpack" />
  <WearableSummary
    :item="backpack"
    :show-empty-entries="showEmptyEntries"
  />
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IBackpack } from '../../models/item/IBackpack'
import { IItem } from '../../models/item/IItem'
import ContainerSummary from './ContainerSummaryComponent.vue'
import WearableSummary from './WearableSummaryComponent.vue'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    showEmptyEntries: true
  })

const backpack = computed(() => props.item as IBackpack)
</script>