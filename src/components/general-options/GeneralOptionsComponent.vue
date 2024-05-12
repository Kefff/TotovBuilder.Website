<template>
  <slot name="button">
    <Button
      v-tooltip.top="$t('caption.options')"
      class="p-button-text p-button-sm button-discreet"
      @click="display()"
    >
      <font-awesome-icon icon="cog" />
    </Button>
  </slot>

  <Sidebar
    v-model:visible="sidebarVisible"
    position="right"
    style="width: auto"
  >
    <!-- Display options -->
    <template #header>
      <div class="sidebar-title">
        <div class="sidebar-title-icon">
          <font-awesome-icon icon="tv" />
        </div>
        <span>{{ $t('caption.displayOptions') }}</span>
      </div>
    </template>
    <div class="sidebar-option">
      <LanguageSelector />
    </div>
    <slot name="additional-display-options" />

    <!-- General options -->
    <div class="sidebar-title">
      <div class="sidebar-title-icon">
        <font-awesome-icon icon="cog" />
      </div>
      <span>{{ $t('caption.generalOptions') }}</span>
    </div>
    <div class="sidebar-option">
      <div class="general-options-cookies">
        <Checkbox
          v-model="allowCookies"
          v-tooltip.top="StringUtils.getCheckboxStateTooltip(allowCookies)"
          :binary="true"
          @change="onAllowCookiesChanged()"
        />
        <div
          v-tooltip.top="$t('caption.cookiesExplanation')"
          :class="'general-options-name' + (!allowCookies ? ' general-options-disabled-text' : '')"
          @click="toggleAllowCookies()"
        >
          {{ $t('caption.allowCookies') }}
        </div>
      </div>
    </div>
    <slot name="additional-general-options" />
  </Sidebar>
</template>

<script lang="ts" src="./GeneralOptionsComponent.ts" />
<style scoped lang="css" src="./GeneralOptionsComponent.css" />