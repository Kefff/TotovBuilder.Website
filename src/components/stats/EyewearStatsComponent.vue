<script setup lang="ts">
import { computed } from 'vue'
import { IEyewear } from '../../models/item/IEyewear'
import { IItem } from '../../models/item/IItem'
import ArmorStats from './ArmorStatsComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const eyewear = computed(() => props.item as IEyewear)
</script>










<template>
  <ArmorStats :item="eyewear" />
</template>