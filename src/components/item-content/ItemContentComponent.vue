<template>
  <div
    v-if="containerItem !== undefined"
    class="indent"
  >
    <div
      v-for="(containedItem, index) of modelValue.content"
      :key="modSlotPath ?? '' + '_' + containedItem?.itemId ?? '' + '_' + index + '_' + modelValue.content.length"
      class="item"
    >
      <Item
        v-model="modelValue.content[index]"
        :accepted-items="acceptedItems"
        :force-quantity-to-max-selectable-amount="isMagazine"
        :category-ids="categoryIds"
        :max-stackable-amount="maximumQuantity"
        @update:modelValue="onItemChanged($event, index)"
      />
    </div>
    <Item
      v-if="editing && canAddItem"
      v-model="itemToAdd"
      class="item"
      :accepted-items="acceptedItems"
      :category-ids="categoryIds"
      :max-stackable-amount="maximumQuantity"
      @update:modelValue="onItemAdded($event)"
    />
  </div>
</template>

<script lang="ts" src="./ItemContentComponent.ts" />
<style scoped lang="css" src="./ItemContentComponent.css" />