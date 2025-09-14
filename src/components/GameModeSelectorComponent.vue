<script setup lang="ts">
import { computed } from 'vue'

const modelGameMode = defineModel<string>('gameMode')

const props = withDefaults(
  defineProps<{ isEnabled?: boolean }>(),
  {
    isEnabled: true
  })

const gameModeUnselectedTextCursor = computed(() => props.isEnabled ? 'pointer' : 'unset')
const isPvp = computed({
  get: () => modelGameMode.value === 'pvp',
  set: (value: boolean) => {
    modelGameMode.value = value ? 'pvp' : 'pve'
  }
})

/**
 * Toggles the game mode.
 * @param gameModeSwitch - Type of switch that toggles the game mode.
 */
function toggleGameMode(gameModeSwitch: 'pve' | 'pvp'): void {
  if (gameModeSwitch === 'pve' && !isPvp.value || gameModeSwitch === 'pvp' && isPvp.value) {
    return
  }

  if (props.isEnabled) {
    isPvp.value = !isPvp.value
  }
}
</script>










<template>
  <div class="game-mode-selector">
    <span
      :class="{ 'game-mode-selector-pve-selected': !isPvp, 'game-mode-selector-caption-unselected': isPvp, 'sidebar-option-disabled': isPvp }"
      @click="toggleGameMode('pve')"
    >
      {{ $t('caption.gameMode_pve') }}
    </span>
    <div class="game-mode-selector">
      <InputSwitch
        v-model="isPvp"
        :disabled="!isEnabled"
        class="game-mode-selector-input"
        :class="{
          'game-mode-selector-input-pve': !isPvp,
          'game-mode-selector-input-pvp': isPvp
        }"
      />
    </div>
    <span
      :class="{ 'game-mode-selector-pvp-selected': isPvp, 'game-mode-selector-caption-unselected': !isPvp, 'sidebar-option-disabled': !isPvp }"
      @click=" toggleGameMode('pvp')"
    >
      {{ $t('caption.gameMode_pvp') }}
    </span>
  </div>
</template>










<style scoped>
.game-mode-selector {
  align-items: center;
  display: flex;
  gap: 1rem;
}

.game-mode-selector {
  height: 1.75rem;
}

.game-mode-selector-caption-unselected:hover {
  cursor: v-bind(gameModeUnselectedTextCursor);
}

.game-mode-selector-pve-selected {
  color: var(--success-color);
  font-weight: bolder;
}

.game-mode-selector-pvp-selected {
  color: var(--primary-color);
  font-weight: bolder;
}
</style>

<style>
.game-mode-selector-input .p-inputswitch-slider {
  border-style: none;
}

.game-mode-selector-input.p-inputswitch:not(.p-disabled):hover .p-inputswitch-slider::before,
.game-mode-selector-input.p-inputswitch .p-inputswitch-slider::before {
  box-shadow: none;
}

.game-mode-selector-input.game-mode-selector-input-pve .p-inputswitch-slider,
.game-mode-selector-input.game-mode-selector-input-pve .p-inputswitch-slider:hover {
  background: linear-gradient(90deg, rgba(76, 175, 80, 0.76) 0%, rgba(76, 175, 80, 0.76) 50%, rgba(255, 255, 255, 0.3) 100%);
}

.game-mode-selector-input.game-mode-selector-input-pve .p-inputswitch-slider::before {
  background: var(--success-color);
}

.game-mode-selector-input.game-mode-selector-input-pvp .p-inputswitch-slider,
.game-mode-selector-input.game-mode-selector-input-pvp .p-inputswitch-slider:hover,
.game-mode-selector-input.game-mode-selector-input-pvp.p-inputswitch.p-inputswitch-checked:not(.p-disabled):hover .p-inputswitch-slider {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.3) 0%, rgba(33, 150, 243, 0.76) 50%, rgba(33, 150, 243, 0.76) 100%);
}
</style>