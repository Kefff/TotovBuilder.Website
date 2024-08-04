<template>
  <div class="options-header-sort-button">
    <Tooltip :tooltip="$t('caption.sortBy', { property: StringUtils.toLowerFirst($t(captionResource)) })">
      <div
        class="options-header-sort-button-group"
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
        <CustomIcon
          v-else-if="customIcon != null"
          :icon="Images[StringUtils.toCamelCase(customIcon)]"
          position="after"
        />
      </div>
    </Tooltip>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IItem } from '../../models/item/IItem'
import SortingData from '../../models/utils/SortingData'
import { SortingOrder } from '../../models/utils/SortingOrder'
import Services from '../../services/repository/Services'
import { SortingService } from '../../services/sorting/SortingService'
import { ISortingFunctionList } from '../../services/sorting/functions/SortingFunctionList'
import StringUtils from '../../utils/StringUtils'
import CustomIcon from '../CustomIconComponent.vue'

const modelSortingData = defineModel<SortingData<IItem>>('sortingData', { required: true })

const props = withDefaults(
  defineProps<{
    captionResource: string,
    customIcon?: string,
    icon?: string,
    property: string,
    sortingFunctions: ISortingFunctionList<IItem>
  }>(),
  {
    customIcon: undefined,
    icon: undefined
  })

const sortingDirectionClass = computed(() => modelSortingData.value.order === SortingOrder.asc
  ? 'options-header-sort-button-sort-arrow-down'
  : 'options-header-sort-button-sort-arrow-up')

/**
 * Signals to the parent options header that sorting data has changed.
 * @param property - Property.
 */
function sortBy(property: string) {
  const sortingData = Services.get(SortingService).setSortingProperty(modelSortingData.value, props.sortingFunctions, property)
  modelSortingData.value = sortingData
}
</script>










<style scoped>
@import '../../css/icon.css';

.options-header-sort-button {
  align-items: center;
  display: flex;
  justify-content: flex-end;
}

.options-header-sort-button-group {
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
}

.options-header-sort-button-group:hover {
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