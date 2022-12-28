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
    :draggable="false"
  >
    <div>
      <div
        v-for="(shoppingListItem, index) of shoppingList"
        :key="index"
        class="shopping-list-item"
      >
        <div class="shopping-list-item-quantity">
          <span v-if="shoppingListItem.quantity > 1">{{ shoppingListItem.quantity }} x</span>
        </div>
        <div class="shopping-list-item-icon">
          <div>
            <ItemIcon :item="shoppingListItem.item" />
          </div>
        </div>
        <div class="shopping-list-item-name">
          {{ shoppingListItem.item.name }}
        </div>
        <div class="shopping-list-item-price">
          <div>
            <Price
              :price="shoppingListItem.price"
              :show-details="false"
            />
          </div>
          <div
            v-if="shoppingListItem.quantity > 1"
            class="shopping-list-item-price-per-unit"
          >
            <Price
              :price="shoppingListItem.unitPrice"
              :show-merchant-icon="false"
              :show-details="false"
              :tooltip-suffix="' (' + $t('caption.perUnit') + ')'"
            />
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" src="./ShoppingListComponent.ts" />
<style scoped lang="css" src="./ShoppingListComponent.css" />