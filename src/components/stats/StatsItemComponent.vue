<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IModdable } from '../../models/item/IModdable'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import ItemIcon from '../ItemIconComponent.vue'
import Tooltip from '../TooltipComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const _globalSidebarService = Services.get(GlobalSidebarService)
const _itemPropertiesService = Services.get(ItemPropertiesService)

const itemIsModdable = computed(() => _itemPropertiesService.isModdable(props.item))
const modSlotsCount = computed(() => itemIsModdable.value ? (props.item as IModdable).modSlots.length : 0)

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
  <div class="stats-item">
    <div class="stats-item-stats-header">
      <ItemIcon :item="item" />
      <div class="stats-item-stats-title">
        <span>{{ item.name }}</span>
        <div class="stats-item-stats-details-button">
          <Button
            class="p-button-sm"
            outlined
            @click="showDetails(item)"
          >
            <Tooltip
              v-if="item != null"
              :apply-hover-style="false"
              :disabled-on-mobile="true"
              :tooltip="modSlotsCount > 0 ? $t('caption.showDetailsWithModSlotsCount', { modSlotsCount }) : $t('caption.showDetails')"
            >
              <div class="stats-item-stats-details-button-content">
                <font-awesome-icon icon="clipboard-list" />
                <span v-if="modSlotsCount > 0">{{ modSlotsCount }}</span>
                <font-awesome-icon
                  v-if="modSlotsCount > 0"
                  icon="puzzle-piece"
                />
              </div>
            </Tooltip>
          </Button>
        </div>
      </div>
    </div>
    <div class="stats-item-stats-line">
      <div class="card-line stats-item-stats-weight">
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
</template>










<style scoped>
.stats-item {
  align-items: flex-start;
  border-color: var(--primary-color6);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  display: flex;
  flex-direction: column;
  padding: 0.25rem;
}

.stats-item-stats-details-button {
  align-self: flex-start;
  margin-left: auto;
}

.stats-item-stats-details-button-content {
  display: flex;
  gap: 0.25rem
}

.stats-item-stats-title {
  align-items: center;
  display: flex;
  gap: 0.25rem;
  margin-bottom: auto;
  width: 100%;
}

.stats-item-stats-header {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.stats-item-stats-line {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr 4fr;
  width: 100%;
}

.stats-item-stats-mod-slots-button {
  display: flex;
  gap: 0.25rem;
}

.stats-item-stats-weight {
  align-items: flex-start;
}
</style>