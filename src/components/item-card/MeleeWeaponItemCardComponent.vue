<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IItem } from '../../models/item/IItem'
import { IMeleeWeapon } from '../../models/item/IMeleeWeapon'
import CustomIcon from '../CustomIconComponent.vue'
import Tooltip from '../TooltipComponent.vue'

const props = defineProps<{ item: IItem }>()

const meleeWeapon = computed(() => props.item as IMeleeWeapon)
</script>










<template>
  <div class="card-line">
    <Tooltip :tooltip="$t('caption.chopDamage')">
      <CustomIcon
        :icon="Images.chop"
        position="before"
      >
        <span>{{ meleeWeapon.chopDamage }}</span>
      </CustomIcon>
    </Tooltip>
    <Tooltip :tooltip="$t('caption.stabDamage')">
      <CustomIcon
        :icon="Images.stab"
        position="before"
      >
        <span>{{ meleeWeapon.stabDamage }}</span>
      </CustomIcon>
    </Tooltip>
    <Tooltip :tooltip="$t('caption.hitRadius')">
      <font-awesome-icon
        icon="dot-circle"
        class="icon-before-text"
      />
      <span>{{ $t('caption.hitRadiusValue', { radius: meleeWeapon.hitRadius }) }}</span>
    </Tooltip>
  </div>
</template>