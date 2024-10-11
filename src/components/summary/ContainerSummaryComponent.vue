<script setup lang="ts">
import { computed } from 'vue'
import { IContainer } from '../../models/item/IContainer'
import { IItem } from '../../models/item/IItem'
import Tooltip from '../TooltipComponent.vue'

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










<template>
  <div class="option-entry">
    <div class="option-value">
      <Tooltip :tooltip="$t('caption.capacity')">
        <font-awesome-icon
          icon="box-open"
          class="icon-before-text"
        />
        <span>{{ container.capacity }}</span>
      </Tooltip>
    </div>
  </div>
</template>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';
</style>