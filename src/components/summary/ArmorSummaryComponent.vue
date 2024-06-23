<template>
  <div
    v-if="armorClass > 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="armorClass > 0">
        <Tooltip :tooltip="$t('caption.armorClass')">
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
    v-if="durability > 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="durability > 0">
        <Tooltip :tooltip="$t('caption.durability')">
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
    :item="armor"
    :show-empty-entries="showEmptyEntries"
    :wearable-modifiers-override="wearableModifiersOverride"
  />
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IArmor } from '../../models/item/IArmor'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import WearableSummary from './WearableSummaryComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers
    item: IItem,
    showEmptyEntries?: boolean,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    showEmptyEntries: true,
    wearableModifiersOverride: undefined
  })

const armor = computed(() => props.item as IArmor)
const armorClass = computed(() => props.armorModifiersOverride?.armorClass ?? armor.value.presetArmorModifiers?.armorClass ?? armor.value.armorClass)
const durability = computed(() => props.armorModifiersOverride?.durability ?? armor.value.presetArmorModifiers?.durability ?? armor.value.durability)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';
@import '../../css/stats.css';

.armor-summary-durability {
  color: var(--error-color);
}
</style>