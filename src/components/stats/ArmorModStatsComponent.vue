<script setup lang="ts">
import { computed } from 'vue'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IItem } from '../../models/item/IItem'
import ArmorStats from './ArmorStatsComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const armorMod = computed(() => props.item as IArmorMod)
</script>










<template>
  <ArmorStats :item="armorMod" />
</template>