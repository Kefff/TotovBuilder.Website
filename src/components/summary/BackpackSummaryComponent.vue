<script setup lang="ts">
import { computed } from 'vue'
import { IBackpack } from '../../models/item/IBackpack'
import { IItem } from '../../models/item/IItem'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import ContainerSummary from './ContainerSummaryComponent.vue'
import WearableSummary from './WearableSummaryComponent.vue'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    showEmptyEntries: true,
    wearableModifiersOverride: undefined
  })

const backpack = computed(() => props.item as IBackpack)
const wearableModifiers = computed(() => props.wearableModifiersOverride ?? backpack.value.presetWearableModifiers)
</script>










<template>
  <ContainerSummary :item="backpack" />
  <WearableSummary
    :item="backpack"
    :show-empty-entries="showEmptyEntries"
    :wearable-modifiers-override="wearableModifiers"
  />
</template>