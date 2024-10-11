<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IItem } from '../../models/item/IItem'
import { IMeleeWeapon } from '../../models/item/IMeleeWeapon'
import CustomIcon from '../CustomIconComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const meleeWeapon = computed(() => props.item as IMeleeWeapon)
</script>










<template>
  <div class="stats-category">
    {{ $t('caption.meleeWeapon') }}
  </div>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption">
        <CustomIcon
          :icon="Images.chop"
          position="before"
        >
          <span>{{ $t('caption.chopDamage') }} :</span>
        </CustomIcon>
      </div>
      <div class="stats-value">
        {{ meleeWeapon.chopDamage }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <CustomIcon
          :icon="Images.stab"
          position="before"
        >
          <span>{{ $t('caption.stabDamage') }} :</span>
        </CustomIcon>
      </div>
      <div class="stats-value">
        {{ meleeWeapon.stabDamage }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="dot-circle"
          class="icon-before-text"
        />
        <span>{{ $t('caption.hitRadius') }} :</span>
      </div>
      <div class="stats-value">
        {{ $t('caption.hitRadiusValue', { radius: meleeWeapon.hitRadius }) }}
      </div>
    </div>
  </div>
</template>










<style scoped>
@import '../../css/icon.css';
@import '../../css/stats.css';
</style>