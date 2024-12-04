<script setup lang="ts">
import { computed } from 'vue'
import { IBackpack } from '../../models/item/IBackpack'
import { IItem } from '../../models/item/IItem'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import ContainerItemCard from './ContainerItemCardComponent.vue'
import WearableItemCard from './WearableItemCardComponent.vue'

const props = withDefaults(
  defineProps<{
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    wearableModifiersOverride: undefined
  })

const backpack = computed(() => props.item as IBackpack)
const wearableModifiers = computed(() => props.wearableModifiersOverride ?? backpack.value.presetWearableModifiers)
</script>










<template>
  <ContainerItemCard :item="backpack" />
  <WearableItemCard
    :item="backpack"
    :wearable-modifiers-override="wearableModifiers"
  />
</template>