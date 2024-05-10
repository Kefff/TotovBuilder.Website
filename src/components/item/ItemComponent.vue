<template>
  <div
    v-if="inventoryItemInternal != null || editing"
    class="item"
  >
    <div class="item-selection">
      <div class="item-dropdown-override">
        <Dropdown
          v-model="item"
          :disabled="!editing"
          :empty-message="$t('message.noItemsFound')"
          :options="options"
          :scroll-height="dropdownPanelHeight"
          :show-clear="editing"
          :virtual-scroller-options="{ orientation: 'vertical', itemSize: optionHeight }"
          class="item-dropdown"
          data-key="id"
          option-label="caption"
          @change="onItemChanged()"
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
            <div v-tooltip.top="item?.name">
              <SelectedItem v-model:item="slotProps.value" />
            </div>
          </template>
        </Dropdown>
      </div>
      <div
        v-if="item != null && maxSelectableQuantity > 1"
        class="item-quantity"
      >
        <InputNumberField
          v-model:value="quantity"
          :caption="$t('caption.quantity')"
          caption-mode="placeholder"
          :max="maxSelectableQuantity"
          :min="1"
          :read-only="!editing || forceQuantityToMaxSelectableAmount"
          :required="true"
          required-message-position="right"
          @update:value="onQuantityChanged($event)"
        />
      </div>
      <SelectedItemFunctionalities
        v-if="inventoryItemInternal != null"
        v-model:selectedTab="selectedTab"
        v-model:ignorePrice="inventoryItemInternal.ignorePrice"
        v-model:showStats="showStats"
        :can-be-looted="canBeLooted"
        :can-have-content="itemIsContainer"
        :can-have-mods="itemIsModdable"
        :content-count="contentCount"
        :can-ignore-price="canIgnorePrice"
        :mods-count="modsCount"
        @update:ignore-price="onIgnorePriceChanged()"
      />
      <SelectedItemSummarySelector
        v-if="inventoryItemInternal != null"
        :can-be-looted="canBeLooted"
        :inventory-item-in-same-slot-in-preset="presetModSlotContainingItem?.item"
        :inventory-item="inventoryItemInternal"
      />
    </div>
    <div
      v-if="inventoryItemInternal != null && item != null && !itemChanging"
      class="tabs"
    >
      <StatsSelector
        v-model:showStats="showStats"
        :item="item"
      />
      <div v-if="itemIsModdable">
        <ItemMods
          v-show="selectedTab === SelectableTab.mods"
          v-model:inventory-mod-slots="inventoryItemInternal.modSlots"
          :moddable-item="item"
          :path="path"
        />
      </div>
      <div v-if="itemIsContainer">
        <div v-show="selectedTab === SelectableTab.content">
          <ItemContent
            v-model:inventory-items="inventoryItemInternal.content"
            :container-item="item"
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