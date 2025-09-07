<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { IGlobalFilter } from '../../models/utils/IGlobalFilter'
import GameModeService from '../../services/GameModeService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import MerchantFilter from '../MerchantFilterComponent.vue'

defineModel<undefined>('parameters')

const props = defineProps<{ identifier: number }>()

const _gameModeService = Services.get(GameModeService)
const _globalFilterService = Services.get(GlobalFilterService)
const _globalSidebarService = Services.get(GlobalSidebarService)

const isPvp = computed({
  get: () => gameMode.value === 'pvp',
  set: (value: boolean) => {
    gameMode.value = value ? 'pvp' : 'pve'
    _gameModeService.setGameMode(gameMode.value)
  }
})

const gameMode = ref<string>('')
const globalFilter = ref<IGlobalFilter>({
  excludeItemsWithoutMatchingPrice: true,
  excludePresetBaseItems: true,
  merchantFilters: []
})
const hasChanged = ref(false)

onMounted(() => {
  _globalSidebarService.setOnCloseAction(props.identifier, save)
  globalFilter.value = _globalFilterService.get()
  gameMode.value = _gameModeService.getGameMode()
})

/**
 * Saves the global filter and closes the side bar.
 */
function save(): void {
  if (hasChanged.value) {
    _globalFilterService.save(globalFilter.value)
    hasChanged.value = false
  }
}
</script>










<template>
  <!-- Game mode -->
  <div class="sidebar-option">
    <span :class="{ 'sidebar-option-disabled': globalFilter.excludeItemsWithoutMatchingPrice }">
      {{ $t('caption.gameMode_pve') }}
    </span>
    <InputSwitch v-model="isPvp" />
    <span :class="{ 'sidebar-option-disabled': globalFilter.excludeItemsWithoutMatchingPrice }">
      {{ $t('caption.gameMode_pvp') }}
    </span>
  </div>
  <div class="sidebar-option-description">
    <div class="sidebar-option-icon">
      <font-awesome-icon icon="info-circle" />
    </div>
    <span>
      {{ $t('message.gameModeExplanation') }}
    </span>
  </div>
  <!-- Exclude items without matching prices -->
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="clipboard-list" />
    </div>
    <span>{{ $t('caption.items') }}</span>
  </div>
  <div
    class="sidebar-option"
    :class="{ 'sidebar-option-disabled': globalFilter.excludeItemsWithoutMatchingPrice }"
  >
    <div class="sidebar-option-icon">
      <Checkbox
        v-model="globalFilter.excludeItemsWithoutMatchingPrice"
        :binary="true"
        :false-value="true"
        :true-value="false"
        @update:model-value="() => hasChanged = true"
      />
    </div>
    <div
      style="cursor: pointer;"
      @click="() => {
        globalFilter.excludeItemsWithoutMatchingPrice = !globalFilter.excludeItemsWithoutMatchingPrice
        hasChanged = true
      }"
    >
      {{ $t('caption.showItemsWithoutMatchingPrice') }}
    </div>
  </div>
  <div class="sidebar-option-description">
    <div class="sidebar-option-icon">
      <font-awesome-icon icon="info-circle" />
    </div>
    <span>
      {{ $t('message.showItemsWithoutMatchingPriceExplanation') }}
    </span>
  </div>
  <!-- Exclude preset base item -->
  <div
    class="sidebar-option"
    :class="{ 'sidebar-option-disabled': globalFilter.excludePresetBaseItems }"
  >
    <div class="sidebar-option-icon">
      <Checkbox
        v-model="globalFilter.excludePresetBaseItems"
        :binary="true"
        :false-value="true"
        :true-value="false"
        @update:model-value="() => hasChanged = true"
      />
    </div>
    <div
      style="cursor: pointer;"
      @click="() => {
        globalFilter.excludePresetBaseItems = !globalFilter.excludePresetBaseItems
        hasChanged = true
      }"
    >
      {{ $t('caption.showPresetBaseItems') }}
    </div>
  </div>
  <!-- Merchants  -->
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="user-tag" />
    </div>
    <span>{{ $t('caption.merchants') }}</span>
  </div>
  <div class="sidebar-option">
    <MerchantFilter
      v-model:merchant-filters="globalFilter.merchantFilters"
      @update:merchant-filters="() => hasChanged = true"
    />
  </div>
</template>

<style scoped></style>