<template>
  <ArmorSummary
    :item="armorMod"
    :show-empty-entries="showEmptyEntries"
    :wearable-modifiers-override="armorMod.presetWearableModifiers"
  />
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IItem } from '../../models/item/IItem'
import ArmorSummary from './ArmorSummaryComponent.vue'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    showEmptyEntries: true
  })

const armorMod = computed(() => props.item as IArmorMod)
</script>










<style scoped>
@import '../../css/option.css';
</style>