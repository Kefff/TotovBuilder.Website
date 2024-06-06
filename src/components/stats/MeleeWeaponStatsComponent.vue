<template>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption custom-icon-before-text">
        <img :src="Images.chop">
        <span>{{ $t('caption.chopDamage') }} :</span>
      </div>
      <div class="stats-value">
        {{ meleeWeapon.chopDamage }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption custom-icon-before-text">
        <img :src="Images.stab">
        <span>{{ $t('caption.stabDamage') }} :</span>
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
@import '../../css/stats.css';
</style>