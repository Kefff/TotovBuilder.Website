<template>
  <ContainerSummary :item="vest" />
  <ArmorSummary
    :armor-modifiers-override="armorModifiers"
    :item="vest"
    :show-empty-entries="showEmptyEntries"
    :wearable-modifiers-override="wearableModifiers"
  />
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IVest } from '../../models/item/IVest'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import ArmorSummary from './ArmorSummaryComponent.vue'
import ContainerSummary from './ContainerSummaryComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers
    item: IItem,
    showEmptyEntries?: boolean,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    showEmptyEntries: true,
    wearableModifiersOverride: undefined
  })

const armorModifiers = computed(() => props.armorModifiersOverride ?? vest.value.presetArmorModifiers)
const vest = computed(() => props.item as IVest)
const wearableModifiers = computed(() => props.wearableModifiersOverride ?? vest.value.presetWearableModifiers)
</script>