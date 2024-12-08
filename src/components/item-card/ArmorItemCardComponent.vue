<script setup lang="ts">
import { computed } from 'vue'
import { IArmor } from '../../models/item/IArmor'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import vueI18n from '../../plugins/vueI18n'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import Tooltip from '../TooltipComponent.vue'
import WearableItemCard from './WearableItemCardComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers
    includeModsAndContent?: boolean,
    isBaseItem?: boolean,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    includeModsAndContent: false,
    isBaseItem: false,
    wearableModifiersOverride: undefined
  })

const _itemPropertiesService = Services.get(ItemPropertiesService)

const armor = computed(() => props.item as IArmor)
const armorClass = computed(() => props.armorModifiersOverride?.armorClass ?? armor.value.presetArmorModifiers?.armorClass ?? armor.value.armorClass)
const boldCssClass = computed(() => props.includeModsAndContent ? 'armor-item-card-bold' : '')
const durability = computed(() => props.armorModifiersOverride?.durability ?? armor.value.presetArmorModifiers?.durability ?? armor.value.durability)
const isHeadwear = computed(() => _itemPropertiesService.isHeadwear(props.item))
const tooltipSuffix = computed(() => {
  if (!props.includeModsAndContent) {
    return ''
  } else if (props.includeModsAndContent && isHeadwear) {
    return vueI18n.t('caption.withMods')
  } else {
    return vueI18n.t('caption.frontPlate')
  }
})
</script>










<template>
  <div class="card-line card-line4">
    <Tooltip
      v-if="!isBaseItem && armorClass > 0"
      :class="boldCssClass"
      :tooltip="$t('caption.armorClass') + tooltipSuffix"
    >
      <font-awesome-icon
        icon="award"
        class="icon-before-text"
      />
      <span>{{ armorClass }}</span>
    </Tooltip>
    <Tooltip
      v-if="!isBaseItem && durability > 0"
      :class="boldCssClass"
      :tooltip="$t('caption.durability') + tooltipSuffix"
    >
      <font-awesome-icon
        icon="heart"
        class="icon-before-text armor-item-card-durability"
      />
      <span>{{ durability }}</span>
    </Tooltip>
    <slot />
  </div>
  <WearableItemCard
    :include-mods-and-content="includeModsAndContent"
    :item="armor"
    :wearable-modifiers-override="wearableModifiersOverride"
  />
</template>










<style scoped>
.armor-item-card-bold {
  font-style: italic;
  font-weight: bold;
}

.armor-item-card-durability {
  color: var(--error-color);
}
</style>