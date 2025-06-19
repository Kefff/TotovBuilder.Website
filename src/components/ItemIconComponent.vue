<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../models/item/IItem'
import { ItemPropertiesService } from '../services/ItemPropertiesService'
import Services from '../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'

const itemPropertiesService = Services.get(ItemPropertiesService)

const props = withDefaults(
  defineProps<{
    item: IItem,
    quantity?: number,
    showShortName?: boolean
  }>(),
  {
    quantity: undefined,
    showShortName: false
  })

const iconUrl = computed(() => {
  if (itemPropertiesService.isRangedWeapon(props.item) || props.item.iconLink === '') {
    return props.item.imageLink
  } else {
    return props.item.iconLink
  }
})
</script>










<template>
  <div class="item-icon">
    <img
      v-if="iconUrl != null"
      :src="iconUrl"
    >
    <div
      v-if="showShortName"
      class="item-icon-shortname"
    >
      {{ item.shortName }}
    </div>
    <div
      v-if="quantity != null && quantity > 1"
      class="item-icon-quantity"
    >
      {{ StatsUtils.getStandardDisplayValue(DisplayValueType.quantity, quantity) }}
    </div>
  </div>
</template>










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
  min-width: 3.125rem;
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
  text-shadow:
    1px 1px 0 black,
    -1px 1px 0 black,
    1px -1px 0 black,
    -1px -1px 0 black;
}

.item-icon-shortname {
  top: 1px;
  font-size: 0.75rem;
  height: 1rem;
  position: absolute;
  right: 3px;
  text-align: end;
  text-shadow:
    1px 1px 0 black,
    -1px 1px 0 black,
    1px -1px 0 black,
    -1px -1px 0 black;
}
</style>