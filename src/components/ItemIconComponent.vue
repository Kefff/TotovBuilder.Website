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
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  flex-wrap: nowrap;
  overflow: hidden;
  position: relative;
  width: fit-content;
}

.item-icon > img {
  /* Cropping the image to remove the border on some images */
  clip-path: inset(1px 1px 1px 1px);
  max-height: 3.25rem;
  max-width: 4.75rem;
  min-width: 3.25rem;
  /* Zooming on the image to fill the cropped pixels */
  transform: scale(1.05);
}

.item-icon-quantity {
  bottom: 1px;
  font-size: 0.875rem;
  height: 1rem;
  position: absolute;
  right: 3px;
  text-align: end;
  text-shadow: 1px 1px 0 black,
    -1px 1px 0 black,
    1px -1px 0 black,
    -1px -1px 0 black;
  width: 2rem;
}
</style>