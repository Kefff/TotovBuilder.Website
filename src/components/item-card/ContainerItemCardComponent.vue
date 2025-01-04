<script setup lang="ts">
import { computed } from 'vue'
import { IContainer } from '../../models/item/IContainer'
import { IItem } from '../../models/item/IItem'
import Tooltip from '../TooltipComponent.vue'

const props = defineProps<{ item: IItem }>()

const container = computed(() => props.item as IContainer)
</script>










<template>
  <div class="card-line card-line4">
    <Tooltip
      :tooltip="$t('caption.capacity')"
      class="card-value"
    >
      <font-awesome-icon
        icon="box-open"
        class="icon-before-text"
      />
      <span>{{ container.capacity }}</span>
    </Tooltip>
  </div>
</template>