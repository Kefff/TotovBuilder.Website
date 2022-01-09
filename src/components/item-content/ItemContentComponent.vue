<template>
  <div
    v-if="containerItem !== undefined"
    class="indent"
  >
    <div
      v-for="(containedItem, index) of modelValue.content"
      :key="path + index + '_' + modelValue.content.length + '/' + itemPathPrefix + modelValue.content[index].itemId"
      class="item"
    >
      <Item
        v-model="modelValue.content[index]"
        :accepted-items="acceptedItems"
        :force-quantity-to-max-selectable-amount="isMagazine"
        :category-ids="categoryIds"
        :max-stackable-amount="maximumQuantity"
        :path="path + index + '_' + modelValue.content.length + '/' + itemPathPrefix + modelValue.content[index].itemId"
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
      :path="path + modelValue.content.length + '_' + modelValue.content.length + '/' + 'new'"
      @update:modelValue="onItemAdded($event)"
    />
  </div>
</template>

<script lang="ts" src="./ItemContentComponent.ts" />
<style scoped lang="css" src="./ItemContentComponent.css" />