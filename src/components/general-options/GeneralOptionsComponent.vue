<template>
  <Button
    v-tooltip.top="$t('caption.otherOptions')"
    class="p-button-text p-button-sm button-discreet"
    @click="sidebarVisible = true"
  >
    <font-awesome-icon icon="cog" />
  </Button>

  <Sidebar
    v-model:visible="sidebarVisible"
    position="right"
    style="width: auto"
  >
    <div class="sidebar-title">
      <font-awesome-icon
        icon="cog"
        class="icon-before-text"
      />
      <span>{{ $t('caption.otherOptions') }}</span>
    </div>
    <div class="sidebar-option">
      <div class="general-options-option">
        <Checkbox
          v-model="allowCookies"
          v-tooltip.top="StringUtils.getCheckboxStateTooltip(allowCookies)"
          :binary="true"
          @change="onAllowCookiesChanged()"
        />
        <div
          :class="'general-options-name' + (!allowCookies ? ' general-options-disabled-text' : '')"
          @click="toggleAllowCookies()"
        >
          {{ $t('caption.allowCookies') }}
        </div>
      </div>
    </div>
    <slot name="additional-options" />
  </Sidebar>
</template>

<script lang="ts" src="./GeneralOptionsComponent.ts" />
<style scoped lang="css" src="./GeneralOptionsComponent.css" />