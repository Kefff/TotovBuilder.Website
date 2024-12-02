<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import SortingData from '../../models/utils/SortingData'
import { ItemSortingFunctions } from '../../services/sorting/functions/ItemSortingFunctions'
import InputTextField from '../InputTextFieldComponent.vue'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelFilter = defineModel<string>('filter', { required: true })
const modelSortingData = defineModel<SortingData<IItem>>('sortingData', { required: true })

withDefaults(
  defineProps<{
    useLongestHeaderWidth: boolean
  }>(),
  {
    useLongestHeaderWidth: false
  })

const _filterDelay = 500 // Milliseconds passed without typing before emitting the filter update
let _filterLastEdit = new Date()


const filterInternal = computed({
  get: () => modelFilter.value,
  set: (value: string) => onFilterChanged(value)
})

/**
 * Reacts to the user filling the filter input.
 *
 * Emits to the parent component the filter to use to filter options.
 */
function onFilterChanged(filterValue: string): void {
  _filterLastEdit = new Date()

  // Creating a promise that will check after a delay if the filter has changed.
  // If not, emits the filter to the parent component; otherwise silently rejects the promise.
  new Promise<void>((resolve, reject) => setTimeout(
    () => {
      const now = new Date()
      const timeSinceLastInput = now.getTime() - _filterLastEdit.getTime()

      if (timeSinceLastInput >= _filterDelay) {
        resolve()
      } else {
        reject()
      }
    },
    _filterDelay))
    .then(() => modelFilter.value = filterValue)
    .catch(() => undefined)
}
</script>










<template>
  <div class="option-line item-option-header">
    <div class="option-entry">
      <div class="option-caption">
        <InputTextField
          v-model:value="filterInternal"
          :autofocus="true"
          :caption="$t('caption.search')"
          caption-mode="placeholder"
          class="item-option-header-filter-input"
        />
        <OptionHeaderSortButton
          v-model:sorting-data="modelSortingData"
          caption-resource="caption.name"
          icon="font"
          property="name"
          :sorting-functions="ItemSortingFunctions"
        />
      </div>
    </div>
    <div class="option-entry">
      <div class="option-value-long">
        <OptionHeaderSortButton
          v-model:sorting-data="modelSortingData"
          caption-resource="caption.price"
          icon="coins"
          property="price"
          :sorting-functions="ItemSortingFunctions"
        />
      </div>
    </div>
    <div class="option-entry">
      <div class="option-value">
        <OptionHeaderSortButton
          v-model:sorting-data="modelSortingData"
          caption-resource="caption.weight"
          icon="weight-hanging"
          property="weight"
          :sorting-functions="ItemSortingFunctions"
        />
      </div>
    </div>
    <slot />
    <div
      v-if="useLongestHeaderWidth"
      class="item-option-header-longest-header-width-placeholder"
    />
    <div class="item-option-header-icon-placeholder" />
  </div>
</template>










<style scoped>
.item-option-header {
  border-bottom-color: var(--util-color);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  padding: 1rem;
}

.item-option-header-filter-input {
  margin-right: 0.5rem;
  width: 100%;
}

.item-option-header-icon-placeholder {
  width: 5.525rem;
  /* Width of the longest weapons displayed in summaries */
}

.item-option-header-longest-header-width-placeholder {
  width: 41.25rem;
  /* Ammunition options header width : 5 * 6rem of value + 11.25rem of penetrations  */
}

.option-caption {
  display: flex;
  justify-content: flex-end;
}
</style>