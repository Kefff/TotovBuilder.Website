<template>
  <div class="option-entry">
    <div class="option-value">
      <Tooltip :tooltip="$t('caption.chopDamage')">
        <CustomIcon
          :icon="Images.chop"
          position="before"
        >
          <span>{{ meleeWeapon.chopDamage }}</span>
        </CustomIcon>
      </Tooltip>
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <Tooltip :tooltip="$t('caption.stabDamage')">
        <CustomIcon
          :icon="Images.stab"
          position="before"
        >
          <span>{{ meleeWeapon.stabDamage }}</span>
        </CustomIcon>
      </Tooltip>
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <Tooltip :tooltip="$t('caption.hitRadius')">
        <font-awesome-icon
          icon="dot-circle"
          class="icon-before-text"
        />
        <span>{{ $t('caption.hitRadiusValue', { radius: meleeWeapon.hitRadius }) }}</span>
      </Tooltip>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IItem } from '../../models/item/IItem'
import { IMeleeWeapon } from '../../models/item/IMeleeWeapon'
import CustomIcon from '../CustomIconComponent.vue'

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