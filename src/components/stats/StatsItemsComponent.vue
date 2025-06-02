<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
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
      <ItemIcon
        :item="item"
        class="stats-items-item-icon"
      />
      <div class="stats-items-item-stats">
        <div class="stats-items-item-stats-header">
          <span>{{ item.name }}</span>
          <Tooltip
            v-if="item != null"
            class="stats-items-item-stats-header-details-button"
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
  padding: 0.25rem;
}

.stats-items-item-icon {
  margin-right: 0.25rem;
}

.stats-items-item-stats {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.stats-items-item-stats-header {
  align-items: center;
  display: flex;
  gap: 0.25rem;
}

.stats-items-item-stats-header-details-button {
  margin-left: auto;
}
</style>