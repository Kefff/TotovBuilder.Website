<template>
  <div>
    <Button
      v-tooltip.top="$t('caption.shoppingList')"
      :class="'p-button-text p-button-sm button-discreet' + (shoppingList.length === 0 ? ' p-disabled' : '')"
      @click="show()"
    >
      <font-awesome-icon icon="shopping-cart" />
    </button>
  </div>

  <Dialog
    v-model:visible="open"
    :closable="true"
    :header="$t('caption.shoppingList')"
    :modal="true"
    :base-z-index="2"
  >
    <div
      v-for="(shoppingListItem, index) of shoppingList"
      :key="index"
    >
      <ItemIcon :item="shoppingListItem.item" />
      <div>x {{ shoppingListItem.quantity }}</div>
      <div>{{ shoppingListItem.item.name }}</div>
      <Price :price="shoppingListItem.unitPrice" />
    </div>
  </Dialog>
</template>

<script lang="ts" src="./ShoppingListComponent.ts" />
<style scoped lang="css" src="./ShoppingListComponent.css" />