<script setup lang="ts">
import { computed } from 'vue'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import ArmorItemCard from './ArmorItemCardComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    wearableModifiersOverride: undefined
  })

const armorMod = computed(() => props.item as IArmorMod)
const armorModifiers = computed(() => props.armorModifiersOverride ?? armorMod.value.presetArmorModifiers)
const wearableModifiers = computed(() => props.wearableModifiersOverride ?? armorMod.value.presetWearableModifiers)
</script>










<template>
  <ArmorItemCard
    :armor-modifiers-override="armorModifiers"
    :item="armorMod"
    :wearable-modifiers-override="wearableModifiers"
  />
</template>