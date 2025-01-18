<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IVest } from '../../models/item/IVest'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import ArmorItemCard from './ArmorItemCardComponent.vue'
import ContainerItemCard from './ContainerItemCardComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    displayEmptyLines?: boolean,
    includeModsAndContent?: boolean,
    isBaseItem?: boolean,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    displayEmptyLines: true,
    includeModsAndContent: false,
    isBaseItem: false,
    wearableModifiersOverride: undefined
  })

const armorModifiers = computed(() => props.armorModifiersOverride ?? vest.value.presetArmorModifiers)
const vest = computed(() => props.item as IVest)
const wearableModifiers = computed(() => props.wearableModifiersOverride ?? vest.value.presetWearableModifiers)
</script>










<template>
  <ArmorItemCard
    :armor-modifiers-override="armorModifiers"
    :display-empty-lines="displayEmptyLines"
    :include-mods-and-content="includeModsAndContent"
    :item="vest"
    :wearable-modifiers-override="wearableModifiers"
  >
    <template #slot>
      <ContainerItemCard
        v-if="!isBaseItem"
        :item="vest"
      />
    </template>
  </ArmorItemCard>
</template>