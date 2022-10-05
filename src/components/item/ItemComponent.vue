<template>
  <div
    v-if="selectedInventoryItem != undefined || editing"
    class="item"
  >
    <div class="item-selection">
      <div
        v-tooltip.top="selectedItem?.name"
        class="item-dropdown-override"
      >
        <Dropdown
          v-model="selectedItem"
          data-key="id"
          :disabled="!editing"
          :empty-message="$t(optionsEmptyMessage)"
          :options="options"
          option-label="caption"
          scroll-height="26.5rem"
          :show-clear="editing"
          class="item-dropdown"
          @change="onSelectedItemChanged()"
        >
          <template #header>
            <OptionHeaderSelector
              v-model:filter="optionsFilter"
              v-model:sortingData="optionsSortingData"
              :category-id="optionsCategory"
              @update:filter="onFilterOptions($event)"
              @update:sortingData="onSortOptions($event)"
            />
          </template>
          <template #option="slotProps">
            <SummarySelector :item="slotProps.option" />
          </template>
          <template #value="slotProps">
            <SelectedItem v-model="slotProps.value" />
          </template>
        </Dropdown>
      </div>
      <div
        v-if="selectedItem !== undefined && maxSelectableQuantity > 1"
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
        v-if="selectedInventoryItem != undefined"
        v-model:selectedTab="selectedTab"
        v-model:ignorePrice="selectedInventoryItem.ignorePrice"
        :can-have-content="selectedItemIsContainer"
        :can-have-mods="selectedItemIsModdable"
      />
      <SelectedItemSummarySelector
        v-if="selectedInventoryItem != undefined"
        v-model="selectedInventoryItem"
        :can-be-looted="canBeLooted"
        :preset="preset"
      />
    </div>
    <div
      v-if="selectedInventoryItem !== undefined && selectedItem !== undefined && !itemChanging"
      class="tabs"
    >
      <div :class="selectedTab === SelectableTab.stats ? '' : 'tab-hidden'">
        <StatsSelector :item-id="selectedItem.id" />
      </div>
      <div
        v-if="selectedItemIsModdable"
        :class="selectedTab === SelectableTab.mods ? '' : 'tab-hidden'"
      >
        <ItemMods
          v-model="selectedInventoryItem.modSlots"
          :container-item="selectedItem"
          :path="path"
        />
      </div>
      <div
        v-if="selectedItemIsContainer"
        :class="selectedTab === SelectableTab.content ? '' : 'tab-hidden'"
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