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
import WearableSummary from './WearableSummaryComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers
    includeModsAndContent?: boolean,
    isBaseItem?: boolean,
    item: IItem,
    showEmptyEntries?: boolean,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    includeModsAndContent: false,
    isBaseItem: false,
    showEmptyEntries: true,
    wearableModifiersOverride: undefined
  })

const _itemPropertiesService = Services.get(ItemPropertiesService)

const armor = computed(() => props.item as IArmor)
const armorClass = computed(() => props.armorModifiersOverride?.armorClass ?? armor.value.presetArmorModifiers?.armorClass ?? armor.value.armorClass)
const boldCssClass = computed(() => props.includeModsAndContent ? 'armor-summary-bold' : '')
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
  <div
    v-if="(!isBaseItem && armorClass > 0) || showEmptyEntries"
    class="option-entry"
    :class="boldCssClass"
  >
    <div class="option-value">
      <div v-if="armorClass > 0">
        <Tooltip :tooltip="$t('caption.armorClass') + tooltipSuffix">
          <font-awesome-icon
            icon="award"
            class="icon-before-text"
          />
          <span>{{ armorClass }}</span>
        </Tooltip>
      </div>
    </div>
  </div>
  <div
    v-if="(!isBaseItem && durability > 0) || showEmptyEntries"
    class="option-entry"
    :class="boldCssClass"
  >
    <div class="option-value">
      <div v-if="durability > 0">
        <Tooltip :tooltip="$t('caption.durability') + tooltipSuffix">
          <font-awesome-icon
            icon="heart"
            class="icon-before-text armor-summary-durability"
          />
          <span>{{ durability }}</span>
        </Tooltip>
      </div>
    </div>
  </div>
  <WearableSummary
    :include-mods-and-content="includeModsAndContent"
    :item="armor"
    :show-empty-entries="showEmptyEntries"
    :wearable-modifiers-override="wearableModifiersOverride"
  />
</template>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';
@import '../../css/stats.css';

.armor-summary-bold {
  font-style: italic;
  font-weight: bold;
}

.armor-summary-durability {
  color: var(--error-color);
}
</style>