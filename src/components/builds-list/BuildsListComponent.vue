<template>
  <div class="builds-list">
    <Card
      v-for="(buildSummary, index) of buildSummaries"
      :key="buildSummary.id"
      class="builds-list-card"
    >
      <template #title>
        <div class="builds-list-card-title">
          <div>{{ buildSummary.name }}</div>
          <Tooltip
            v-if="showNotExported && !buildSummary.exported"
            :tooltip="getNotExportedTooltip(buildSummary)"
          >
            <font-awesome-icon
              class="builds-list-not-exported"
              icon="exclamation-triangle"
            />
          </Tooltip>
        </div>
      </template>
      <template #content>
        <div class="builds-list-card-items">
          <div
            v-for="buildItemInInventorySlot of buildsItemsInInventorySlot[index]"
            :key="buildItemInInventorySlot.inventorySlotId"
          >
            <div>
              <Tooltip :tooltip="buildItemInInventorySlot.item.name">
                <ItemIcon
                  :item="buildItemInInventorySlot.item"
                  :quantity="buildItemInInventorySlot.quantity"
                />
              </Tooltip>
            </div>
          </div>
        </div>
        <div
          v-if="buildSummary.price.priceInMainCurrency > 0 || buildSummary.weight != 0"
          class="builds-list-card-stats"
        >
          <div v-if="buildSummary.weight != 0">
            <Tooltip :tooltip="$t('caption.weight')">
              <font-awesome-icon
                icon="weight-hanging"
                class="icon-before-text"
              />
              <span :class="StatsUtils.getWeightColorClass(buildSummary.weight)">
                {{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, buildSummary.weight) }}
              </span>
            </Tooltip>
          </div>
          <div
            v-if="buildSummary.price.priceInMainCurrency > 0"
            class="builds-list-card-price"
          >
            <InventoryPrice
              :inventory-price="buildSummary.price"
              :is-build="true"
            />
          </div>
        </div>
        <div
          v-if="buildSummary.recoil.verticalRecoil !== 0 || buildSummary.recoil.horizontalRecoil !== 0 || buildSummary.ergonomics !== 0 || buildSummary.wearableModifiers.ergonomicsModifierPercentage !== 0"
          class="builds-list-card-stats"
        >
          <div v-if="buildSummary.recoil.verticalRecoil !== 0">
            <Tooltip :tooltip="$t('caption.verticalRecoil')">
              <font-awesome-icon
                icon="arrows-alt-v"
                class="icon-before-text"
              />
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, buildSummary.recoil.verticalRecoil) }}</span>
            </tooltip>
          </div>
          <div v-if="buildSummary.recoil.horizontalRecoil !== 0">
            <Tooltip :tooltip="$t('caption.horizontalRecoil')">
              <font-awesome-icon
                icon="arrows-alt-h"
                class="icon-before-text"
              />
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, buildSummary.recoil.horizontalRecoil) }}</span>
            </Tooltip>
          </div>
          <div v-if="buildSummary.ergonomics !== 0">
            <Tooltip :tooltip="$t('caption.ergonomics')">
              <font-awesome-icon
                icon="hand-paper"
                class="icon-before-text"
              />
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, buildSummary.ergonomics) }}</span>
              <span v-if="buildSummary.wearableModifiers.ergonomicsModifierPercentage !== 0">
                (<span :class="StatsUtils.getValueColorClass(buildSummary.wearableModifiers.ergonomicsModifierPercentage)">
                  {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, buildSummary.wearableModifiers.ergonomicsModifierPercentage) }}
                </span>)
              </span>
            </Tooltip>
          </div>
          <div v-else-if="buildSummary.wearableModifiers.ergonomicsModifierPercentage !== 0">
            <font-awesome-icon
              icon="hand-paper"
              class="icon-before-text"
            />
            <span :class="StatsUtils.getValueColorClass(buildSummary.wearableModifiers.ergonomicsModifierPercentage)">
              {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, buildSummary.wearableModifiers.ergonomicsModifierPercentage) }}
            </span>
          </div>
        </div>
        <div
          v-if="buildSummary.armorModifiers.armorClass > 0 || buildSummary.wearableModifiers.movementSpeedModifierPercentage !== 0 || buildSummary.wearableModifiers.turningSpeedModifierPercentage !== 0"
          class="builds-list-card-stats"
        >
          <div v-if="buildSummary.armorModifiers.armorClass > 0">
            <Tooltip :tooltip="$t('caption.armorClass')">
              <font-awesome-icon
                icon="award"
                class="icon-before-text"
              />
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.armorClass, buildSummary.armorModifiers.armorClass) }}</span>
            </Tooltip>
          </div>
          <div v-if="buildSummary.wearableModifiers.movementSpeedModifierPercentage !== 0">
            <Tooltip :tooltip="$t('caption.movementSpeed')">
              <font-awesome-icon
                icon="walking"
                class="icon-before-text"
              />
              <span :class="StatsUtils.getValueColorClass(buildSummary.wearableModifiers.movementSpeedModifierPercentage)">
                {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, buildSummary.wearableModifiers.movementSpeedModifierPercentage) }}
              </span>
            </Tooltip>
          </div>
          <div v-if="buildSummary.wearableModifiers.turningSpeedModifierPercentage !== 0">
            <Tooltip :tooltip="$t('caption.turningSpeed')">
              <font-awesome-icon
                icon="undo"
                class="icon-before-text"
              />
              <span :class="StatsUtils.getValueColorClass(buildSummary.wearableModifiers.turningSpeedModifierPercentage)">
                {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, buildSummary.wearableModifiers.turningSpeedModifierPercentage) }}
              </span>
            </Tooltip>
          </div>
        </div>
        <div class="builds-list-card-buttons">
          <Button @click="selectedBuildSummariesInternal = [buildSummary]">
            <font-awesome-icon
              icon="edit"
              class="icon-before-text"
            />
            <span>{{ $t('caption.edit') }}</span>
          </Button>
          <Button
            v-tooltip.top="$t('caption.shoppingList')"
            :disabled="buildSummary.shoppingList.length === 0"
            class="shopping-list-button"
            @click="displayShoppingList(buildSummary.shoppingList)"
          >
            <font-awesome-icon
              class="icon-before-text"
              icon="shopping-cart"
            />
            <span>{{ $t('caption.shoppingList') }}</span>
          </button>
        </div>
      </template>
    </Card>
  </div>

  <!-- Shopping list -->
  <ShoppingList />
</template>

<script lang="ts" src="./BuildsListComponent.ts" />
<style scoped lang="css" src="./BuildsListComponent.css" />
<style lang="css" src="./BuildsListComponent.unscoped.css" />
