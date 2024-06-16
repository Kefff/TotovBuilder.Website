<template>
  <div
    v-if="isDisplayed"
    class="inventory-slot"
  >
    <Panel v-model:collapsed="modelCollapsed">
      <template #header>
        <div
          class="inventory-slot-header"
          @click="modelCollapsed = !modelCollapsed"
        >
          <div class="inventory-slot-title">
            <font-awesome-icon
              v-if="modelCollapsed"
              icon="angle-right"
              class="collapsable-icon-collapsed"
            />
            <font-awesome-icon
              v-else
              icon="angle-right"
              class="collapsable-icon-deployed"
            />
            <font-awesome-icon
              v-if="inventorySlotType.icon != null"
              :icon="inventorySlotType.icon"
              class="inventory-slot-icon"
            />
            <img
              v-else-if="inventorySlotType.customIcon != null"
              :src="Images[StringUtils.toCamelCase(inventorySlotType.customIcon)]"
              class="inventory-slot-custom-icon"
            >
            <span class="inventory-slot-caption">{{ $t('caption.slotType' + StringUtils.toUpperFirst(modelInventorySlot.typeId)) }}</span>
          </div>
          <div class="option-line">
            <Tooltip
              v-if="hasSummaryVerticalRecoil"
              :stop-click-propagation="true"
              :tooltip="$t('caption.verticalRecoil')"
            >
              <div class="inventory-slot-summary-value">
                <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, summary.recoil.verticalRecoil) }}</span>
                <font-awesome-icon
                  icon="arrows-alt-v"
                  class="icon-after-text"
                />
              </div>
            </Tooltip>
            <Tooltip
              v-if="hasSummaryHorizontalRecoil"
              :stop-click-propagation="true"
              :tooltip="$t('caption.horizontalRecoil')"
            >
              <div class="inventory-slot-summary-value">
                <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, summary.recoil.horizontalRecoil) }}</span>
                <font-awesome-icon
                  icon="arrows-alt-h"
                  class="icon-after-text"
                />
              </div>
            </Tooltip>
            <Tooltip
              v-if="hasSummaryArmor"
              :stop-click-propagation="true"
              :tooltip="$t('caption.armorClass')"
            >
              <div class="inventory-slot-summary-value">
                <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.armorClass, summary.armorModifiers.armorClass) }}</span>
                <font-awesome-icon
                  icon="award"
                  class="icon-after-text"
                />
              </div>
            </Tooltip>
            <Tooltip
              v-if="hasSummaryErgonomics"
              :stop-click-propagation="true"
              :tooltip="$t('caption.ergonomics')"
            >
              <div class="inventory-slot-summary-value">
                <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, summary.ergonomics) }}</span>
                <font-awesome-icon
                  icon="hand-paper"
                  class="icon-after-text"
                />
              </div>
            </Tooltip>
            <Tooltip
              v-if="hasSummaryErgonomicsModifierPercentage"
              :stop-click-propagation="true"
              :tooltip="$t('caption.ergonomics')"
            >
              <div class="inventory-slot-summary-value">
                <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.ergonomicsModifierPercentage)">
                  {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, summary.wearableModifiers.ergonomicsModifierPercentage) }}
                </span>
                <font-awesome-icon
                  icon="hand-paper"
                  class="icon-after-text"
                />
              </div>
            </Tooltip>
            <Tooltip
              v-if="hasSummaryMovementSpeedModifierPercentage"
              :stop-click-propagation="true"
              :tooltip="$t('caption.movementSpeed')"
            >
              <div class="inventory-slot-summary-value">
                <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.movementSpeedModifierPercentage)">
                  {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, summary.wearableModifiers.movementSpeedModifierPercentage) }}
                </span>
                <font-awesome-icon
                  icon="walking"
                  class="icon-after-text"
                />
              </div>
            </Tooltip>
            <Tooltip
              v-if="hasSummaryTurningSpeedModifierPercentage"
              :stop-click-propagation="true"
              :tooltip="$t('caption.turningSpeed')"
            >
              <div class="inventory-slot-summary-value">
                <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.turningSpeedModifierPercentage)">
                  {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, summary.wearableModifiers.turningSpeedModifierPercentage) }}
                </span>
                <font-awesome-icon
                  icon="undo"
                  class="icon-after-text"
                />
              </div>
            </Tooltip>
            <div class="option-entry inventory-slot-summary-price">
              <InventoryPrice
                :inventory-price="summary.price"
                :is-build="false"
              />
            </div>
            <Tooltip
              v-if="hasSummaryWeight"
              :stop-click-propagation="true"
              :tooltip="$t('caption.weight')"
            >
              <div
                v-if="hasSummaryWeight"
                class="inventory-slot-weight"
              >
                <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, summary.weight) }}</span>
                <font-awesome-icon
                  icon="weight-hanging"
                  class="icon-after-text"
                />
              </div>
            </Tooltip>
          </div>
        </div>
      </template>
      <InventorySlotItem
        v-for="(inventoryItem, index) of modelInventorySlot.items"
        :key="`${path}_${index}`"
        :accepted-items-category-id="acceptedItemsCategoryId"
        :accepted-items="acceptedItems"
        :can-be-looted="inventorySlotType.canBeLooted"
        :inventory-item="modelInventorySlot.items[index]"
        :inventory-slot-type-id="modelInventorySlot.typeId"
        :path="`${path}_${index}`"
        @update:inventory-item="onItemChanged(index, $event)"
      />
    </Panel>
  </div>
</template>










<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, Ref, ref } from 'vue'
import Images from '../images'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { IItem } from '../models/item/IItem'
import { IInventorySlotSummary } from '../models/utils/IInventorySlotSummary'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { InventorySlotPropertiesService } from '../services/InventorySlotPropertiesService'
import { InventorySlotService } from '../services/InventorySlotService'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import StringUtils from '../utils/StringUtils'
import InventoryPrice from './InventoryPriceComponent.vue'
import InventorySlotItem from './InventorySlotItemComponent.vue'

const globalFilterService = Services.get(GlobalFilterService)
const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
const inventorySlotService = Services.get(InventorySlotService)

const modelCollapsed = defineModel<boolean>('collapsed')
const modelInventorySlot = defineModel<IInventorySlot>('inventorySlot', { required: true })

defineProps<{ path: string }>()

const editing = inject<Ref<boolean>>('editing')

const acceptedItemsCategoryId = ref<string>()
const acceptedItems = ref<IItem[]>([])
const summary = ref<IInventorySlotSummary>({
  armorModifiers: {
    armorClass: 0,
    durability: 0
  },
  ergonomics: 0,
  price: {
    missingPrice: false,
    priceInMainCurrency: 0,
    priceByCurrency: []
  },
  recoil: {
    horizontalRecoil: 0,
    verticalRecoil: 0
  },
  type: {
    acceptedItemCategories: [],
    canBeLooted: false,
    displayOrder: 0,
    id: '',
    itemSlotsAmount: 0
  },
  wearableModifiers: {
    ergonomicsModifierPercentage: 0,
    movementSpeedModifierPercentage: 0,
    turningSpeedModifierPercentage: 0
  },
  weight: 0
})

const hasSummaryArmor = computed(() => summary.value.armorModifiers.armorClass !== 0)
const hasSummaryErgonomics = computed(() => summary.value.ergonomics !== 0)
const hasSummaryErgonomicsModifierPercentage = computed(() => summary.value.wearableModifiers.ergonomicsModifierPercentage !== 0)
const hasSummaryHorizontalRecoil = computed(() => summary.value.recoil.horizontalRecoil !== 0)
const hasSummaryMovementSpeedModifierPercentage = computed(() => summary.value.wearableModifiers.movementSpeedModifierPercentage !== 0)
const hasSummaryTurningSpeedModifierPercentage = computed(() => summary.value.wearableModifiers.turningSpeedModifierPercentage !== 0)
const hasSummaryVerticalRecoil = computed(() => summary.value.recoil.verticalRecoil !== 0)
const hasSummaryWeight = computed(() => summary.value.weight !== 0)
const inventorySlotType = computed(() => inventorySlotService.getType(modelInventorySlot.value.typeId))
const isDisplayed = computed(() => editing?.value || modelInventorySlot.value.items.some((i) => i != null)) // Displayed only when in edit mode or when it contains at least one item

onMounted(() => {
  globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  setSummary()
  setAcceptedItems()
})

onUnmounted(() => {
  globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
})

/**
 * Updates the inventory slot summary to reflect price changes due to the change in merchant filters.
 */
function onMerchantFilterChanged() {
  setSummary()
  setAcceptedItems()
}

/**
 * Signals to the build one of its inventory slots has changed.
 */
function onItemChanged(index: number, newInventoryItem: IInventoryItem | undefined) {
  const newInventorySlot = { ...modelInventorySlot.value }
  newInventorySlot.items[index] = newInventoryItem
  modelInventorySlot.value = newInventorySlot

  setSummary()
}

/**
 * Sets the accepted items selectable by the user.
 */
async function setAcceptedItems() {
  acceptedItemsCategoryId.value = inventorySlotType.value.acceptedItemCategories.length === 1
    ? inventorySlotType.value.acceptedItemCategories[0]
    : undefined
  acceptedItems.value = await Services.get(ItemService).getItemsOfCategories(inventorySlotType.value.acceptedItemCategories, true)
}

/**
 * Gets the values of the summary of the content of the inventory slot.
 */
async function setSummary() {
  summary.value = await inventorySlotPropertiesService.getSummary(modelInventorySlot.value)
}
</script>










<style scoped>
@import '../css/collapsable.css';
@import '../css/icon.css';
@import '../css/option.css';
@import '../css/stats.css';

.inventory-slot {
  margin-bottom: 1rem;
}

.inventory-slot:last-child {
  margin-bottom: 0;
}

.inventory-slot-caption {
  margin-left: 0.5rem;
}

.inventory-slot-custom-icon {
  width: 1.75rem;
  margin-left: 1rem;
}

.inventory-slot-header {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 1.35rem;
  width: 100%;
}

.inventory-slot-icon {
  font-size: 1.75rem;
  margin-left: 1rem;
  margin-right: 0.5rem;
}

.inventory-slot-item-caption {
  font-size: 1rem;
  margin-left: 2rem;
  max-width: 25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.inventory-slot-summary-price {
  margin-left: auto;
  margin-right: 3rem;
  /* Space to align the price with the children prices that have the merchant icon */
  padding-left: 1rem;
}

.inventory-slot-summary-value {
  margin-left: 2rem;
}

.inventory-slot-title {
  align-items: center;
  display: flex;
  white-space: nowrap;
}

.inventory-slot-weight {
  margin-left: 1rem;
  text-align: right;
  width: 7rem;
}
</style>