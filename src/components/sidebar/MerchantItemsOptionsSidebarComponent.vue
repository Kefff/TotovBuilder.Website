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
  <div class="sidebar-option merchant-items-options-game-mode">
    <span :class="{ 'merchant-items-options-game-mode-pve-selected': !isPvp, 'sidebar-option-disabled': isPvp }">
      {{ $t('caption.gameMode_pve') }}
    </span>
    <div class="merchant-items-options-game-mode">
      <InputSwitch
        v-model="isPvp"
        class="merchant-items-options-game-mode-input"
        :class="{ 'merchant-items-options-game-mode-input-pve': !isPvp, 'merchant-items-options-game-mode-input-pvp': isPvp }"
      />
    </div>
    <span :class="{ 'merchant-items-options-game-mode-pvp-selected': isPvp, 'sidebar-option-disabled': !isPvp }">
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

<style scoped>
.merchant-items-options-game-mode {
  align-items: center;
  display: flex;
  gap: 1rem;
}

.merchant-items-options-game-mode {
  height: 1.75rem;
}

.merchant-items-options-game-mode-pve-selected {
  color: var(--success-color);
  font-weight: bolder;
}

.merchant-items-options-game-mode-pvp-selected {
  color: var(--primary-color);
  font-weight: bolder;
}
</style>

<style>
.merchant-items-options-game-mode-input .p-inputswitch-slider {
  border-style: none;
}

.merchant-items-options-game-mode-input.p-inputswitch:not(.p-disabled):hover .p-inputswitch-slider::before,
.merchant-items-options-game-mode-input.p-inputswitch .p-inputswitch-slider::before {
  box-shadow: none;
}

.merchant-items-options-game-mode-input.merchant-items-options-game-mode-input-pve .p-inputswitch-slider,
.merchant-items-options-game-mode-input.merchant-items-options-game-mode-input-pve .p-inputswitch-slider:hover {
  background: linear-gradient(90deg, rgba(76, 175, 80, 0.76) 0%, rgba(76, 175, 80, 0.76) 50%, rgba(255, 255, 255, 0.3) 100%);
}

.merchant-items-options-game-mode-input.merchant-items-options-game-mode-input-pve .p-inputswitch-slider::before {
  background: var(--success-color);
}

.merchant-items-options-game-mode-input.merchant-items-options-game-mode-input-pvp .p-inputswitch-slider,
.merchant-items-options-game-mode-input.merchant-items-options-game-mode-input-pvp .p-inputswitch-slider:hover,
.merchant-items-options-game-mode-input.merchant-items-options-game-mode-input-pvp.p-inputswitch.p-inputswitch-checked:not(.p-disabled):hover .p-inputswitch-slider {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(33, 150, 243, 0.76) 50%, rgba(33, 150, 243, 0.76) 100%);
}
</style>