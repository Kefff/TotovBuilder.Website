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

  <Sidebar
    v-model:visible="open"
    position="left"
    style="width: auto"
  >
    <div class="shopping-list-title">
      <div class="sidebar-title">
        <font-awesome-icon
          icon="shopping-cart"
          class="icon-before-text"
        />
        <span>{{ $t('caption.shoppingList') }}</span>
      </div>
      <ShoppingListMerchants :shopping-list="shoppingList" />
    </div>
    <div class="sidebar-option">
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
          <div>
            {{ shoppingListItem.item.name }}
          </div>
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
    </div>
  </Sidebar>
</template>

<script lang="ts" src="./ShoppingListComponent.ts" />
<style scoped lang="css" src="./ShoppingListComponent.css" />