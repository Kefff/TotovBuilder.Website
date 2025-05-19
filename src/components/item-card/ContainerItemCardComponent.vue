<script setup lang="ts">
import { computed } from 'vue'
import { IContainer } from '../../models/item/IContainer'
import { IItem } from '../../models/item/IItem'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import ContainerItemCardInternal from './ContainerItemCardInternalComponent.vue'

const props = withDefaults(
  defineProps<{
    comparisonItem?: IItem,
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem
  }>(),
  {
    comparisonItem: undefined,
    filterAndSortingData: undefined
  })

const comparisonContainer = computed(() => props.comparisonItem as IContainer)
const container = computed(() => props.item as IContainer)

const { isSmartphonePortrait } = WebBrowserUtils.getScreenSize()
</script>










<template>
  <div
    class="card-line"
    :class="{
      'card-line3': isSmartphonePortrait,
      'card-line4': !isSmartphonePortrait
    }"
  >
    <ContainerItemCardInternal
      :comparison-item="comparisonContainer"
      :filter-and-sorting-data="filterAndSortingData"
      :container="container"
    />
  </div>
</template>