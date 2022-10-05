<template>
  <div class="indent">
    <Item
      v-for="(containedItem, index) of content"
      :key="path + '/' + index + '_' + content.length"
      v-model="content[index]"
      :accepted-items="acceptedItems"
      :force-quantity-to-max-selectable-amount="isMagazine"
      :category-ids="categoryIds"
      :max-stackable-amount="maximumQuantity"
      :path="path + '/' + index + '_' + content.length + '/' + itemPathPrefix + containedItem.itemId"
      @update:modelValue="onItemChanged($event, index)"
    />
    <Item
      v-show="editing && canAddItem"
      v-model="itemToAdd"
      :accepted-items="acceptedItems"
      :category-ids="categoryIds"
      :max-stackable-amount="maximumQuantity"
      :path="path + '/new'"
      @update:modelValue="onItemAdded($event)"
    />
  </div>
</template>

<script lang="ts" src="./ItemContentComponent.ts" />
<style scoped lang="css" src="./ItemContentComponent.css" />