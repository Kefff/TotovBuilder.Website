<template>
  <div class="shopping-list-title">
    <div class="sidebar-title">
      <div class="sidebar-title-icon">
        <font-awesome-icon icon="shopping-cart" />
      </div>
      <span>{{ $t('caption.shoppingList') }}</span>
    </div>
  </div>
  <div class="sidebar-option">
    <div>
      <ShoppingListMerchants :shopping-list="parameters" />
      <div
        v-for="(shoppingListItem, index) of parameters"
        :key="index"
        class="shopping-list-item"
      >
        <div class="shopping-list-item-icon">
          <ItemIcon
            :item="shoppingListItem.item"
            :quantity="shoppingListItem.quantity"
          />
        </div>
        <div>
          {{ shoppingListItem.item.name }}
        </div>
        <div class="shopping-list-item-price">
          <Price
            :price="shoppingListItem.price"
            :show-details="false"
          />
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
      <div />
    </div>
  </div>
</template>

<script lang="ts" src="./ShoppingListComponent.ts" />
<style scoped lang="css" src="./ShoppingListComponent.css" />