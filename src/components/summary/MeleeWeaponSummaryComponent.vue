<template>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.chopDamage')"
      class="option-value custom-icon-after-text"
    >
      <span>{{ meleeWeapon.chopDamage }}</span>
      <img :src="Images.chop">
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.stabDamage')"
      class="option-value custom-icon-after-text"
    >
      <span>{{ meleeWeapon.stabDamage }}</span>
      <img :src="Images.stab">
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.hitRadius')"
      class="option-value"
    >
      <span>{{ meleeWeapon.hitRadius }}m</span>
      <font-awesome-icon
        icon="dot-circle"
        class="icon-after-text"
      />
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IItem } from '../../models/item/IItem'
import { IMeleeWeapon } from '../../models/item/IMeleeWeapon'

const props = defineProps<{
  item: IItem
}>()

const meleeWeapon = computed(() => props.item as IMeleeWeapon)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';
</style>