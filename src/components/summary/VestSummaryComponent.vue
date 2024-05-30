<template>
  <ContainerSummary :item="vest" />
  <ArmorSummary
    :armor-modifiers-override="armorModifiersOverride"
    :item="vest"
    :show-empty-entries="showEmptyEntries"
  />
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IVest } from '../../models/item/IVest'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import ArmorSummary from './ArmorSummaryComponent.vue'
import ContainerSummary from './ContainerSummaryComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    armorModifiersOverride: undefined,
    showEmptyEntries: true
  })

const vest = computed(() => props.item as IVest)
</script>