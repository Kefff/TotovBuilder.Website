<template>
  <div class="option-line item-option-header">
    <div class="option-entry">
      <div class="option-caption">
        <InputText
          ref="filterInput"
          v-model="filterInternal"
          class="item-option-header-filter-input"
          :placeholder="$t('caption.search')"
          type="text"
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
    <slot />
    <div
      v-if="useLongestHeaderWidth"
      class="item-option-header-longest-header-width-placeholder"
    />
    <div class="item-option-header-icon-placeholder" />
  </div>
</template>










<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ItemSortingData from '../../models/utils/ItemSortingData'
import { ItemSortingFunctions } from '../../services/sorting/functions/ItemSortingFunction'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelFilter = defineModel<string>('filter', { required: true })
const modelSortingData = defineModel<ItemSortingData>('sortingData', { required: true })

withDefaults(
  defineProps<{
    useLongestHeaderWidth: boolean
  }>(),
  {
    useLongestHeaderWidth: false
  })

let filterLastEdit = new Date()
const filterDelay = 500 // Milliseconds passed without typing before emitting the filter update

const filterInternal = computed({
  get: () => modelFilter.value,
  set: (value: string) => onFilterChanged(value)
})

const filterInput = ref()

onMounted(() => {
  // Focus the filter input to be able to type the name of the item.
  // This conflicts with the PrimeVue as it prevents the automatic scrolling to the selected item.
  // However this is not a problem because the PrimeVue behavior is not always working
  // and a workaround has been made.
  filterInput.value.$el.select()
})

/**
 * Reacts to the user filling the filter input.
 *
 * Emits to the parent component the filter to use to filter options.
 */
function onFilterChanged(filterValue: string) {
  filterLastEdit = new Date()

  // Creating a promise that will check after a delay if the filter has changed.
  // If not, emits the filter to the parent component; otherwise silently rejects the promise.
  new Promise<void>((resolve, reject) => setTimeout(
    () => {
      const now = new Date()
      const timeSinceLastInput = now.getTime() - filterLastEdit.getTime()

      if (timeSinceLastInput >= filterDelay) {
        resolve()
      } else {
        reject()
      }
    },
    filterDelay))
    .then(() => modelFilter.value = filterValue)
    .catch(() => undefined)
}
</script>










<style scoped>
@import '../../css/option.css';

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