<template>
  <div
    v-tooltip.top="$t('caption.sortBy', { property: StringUtils.toLowerFirst($t(captionResource)) })"
    class="options-header-sort-button"
    @click="sortBy(property)"
  >
    <div :class="'options-header-sort-button-sort-arrow ' + sortingDirectionClass + ' ' + (sortingData.property === property ? 'options-header-sort-button-sort-arrow-visible' : '')">
      <font-awesome-icon icon="angle-down" />
    </div>
    <font-awesome-icon
      v-if="icon != null"
      :icon="icon"
      class="options-header-sort-button-icon"
    />
    <img
      v-else-if="customIcon != null"
      :src="Images[StringUtils.toCamelCase(customIcon)]"
      class="custom-icon"
    >
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import SortingData, { SortingOrder } from '../../models/utils/SortingData'
import { SortingService } from '../../services/sorting/SortingService'
import { ISortingFunctionList } from '../../services/sorting/functions/ISortingFunctionList'
import StringUtils from '../../utils/StringUtils'

const props = withDefaults(
  defineProps<{
    captionResource: string,
    customIcon?: string,
    icon?: string,
    sortingData: SortingData,
    property: string,
    sortingFunctions: ISortingFunctionList
  }>(),
  {
    customIcon: undefined,
    icon: undefined
  })

const emit = defineEmits(['update:sortingData'])

const sortingService = new SortingService(props.sortingFunctions)

const sortingDirectionClass = computed(() => props.sortingData.order === SortingOrder.asc
  ? 'options-header-sort-button-sort-arrow-down'
  : 'options-header-sort-button-sort-arrow-up')

/**
 * Emits to the parent component the updated sorting data.
 * @param property - Property.
 */
function sortBy(property: string) {
  const sortingData = sortingService.setSortingProperty(property)

  if (sortingData != null) {
    emit('update:sortingData', sortingData)
  }
}
</script>










<style scoped>
@import '../../css/icon.css';

.options-header-sort-button {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
}

.options-header-sort-button:hover {
  cursor: pointer;
}

.options-header-sort-button-icon {
  width: 1rem;
}

.options-header-sort-button-sort-arrow {
  font-size: 0.75rem;
  margin-right: 0.1rem;
  position: relative;
  top: 5px;
  visibility: hidden;
}

.options-header-sort-button-sort-arrow-down {
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  animation-name: sort-arrow-to-down;
}

.options-header-sort-button-sort-arrow-up {
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  animation-name: sort-arrow-to-up;
  transform: rotate(180deg);
}

.options-header-sort-button-sort-arrow-visible {
  visibility: visible;
}

@keyframes sort-arrow-to-up {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(180deg);
  }
}

@keyframes sort-arrow-to-down {
  0% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(0deg);
  }
}
</style>