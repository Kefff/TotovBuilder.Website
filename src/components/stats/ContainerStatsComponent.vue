<script setup lang="ts">
import { computed } from 'vue'
import { IContainer } from '../../models/item/IContainer'
import { IItem } from '../../models/item/IItem'

const props = defineProps<{
  item: IItem
}>()

const container = computed(() => props.item as IContainer)
</script>










<template>
  <div
    v-if="container.capacity > 0"
    class="stats-category"
  >
    {{ $t('caption.content') }}
  </div>
  <div
    v-if="container.capacity > 0"
    class="stats-line"
  >
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="box-open"
          class="icon-before-text"
        />
        <span>{{ $t('caption.capacity') }} :</span>
      </div>
      <div class="stats-value">
        {{ container.capacity }}
      </div>
    </div>
  </div>
</template>