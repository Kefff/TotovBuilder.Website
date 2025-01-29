<script setup lang="ts">
import Images from '../images'
import { InventorySlotTypeId } from '../models/build/InventorySlotTypes'
import StringUtils from '../utils/StringUtils'
import WebBrowserUtils from '../utils/WebBrowserUtils'

const modelCurrentInventorySlotType = defineModel<InventorySlotTypeId>('currentInventorySlotType')


const _zoneBackgroundColor = 'transparent'
// const _zoneBackgroundColor = 'rgba(0, 255, 0, 0.15)' // For testing
const _zoneColumn1Left = '2.25rem'
const _zoneColumn2Left = '11.1rem'
const _zoneColumn3Left = '20rem'
const _zoneItemHeight = '6.1rem'
const _zoneItemLine1Top = '2.4rem'
const _zoneItemLine2Top = '10.4rem'
const _zoneItemLine3Top = '18.45rem'
const _zoneItemLine4Top = '26.65rem'
const _zoneItemLine5Top = '34.85rem'
const _zoneItemLine6Top = '42.8rem'
const _zoneItemLine7Top = '50rem'
const _zoneItemSmallColumn1Left = _zoneColumn1Left
const _zoneItemSmallColumn2Left = '8.49rem'
const _zoneItemSmallColumn3Left = '14.6rem'
const _zoneItemSmallColumn4Left = '20.70rem'
const _zoneItemSmallHeight = '5.35rem'
const _zoneItemSmallWidth = _zoneItemSmallHeight
const _zoneTextFontSize = '0.75rem'
const _zoneTextHeight = '0.85rem'
const _zoneTextLine1Top = '1.35rem'
const _zoneTextLine2Top = '9.3rem'
const _zoneTextLine3Top = '17.4rem'
const _zoneTextLine4Top = '25.6rem'
const _zoneTextLine5Top = '33.75rem'
const _zoneTextLine6Top = '41.65rem'
const _zoneTextLine7Top = '48.95rem'
const _zoneTextPadding = '0.1rem'
const _zoneWidth = _zoneItemHeight
const _zoneWidthColspan2 = '15rem'

const { isSmartphoneLandscapeOrSmaller: isCompactMode } = WebBrowserUtils.getScreenSize()
</script>










<template>
  <div
    v-if="!isCompactMode"
    class="inventory-slots-selector"
  >
    <div class="inventory-slots-selector-image-container">
      <img
        class="inventory-slots-selector-image"
        :src="Images.inventorySlotsSelection"
      >

      <div
        class="inventory-slots-selector-zone-text-earpiece"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.earpiece"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.earpiece)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-earpiece"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.earpiece }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.earpiece"
      />

      <div
        class="inventory-slots-selector-zone-text-headwear"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.headwear"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.headwear)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-headwear"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.headwear }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.headwear"
      />

      <div
        class="inventory-slots-selector-zone-text-face-cover"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.faceCover"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.faceCover)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-face-cover"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.faceCover }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.faceCover"
      />

      <div
        class="inventory-slots-selector-zone-text-armband"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.armband"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.armband)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-armband"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.armband }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.armband"
      />

      <div
        class="inventory-slots-selector-zone-text-body-armor"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.bodyArmor"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.bodyArmor)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-body-armor"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.bodyArmor }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.bodyArmor"
      />

      <div
        class="inventory-slots-selector-zone-text-eyewear"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.eyewear"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.eyewear)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-eyewear"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.eyewear }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.eyewear"
      />

      <div
        class="inventory-slots-selector-zone-text-on-sling"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.onSling"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.onSling)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-on-sling"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.onSling }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.onSling"
      />

      <div
        class="inventory-slots-selector-zone-text-holster"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.holster"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.holster)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-holster"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.holster }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.holster"
      />

      <div
        class="inventory-slots-selector-zone-text-on-back"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.onBack"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.onBack)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-on-back"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.onBack }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.onBack"
      />

      <div
        class="inventory-slots-selector-zone-text-scabbard"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.scabbard"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.scabbard)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-scabbard"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.scabbard }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.scabbard"
      />

      <div
        class="inventory-slots-selector-zone-text-tactical-rig"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.tacticalRig"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.tacticalRig)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-tactical-rig"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.tacticalRig }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.tacticalRig"
      />

      <div
        class="inventory-slots-selector-zone-text-backpack"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.backpack"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.backpack)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-backpack"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.backpack }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.backpack"
      />

      <div
        class="inventory-slots-selector-zone-text-pouch"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.pouch"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.pouch)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-pouch"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.pouch }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.pouch"
      />

      <div
        class="inventory-slots-selector-zone-text-pockets"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.pockets"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.pockets)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-pockets1"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.pockets }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.pockets"
      />
      <div
        class="inventory-slots-selector-zone-item-pockets2"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.pockets }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.pockets"
      />
      <div
        class="inventory-slots-selector-zone-item-pockets3"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.pockets }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.pockets"
      />
      <div
        class="inventory-slots-selector-zone-item-pockets4"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.pockets }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.pockets"
      />

      <div
        class="inventory-slots-selector-zone-text-special"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.special"
      >
        {{ $t('caption.slotType' + StringUtils.toUpperFirst(InventorySlotTypeId.special)).toLocaleUpperCase() }}
      </div>
      <div
        class="inventory-slots-selector-zone-item-special1"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.special }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.special"
      />
      <div
        class="inventory-slots-selector-zone-item-special2"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.special }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.special"
      />
      <div
        class="inventory-slots-selector-zone-item-special3"
        :class="{ 'inventory-slots-selector-current': modelCurrentInventorySlotType === InventorySlotTypeId.special }"
        @click="modelCurrentInventorySlotType = InventorySlotTypeId.special"
      />
    </div>
  </div>
</template>










<style scoped>
.inventory-slots-selector {
  position: relative;
}

.inventory-slots-selector-current {
  border-color: var(--primary-color);
  border-style: solid;
}

.inventory-slots-selector-image-container {
  border-color: var(--primary-color6);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  display: flex;
  overflow: hidden;
  position: sticky;
  top: 5rem;
  width: 28.5rem;
}

.inventory-slots-selector-image {
  height: 100%;
  width: 100%;
}

.inventory-slots-selector-zone-item-armband {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: 3.2rem;
  left: v-bind(_zoneColumn1Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneItemLine2Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-item-backpack {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemHeight);
  left: v-bind(_zoneColumn2Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneItemLine5Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-item-body-armor {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemHeight);
  left: v-bind(_zoneColumn2Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneItemLine2Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-item-earpiece {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemHeight);
  left: v-bind(_zoneColumn1Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneItemLine1Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-item-eyewear {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemHeight);
  left: v-bind(_zoneColumn3Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneItemLine2Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-item-face-cover {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemHeight);
  left: v-bind(_zoneColumn3Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneItemLine1Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-item-headwear {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemHeight);
  left: v-bind(_zoneColumn2Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneItemLine1Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-item-holster {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemHeight);
  left: v-bind(_zoneColumn3Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneItemLine3Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-item-on-back {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemHeight);
  left: v-bind(_zoneColumn1Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneItemLine4Top);
  width: v-bind(_zoneWidthColspan2);
}

.inventory-slots-selector-zone-item-on-sling {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemHeight);
  left: v-bind(_zoneColumn1Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneItemLine3Top);
  width: v-bind(_zoneWidthColspan2);
}

.inventory-slots-selector-zone-item-pockets1 {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemSmallHeight);
  left: v-bind(_zoneItemSmallColumn1Left);
  position: absolute;
  top: v-bind(_zoneItemLine6Top);
  width: v-bind(_zoneItemSmallWidth);
}

.inventory-slots-selector-zone-item-pockets2 {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemSmallHeight);
  left: v-bind(_zoneItemSmallColumn2Left);
  position: absolute;
  top: v-bind(_zoneItemLine6Top);
  width: v-bind(_zoneItemSmallWidth);
}

.inventory-slots-selector-zone-item-pockets3 {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemSmallHeight);
  left: v-bind(_zoneItemSmallColumn3Left);
  position: absolute;
  top: v-bind(_zoneItemLine6Top);
  width: v-bind(_zoneItemSmallWidth);
}

.inventory-slots-selector-zone-item-pockets4 {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemSmallHeight);
  left: v-bind(_zoneItemSmallColumn4Left);
  position: absolute;
  top: v-bind(_zoneItemLine6Top);
  width: v-bind(_zoneItemSmallWidth);
}

.inventory-slots-selector-zone-item-pouch {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemHeight);
  left: v-bind(_zoneColumn3Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneItemLine5Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-item-scabbard {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemHeight);
  left: v-bind(_zoneColumn3Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneItemLine4Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-item-special1 {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemSmallHeight);
  left: v-bind(_zoneItemSmallColumn1Left);
  position: absolute;
  top: v-bind(_zoneItemLine7Top);
  width: v-bind(_zoneItemSmallWidth);
}

.inventory-slots-selector-zone-item-special2 {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemSmallHeight);
  left: v-bind(_zoneItemSmallColumn2Left);
  position: absolute;
  top: v-bind(_zoneItemLine7Top);
  width: v-bind(_zoneItemSmallWidth);
}

.inventory-slots-selector-zone-item-special3 {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemSmallHeight);
  left: v-bind(_zoneItemSmallColumn3Left);
  position: absolute;
  top: v-bind(_zoneItemLine7Top);
  width: v-bind(_zoneItemSmallWidth);
}

.inventory-slots-selector-zone-item-tactical-rig {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  height: v-bind(_zoneItemHeight);
  left: v-bind(_zoneColumn1Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneItemLine5Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-text-armband {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn1Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine2Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-text-backpack {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn2Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine5Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-text-body-armor {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn2Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine2Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-text-earpiece {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn1Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine1Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-text-eyewear {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn3Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine2Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-text-face-cover {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn3Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine1Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-text-headwear {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn2Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine1Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-text-holster {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn3Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine3Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-text-on-back {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn1Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine4Top);
  width: v-bind(_zoneWidthColspan2);
}

.inventory-slots-selector-zone-text-on-sling {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn1Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine3Top);
  width: v-bind(_zoneWidthColspan2);
}

.inventory-slots-selector-zone-text-pockets {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn1Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine6Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-text-pouch {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn3Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine5Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-text-scabbard {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn3Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine4Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-text-special {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn1Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine7Top);
  width: v-bind(_zoneWidth);
}

.inventory-slots-selector-zone-text-tactical-rig {
  background-color: v-bind(_zoneBackgroundColor);
  cursor: pointer;
  font-size: v-bind(_zoneTextFontSize);
  height: v-bind(_zoneTextHeight);
  left: v-bind(_zoneColumn1Left);
  padding-left: v-bind(_zoneTextPadding);
  padding-right: v-bind(_zoneTextPadding);
  position: absolute;
  top: v-bind(_zoneTextLine5Top);
  width: v-bind(_zoneWidth);
}
</style>
