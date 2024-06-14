<template>
  <div class="loading">
    <div
      class="loading-container"
      :style="containerStyle"
    >
      <div
        class="loading-icon"
        :style="loadingIconStyle"
      >
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
    <div />
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    scale: number
  }>(),
  {
    scale: 1
  })

const containerStyle = computed(() => `height: ${80 * props.scale}px; width: ${80 * props.scale}px`)
const loadingIconStyle = computed(() => `scale: ${props.scale}`)

</script>










<style scoped>
.loading {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
}

.loading-container {
  align-items: center;
  display: flex;
  justify-content: center;
}

.loading-icon {
  height: 80px;
  width: 80px;
  position: absolute;
}

.loading-icon div {
  animation: loading-icon 1.2s linear infinite;
  background-color: var(--text-color);
  border-radius: 50%;
  height: 6px;
  position: absolute;
  width: 6px;
}

.loading-icon div:nth-child(1) {
  animation-delay: 0s;
  left: 66px;
  top: 37px;
}

.loading-icon div:nth-child(2) {
  animation-delay: -0.1s;
  left: 62px;
  top: 22px;
}

.loading-icon div:nth-child(3) {
  animation-delay: -0.2s;
  left: 52px;
  top: 11px;
}

.loading-icon div:nth-child(4) {
  animation-delay: -0.3s;
  left: 37px;
  top: 7px;
}

.loading-icon div:nth-child(5) {
  animation-delay: -0.4s;
  left: 22px;
  top: 11px;
}

.loading-icon div:nth-child(6) {
  animation-delay: -0.5s;
  left: 11px;
  top: 22px;
}

.loading-icon div:nth-child(7) {
  animation-delay: -0.6s;
  left: 7px;
  top: 37px;
}

.loading-icon div:nth-child(8) {
  animation-delay: -0.7s;
  left: 11px;
  top: 52px;
}

.loading-icon div:nth-child(9) {
  animation-delay: -0.8s;
  left: 22px;
  top: 62px;
}

.loading-icon div:nth-child(10) {
  animation-delay: -0.9s;
  left: 37px;
  top: 66px;
}

.loading-icon div:nth-child(11) {
  animation-delay: -1s;
  left: 52px;
  top: 62px;
}

.loading-icon div:nth-child(12) {
  animation-delay: -1.1s;
  left: 62px;
  top: 52px;
}

@keyframes loading-icon {

  0% {
    background: var(--primary-color);
    transform: scale(1.5);
  }

  100% {
    transform: scale(0.5);
  }
}
</style>