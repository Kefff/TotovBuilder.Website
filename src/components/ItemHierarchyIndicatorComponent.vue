<script setup lang="ts">
import { computed } from 'vue'
import WebBrowserUtils from '../utils/WebBrowserUtils'

const props = defineProps<{
  isFirst: boolean,
  isLast: boolean,
  isVisible: boolean,
  mode: 'addContent' | 'baseItem' | 'content' | 'magazineContent' | 'mods',
}>()

const _bottomTopOffset = '12px'
const _middleHeight = '1.5625rem'

const bottomHeight = computed(() => `calc(100% - ${upperHeight.value} - ${_middleHeight} + ${_bottomTopOffset})`)
const bottomTop = computed(() => `calc(${upperHeight.value} + ${_middleHeight} - ${_bottomTopOffset})`)
const isCompactMode = computed(() => isSmartphonePortrait.value || isTabletPortrait.value)
const indicatorWidth = computed(() => isCompactMode.value ? '0.75rem' : '1.75rem')
const upperHeight = computed(() => {
  if (props.mode === 'baseItem'
    || (props.mode === 'mods' && props.isFirst)
  ) {
    return '2.5rem'
  } else if (props.mode === 'mods') {
    return '3.5rem'
  } else if (
    props.isFirst
    && (props.mode === 'content'
      || props.mode === 'magazineContent')) {
    return '1rem'
  } else {
    return '2.25rem'
  }
})

const { isSmartphonePortrait, isTabletPortrait } = WebBrowserUtils.getScreenSize()
</script>










<template>
  <div
    v-show="isVisible"
    class="item-hierarchy-indicator"
  >
    <div class="item-hierarchy-indicator-upper" />
    <div class="item-hierarchy-indicator-middle" />
    <div
      v-show="!isLast"
      class="item-hierarchy-indicator-bottom"
    />
  </div>
</template>









<style scoped>
.item-hierarchy-indicator {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  width: v-bind(indicatorWidth);
}

.item-hierarchy-indicator-bottom {
  border-color: var(--surface-500);
  border-left-style: solid;
  border-width: 1px;
  height: v-bind(bottomHeight);
  margin-left: 50%;
  position: absolute;
  top: v-bind(bottomTop);
  width: 50%;
}

.item-hierarchy-indicator-middle {
  border-color: var(--surface-500);
  border-bottom-left-radius: 12px;
  border-bottom-style: solid;
  border-left-style: solid;
  border-width: 1px;
  flex-shrink: 0;
  height: v-bind(_middleHeight);
  margin-left: 50%;
  width: 50%;
}

.item-hierarchy-indicator-upper {
  border-color: var(--surface-500);
  border-left-style: solid;
  border-width: 1px;
  flex-shrink: 0;
  height: v-bind(upperHeight);
  margin-left: 50%;
  width: 50%;
}
</style>