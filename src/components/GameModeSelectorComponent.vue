<script setup lang="ts">
import { computed } from 'vue'
import Services from '../services/repository/Services'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'

const _websiteConfigurationService = Services.get(WebsiteConfigurationService)

const modelGameMode = defineModel<string>('gameMode')

const props = withDefaults(
  defineProps<{ isEnabled?: boolean }>(),
  {
    isEnabled: true
  })

const gameModes = _websiteConfigurationService.configuration.gameModes
const gameModeUnselectedCursor = computed(() => props.isEnabled ? 'pointer' : 'unset')

/**
 * Selects a game mode.
 * @param gameMode - Game mode.
 */
function selectGameMode(gameMode: string): void {
  if (!props.isEnabled) {
    return
  }

  modelGameMode.value = gameMode
}
</script>










<template>
  <div class="game-mode-selector">
    <span
      v-for="gameMode of gameModes"
      :key="gameMode"
      class="game-mode-selector-option"
      :class="{
        [`game-mode-selector-${gameMode}-selected`]: gameMode === modelGameMode,
        'game-mode-selector-option-unselected': gameMode !== modelGameMode,
        'sidebar-option-disabled': gameMode !== modelGameMode
      }"
      @click="selectGameMode(gameMode)"
    >
      {{ $t(`caption.gameMode_${gameMode}`) }}
    </span>
  </div>
</template>










<style scoped>
.game-mode-selector {
  border-color: var(--surface-700);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  display: flex;
  overflow: hidden;
  width: fit-content;
}

.game-mode-selector-option {
  align-items: center;
  display: flex;
  height: 1.75rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  white-space: nowrap;
}

.game-mode-selector-option + .game-mode-selector-option {
  border-left-color: var(--surface-700);
  border-left-style: solid;
  border-left-width: 1px;
}

.game-mode-selector-option-unselected:hover {
  cursor: v-bind(gameModeUnselectedCursor);
}

.game-mode-selector-pve-selected {
  background-color: var(--success-color5);
  color: var(--success-color);
  font-weight: bolder;
}

.game-mode-selector-pvp-selected {
  background-color: var(--primary-color7);
  color: var(--primary-color);
  font-weight: bolder;
}

.game-mode-selector-pvp-season-selected {
  background-color: var(--warning-color5);
  color: var(--warning-color);
  font-weight: bolder;
}
</style>