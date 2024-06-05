<template>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.capacity')"
      class="option-value"
    >
      <span>{{ container.capacity }}</span>
      <font-awesome-icon
        icon="box-open"
        class="icon-after-text"
      />
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IContainer } from '../../models/item/IContainer'
import { IItem } from '../../models/item/IItem'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    showEmptyEntries: true
  })

const container = computed(() => props.item as IContainer)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';
</style>