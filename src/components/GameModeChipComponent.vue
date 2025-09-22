<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import GameModeService from '../services/GameModeService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import Tooltip from './TooltipComponent.vue'

const _gameModeService = Services.get(GameModeService)
const _globalSidebarService = Services.get(GlobalSidebarService)

const props = withDefaults(
  defineProps<{ isEditingBuild?: boolean }>(),
  {
    isEditingBuild: false
  })

const gameMode = ref(_gameModeService.getGameMode())

onMounted(() => {
  _gameModeService.emitter.on(GameModeService.gameModeChangedEvent, getGameMode)
})

onUnmounted(() => {
  _gameModeService.emitter.off(GameModeService.gameModeChangedEvent, getGameMode)
})

/**
 * Gets the current game mode.
 */
function getGameMode(): void {
  gameMode.value = _gameModeService.getGameMode()
}

/**
 * Opens the global filter sidebar.
 */
function showGlobalFilterSidebar(): void {
  _globalSidebarService.display({
    displayedComponentType: 'MerchantItemsOptionsSidebar',
    displayedComponentParameters: {
      isGameModeInputEnabled: !props.isEditingBuild
    }
  })
}
</script>










<template>
  <Chip class="game-mode-chip">
    <Tooltip
      class="game-mode-chip-container"
      :disabled-on-mobile="true"
      :full-size="true"
      :tooltip="$t('caption.gameMode') + ' : ' + $t(`caption.gameMode_${gameMode}`)"
      style="height: 100%;"
      @click="showGlobalFilterSidebar"
    >
      <div class="game-mode-chip-icon">
        <font-awesome-icon icon="gamepad" />
      </div>
      <div
        class="game-mode-chip-text"
        :class="{
          'game-mode-chip-text-pve': gameMode === 'pve',
          'game-mode-chip-text-pvp': gameMode === 'pvp',
        }"
      >
        {{ $t(`caption.gameMode_${gameMode}`) }}
      </div>
    </Tooltip>
  </Chip>
</template>










<style scoped>
.game-mode-chip {
  background-color: var(--surface-300);
  border-color: var(--primary-color3);
  border-style: solid;
  border-width: 1px;
  height: 100%;
  min-height: 2.5rem;
  overflow: hidden;
  padding: 0rem;
}

.game-mode-chip:hover {
  cursor: pointer;
}

.game-mode-chip-icon {
  align-items: center;
  display: flex;
  height: 100%;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.game-mode-chip-container {
  align-items: center;
  display: flex;
}

.game-mode-chip-text {
  margin-right: 0.5rem;
  font-weight: bolder;
}

.game-mode-chip-text-pve {
  color: var(--success-color);
}

.game-mode-chip-text-pvp {
  color: var(--primary-color);
}
</style>