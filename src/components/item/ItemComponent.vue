<template>
  <div
    v-if="inventoryItemInternal != null || editing"
    class="item"
  >
    <div
      class="item-selection"
      :class="(item != null && isMainInventorySlotItem) ? 'item-selection-main' : ''"
    >
      <div class="item-selection-dropdown">
        <Dropdown
          v-model="item"
          :disabled="!editing || isBaseItem"
          :options="options"
          :scroll-height="dropdownPanelHeight"
          :show-clear="editing && !isBaseItem"
          :virtual-scroller-options="{ orientation: 'vertical', itemSize: optionHeight }"
          class="item-dropdown"
          data-key="id"
          option-label="caption"
          @before-show="setOptions()"
          @change="onItemChanged()"
          @show="onDropdownOpen()"
        >
          <template #clearicon>
            <div
              class="item-clear-button"
              @click="removeItem"
            >
              <font-awesome-icon icon="times" />
            </div>
          </template>
          <template #empty>
            <div class="item-dropdown-empty">
              <Loading
                v-if="loadingOptions"
                :scale="0.5"
              />
              <span v-else>
                {{ $t('message.noItemsFound') }}
              </span>
              <div />
            </div>
          </template>
          <template #header>
            <OptionHeaderSelector
              :category-id="acceptedItemsCategoryId"
              :filter="optionsFilter"
              :sorting-data="optionsSortingData"
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
            <Tooltip
              :apply-hover-style="false"
              :tooltip="item?.name"
            >
              <SelectedItem v-model:item="slotProps.value" />
            </Tooltip>
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
          :max="maxSelectableQuantity"
          :min="1"
          :read-only="!editing || forceQuantityToMaxSelectableAmount"
          :required="true"
          caption-mode="placeholder"
          required-message-position="right"
          @update:value="onQuantityChanged($event)"
        />
      </div>
      <SelectedItemFunctionalities
        v-if="inventoryItemInternal != null && item != null"
        v-model:selectedTab="selectedTab"
        :can-be-looted="canBeLooted"
        :can-have-content="itemIsContainer"
        :can-have-mods="itemIsModdable && !isBaseItem"
        :can-ignore-price="canIgnorePrice"
        :content-count="contentCount"
        :ignore-price="inventoryItemInternal.ignorePrice"
        :item="item"
        :mods-count="modsCount"
        @update:ignore-price="onIgnorePriceChanged($event)"
      />
      <SelectedItemSummarySelector
        v-if="inventoryItemInternal != null && item != null"
        :can-be-looted="canBeLooted"
        :include-mods-and-content="includeModsAndContentInSummary"
        :inventory-item-in-same-slot-in-preset="presetModSlotContainingItem?.item"
        :inventory-item="inventoryItemInternal"
        :is-base-item="isBaseItem"
        :is-main-inventory-slot-item="isMainInventorySlotItem"
        :selected-item="item"
        :show-price="showPrice"
      />
    </div>
    <div
      v-if="inventoryItemInternal != null && item != null && !itemChanging && !isBaseItem"
      :class="(item != null && isMainInventorySlotItem) ? 'item-content-and-mods-main' : ''"
    >
      <div v-if="itemIsModdable">
        <div
          v-if="baseItem != null"
          v-show="selectedTab === SelectableTab.mods"
          class="item-base-item"
        >
          <div>
            {{ $t('caption.baseItem') }}
          </div>
          <Item
            :accepted-items="[]"
            :can-be-looted="showBaseItemPrice"
            :inventory-item="baseItem"
            :is-base-item="true"
            :path="path"
          />
        </div>
        <ItemMods
          v-show="selectedTab === SelectableTab.mods"
          :inventory-mod-slots="inventoryItemInternal.modSlots"
          :moddable-item="item"
          :path="path"
          @update:inventory-mod-slots="onModsChanged($event)"
        />
      </div>
      <div v-if="itemIsContainer">
        <div v-show="selectedTab === SelectableTab.content">
          <ItemContent
            :inventory-items="inventoryItemInternal.content"
            :container-item="item"
            :path="path"
            @update:inventory-items="onContentChanged($event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ItemComponent.ts" />
<style scoped lang="css" src="./ItemComponent.css" />
<style lang="css" src="./ItemComponent.unscoped.css" />