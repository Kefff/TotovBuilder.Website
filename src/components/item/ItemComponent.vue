<template>
  <div
    v-if="selectedInventoryItem != null || editing"
    class="item"
  >
    <div class="item-selection">
      <div class="item-dropdown-override">
        <Dropdown
          v-model="selectedItem"
          data-key="id"
          :disabled="!editing"
          :empty-message="$t('message.noItemsFound')"
          :options="options"
          option-label="caption"
          :show-clear="editing"
          class="item-dropdown"
          :scroll-height="dropdownPanelHeight"
          :virtual-scroller-options="{ orientation: 'vertical', itemSize: 64 }"
          @change="onSelectedItemChanged()"
        >
          <template #header>
            <OptionHeaderSelector
              v-model:filter="optionsFilter"
              v-model:sortingData="optionsSortingData"
              :category-id="acceptedItemsCategoryId"
              @update:filter="onFilterOptions($event)"
              @update:sortingData="onSortOptions($event)"
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
          @update:modelValue="onQuantityChanged($event)"
        />
      </div>
      <SelectedItemFunctionalities
        v-if="selectedInventoryItem != null"
        v-model:selectedTab="selectedTab"
        v-model:ignorePrice="selectedInventoryItem.ignorePrice"
        :can-have-content="selectedItemIsContainer"
        :can-have-mods="selectedItemIsModdable"
        @update:ignorePrice="onIgnorePriceChanged()"
      />
      <SelectedItemSummarySelector
        v-if="selectedInventoryItem != null"
        v-model="selectedInventoryItem"
        :can-be-looted="canBeLooted"
        :preset="preset"
      />
    </div>
    <div
      v-if="selectedInventoryItem != null && selectedItem != null && !itemChanging"
      class="tabs"
    >
      <div :class="selectedTab === SelectableTab.stats ? '' : 'item-tab-hidden'">
        <StatsSelector :item-id="selectedItem.id" />
      </div>
      <div
        v-if="selectedItemIsModdable"
        :class="selectedTab === SelectableTab.mods ? '' : 'item-tab-hidden'"
      >
        <ItemMods
          v-model="selectedInventoryItem.modSlots"
          :container-item="selectedItem"
          :path="path"
        />
      </div>
      <div
        v-if="selectedItemIsContainer"
        :class="selectedTab === SelectableTab.content ? '' : 'item-tab-hidden'"
      >
        <ItemContent
          v-model="selectedInventoryItem.content"
          :container-item="selectedItem"
          :path="path"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ItemComponent.ts" />
<style scoped lang="css" src="./ItemComponent.css" />
<style lang="css" src="./ItemComponent.unscoped.css" />