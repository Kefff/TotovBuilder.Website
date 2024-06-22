<template>
  <div class="option-entry">
    <div class="option-value">
      <Tooltip
        :tooltip="$t('caption.chopDamage')"
        class="custom-icon-after-text"
      >
        <span>{{ meleeWeapon.chopDamage }}</span>
        <img :src="Images.chop">
      </Tooltip>
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <Tooltip
        :tooltip="$t('caption.stabDamage')"
        class="custom-icon-after-text"
      >
        <span>{{ meleeWeapon.stabDamage }}</span>
        <img :src="Images.stab">
      </Tooltip>
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <Tooltip :tooltip="$t('caption.hitRadius')">
        <span>{{ $t('caption.hitRadiusValue', { radius: meleeWeapon.hitRadius }) }}</span>
        <font-awesome-icon
          icon="dot-circle"
          class="icon-after-text"
        />
      </Tooltip>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IItem } from '../../models/item/IItem'
import { IMeleeWeapon } from '../../models/item/IMeleeWeapon'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    showEmptyEntries: true
  })

const meleeWeapon = computed(() => props.item as IMeleeWeapon)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';
</style>