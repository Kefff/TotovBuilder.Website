<template>
  <div
    v-if="selectedInventoryItem != null || editing"
    class="item"
  >
    <div class="item-selection">
      <div class="item-dropdown-override">
        <Dropdown
          v-model="selectedItem"
          :disabled="!editing"
          :empty-message="$t('message.noItemsFound')"
          :options="options"
          :scroll-height="dropdownPanelHeight"
          :show-clear="editing"
          :virtual-scroller-options="{ orientation: 'vertical', itemSize: optionHeight }"
          class="item-dropdown"
          data-key="id"
          option-label="caption"
          @change="onSelectedItemChanged()"
          @show="onDropdownOpen()"
        >
          <template #header>
            <OptionHeaderSelector
              v-model:filter="optionsFilter"
              v-model:sortingData="optionsSortingData"
              :category-id="acceptedItemsCategoryId"
              @update:filter="onFilterOptions($event)"
              @update:sorting-data="onSortOptions($event)"
            />
          </template>
          <template #option="slotProps">
            <div class="item-dropdown-option">
              <SummarySelector :item="slotProps.option" />
            </div>
          </template>
          <template #value="slotProps">
            <div v-tooltip.top="selectedItem?.name">
              <SelectedItem v-model="slotProps.value" />
            </div>
          </template>
        </Dropdown>
      </div>
      <div
        v-if="selectedItem != null && maxSelectableQuantity > 1"
        class="item-quantity"
      >
        <InputNumberField
          v-model="quantity"
          :caption="$t('caption.quantity')"
          caption-mode="placeholder"
          :max="maxSelectableQuantity"
          :min="1"
          :read-only="!editing || forceQuantityToMaxSelectableAmount"
          :required="true"
          required-message-position="right"
          @update:model-value="onQuantityChanged($event)"
        />
      </div>
      <SelectedItemFunctionalities
        v-if="selectedInventoryItem != null"
        v-model:selectedTab="selectedTab"
        v-model:ignorePrice="selectedInventoryItem.ignorePrice"
        v-model:showStats="showStats"
        :can-be-looted="canBeLooted"
        :can-have-content="selectedItemIsContainer"
        :can-have-mods="selectedItemIsModdable"
        :content-count="selectedInventoryItem.content.length"
        :can-ignore-price="canIgnorePrice"
        :mods-count="selectedInventoryItem.modSlots.filter(ms => ms.item != null).length"
        @update:ignore-price="onIgnorePriceChanged()"
      />
      <SelectedItemSummarySelector
        v-if="selectedInventoryItem != null"
        v-model="selectedInventoryItem"
        :can-be-looted="canBeLooted"
        :item-in-same-slot-in-preset="presetModSlotContainingItem?.item"
      />
    </div>
    <div
      v-if="selectedInventoryItem != null && selectedItem != null && !itemChanging"
      class="tabs"
    >
      <StatsSelector
        v-model:showStats="showStats"
        :item="selectedItem"
      />
      <div v-if="selectedItemIsModdable">
        <ItemMods
          v-show="selectedTab === SelectableTab.mods"
          v-model="selectedInventoryItem.modSlots"
          :container-item="selectedItem"
          :path="path"
        />
      </div>
      <div v-if="selectedItemIsContainer">
        <div v-show="selectedTab === SelectableTab.content">
          <ItemContent
            v-model="selectedInventoryItem.content"
            :container-item="selectedItem"
            :path="path"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ItemComponent.ts" />
<style scoped lang="css" src="./ItemComponent.css" />
<style lang="css" src="./ItemComponent.unscoped.css" />