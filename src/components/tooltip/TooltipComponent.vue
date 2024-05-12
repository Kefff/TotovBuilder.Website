<template>
  <span
    v-tooltip:[directiveArguments]="tooltip"
    class="tooltip"
    :tabindex="isTouchScreen ? 9999 : undefined"
  >
    <slot />
  </span>
</template>

<script lang="ts" src="./TooltipComponent.ts" />
<style scoped lang="css" src="./TooltipComponent.css" />