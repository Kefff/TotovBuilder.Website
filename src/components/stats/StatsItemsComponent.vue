<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import StringUtils from '../../utils/StringUtils'
import StatsItem from './StatsItemComponent.vue'

const props = defineProps<{
  caption: string,
  items: IItem[]
}>()

const itemsInternal = computed(() => [...props.items].sort((i1, i2) => StringUtils.compare(i1.name, i2.name)))
</script>










<template>
  <div
    v-if="itemsInternal.length > 0"
    class="stats-category"
  >
    {{ caption }}
  </div>
  <div
    v-if="itemsInternal.length > 0"
    class="stats-items stats-line"
  >
    <StatsItem
      v-for="(item) of itemsInternal"
      :key="item.id"
      :item="item"
    >
      <template #specializedStats>
        <slot
          name="specializedStats"
          :item="item"
        />
      </template>
    </StatsItem>
  </div>
</template>










<style scoped>
.stats-items {
  gap: 1rem;
  margin-top: 0.5rem;
}
</style>