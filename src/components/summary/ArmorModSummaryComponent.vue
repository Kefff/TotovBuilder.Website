<template>
  <ArmorSummary
    :armor-modifiers-override="armorModifiers"
    :item="armorMod"
    :show-empty-entries="showEmptyEntries"
    :wearable-modifiers-override="wearableModifiers"
  />
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import ArmorSummary from './ArmorSummaryComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    item: IItem,
    showEmptyEntries?: boolean,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    showEmptyEntries: true,
    wearableModifiersOverride: undefined
  })

const armorMod = computed(() => props.item as IArmorMod)
const armorModifiers = computed(() => props.armorModifiersOverride ?? armorMod.value.presetArmorModifiers)
const wearableModifiers = computed(() => props.wearableModifiersOverride ?? armorMod.value.presetWearableModifiers)
</script>










<style scoped>
@import '../../css/option.css';
</style>