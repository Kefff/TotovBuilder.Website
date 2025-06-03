<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import StringUtils from '../../utils/StringUtils'
import ItemIcon from '../ItemIconComponent.vue'
import Tooltip from '../TooltipComponent.vue'

const props = defineProps<{
  caption: string,
  items: IItem[]
}>()

const _globalSidebarService = Services.get(GlobalSidebarService)

const itemsInternal = computed(() => [...props.items].sort((i1, i2) => StringUtils.compare(i1.name, i2.name)))

/**
 * Displays the statistics of an item.
 * @param item - Item.
 */
function showDetails(item: IItem): void {
  _globalSidebarService.display({
    displayedComponentType: 'StatsSidebar',
    displayedComponentParameters: item
  })
}
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
    <div
      v-for="(item) of itemsInternal"
      :key="item.id"
      class="stats-items-item"
    >
      <div class="stats-items-item-stats-header">
        <ItemIcon :item="item" />
        <div class="stats-items-item-stats-title">
          <span>{{ item.name }}</span>
          <Tooltip
            v-if="item != null"
            class="stats-items-item-stats-details-button"
            :apply-hover-style="false"
            :disabled-on-mobile="true"
            :tooltip="$t('caption.showDetails')"
          >
            <Button
              class="p-button-sm"
              outlined
              @click="showDetails(item)"
            >
              <font-awesome-icon icon="clipboard-list" />
            </Button>
          </Tooltip>
        </div>
      </div>
      <div class="stats-items-item-stats-line">
        <div class="card-line stats-items-item-stats-weight">
          <Tooltip :tooltip="$t('caption.weight')">
            <div class="card-value">
              <div>
                <font-awesome-icon
                  icon="weight-hanging"
                  class="icon-before-text"
                />
                <span>
                  {{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, item.weight) }}
                </span>
              </div>
            </div>
          </Tooltip>
        </div>
        <slot
          name="specializedStats"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>










<style scoped>
.stats-items {
  gap: 1rem;
  margin-top: 0.5rem;
}

.stats-items-item {
  align-items: flex-start;
  border-color: var(--primary-color6);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  display: flex;
  flex-direction: column;
  padding: 0.25rem;
}

.stats-items-item-stats-details-button {
  align-self: flex-start;
  margin-left: auto;
}

.stats-items-item-stats-title {
  align-items: center;
  display: flex;
  gap: 0.25rem;
  margin-bottom: auto;
  width: 100%;
}

.stats-items-item-stats-header {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.stats-items-item-stats-line {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr 4fr;
  width: 100%;
}

.stats-items-item-stats-weight {
  align-items: flex-start;
}
</style>