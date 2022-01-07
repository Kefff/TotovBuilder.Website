<template>
  <div
    v-if="modelValue != undefined || editing"
    class="item"
  >
    <div class="item-selection">
      <div
        v-tooltip.top="selectedItem?.caption"
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
      <TabSelectorComponent
        v-if="selectedItem !== undefined"
        v-model="selectedTab"
        :can-have-content="selectedItemIsContainer"
        :can-have-mods="selectedItemIsModdable"
      />
      <div
        v-if="selectedItem !== undefined && maxSelectableQuantity > 1"
        class="quantity"
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
      <SelectedItemSummarySelector
        v-if="modelValue != undefined"
        v-model="modelValue"
        :can-be-looted="canBeLooted"
        :preset="preset"
      />
    </div>
    <div
      v-if="selectedItem !== undefined && !itemChanging"
      class="tabs"
    >
      <div :class="selectedTab === SelectableTab.stats ? '' : 'tab-hidden'">
        <StatsSelector :item-id="selectedItem?.id" />
      </div>
      <div
        v-if="selectedItemIsModdable"
        :class="selectedTab === SelectableTab.mods ? '' : 'tab-hidden'"
      >
        <ItemMods
          v-model="inventoryItem"
          :path="path + '/' + modSlotPathPrefix"
        />
      </div>
      <div
        v-if="inventoryItem !== undefined && selectedItemIsContainer"
        :class="selectedTab === SelectableTab.content ? '' : 'tab-hidden'"
      >
        content
        <ItemContent
          v-model="inventoryItem"
          :path="path + '/' + contentPathPrefix"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ItemComponent.ts" />
<style scoped lang="css" src="./ItemComponent.css" />
<style lang="css" src="./ItemComponent.unscoped.css" />