<template>
  <div class="item-icon">
    <img
      v-if="iconUrl != null"
      :src="iconUrl"
    >
    <div
      v-if="quantity != null && quantity > 1"
      class="item-icon-quantity"
    >
      {{ quantity }}
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../models/item/IItem'
import { ItemPropertiesService } from '../services/ItemPropertiesService'
import Services from '../services/repository/Services'

const itemPropertiesService = Services.get(ItemPropertiesService)

const props = withDefaults(
  defineProps<{
    item: IItem,
    quantity?: number,
  }>(),
  {
    quantity: undefined
  })

const iconUrl = computed(() => {
  if (itemPropertiesService.isRangedWeapon(props.item) || props.item.iconLink === '') {
    return props.item.imageLink
  } else {
    return props.item.iconLink
  }
})
</script>










<style scoped>
.item-icon {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: relative;
}

.item-icon > img {
  border-radius: 3px;
  max-height: 3.25rem;
}

.item-icon-quantity {
  bottom: 1px;
  font-size: 0.875rem;
  height: 1rem;
  position: absolute;
  right: 3px;
  text-align: end;
  text-shadow: black 1px 1px;
  width: 2rem;
}
</style>