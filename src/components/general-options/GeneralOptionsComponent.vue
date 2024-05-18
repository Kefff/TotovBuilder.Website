<template>
  <!-- Display options -->
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="tv" />
    </div>
    <span>{{ $t('caption.displayOptions') }}</span>
  </div>
  <div class="sidebar-option">
    <LanguageSelector />
  </div>
  <div
    v-for="(additionalDisplayOption, index) of additionalDisplayOptions"
    :key="index"
    :class="getAdditionalOptionCssClasses(additionalDisplayOption)"
    @click="additionalDisplayOption.onClick()"
  >
    <div class="sidebar-option-icon">
      <font-awesome-icon :icon="additionalDisplayOption.icon" />
    </div>
    <div>{{ $t(additionalDisplayOption.caption) }}</div>
  </div>

  <!-- General options -->
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="cog" />
    </div>
    <span>{{ $t('caption.generalOptions') }}</span>
  </div>
  <div class="sidebar-option">
    <!-- <div class="general-options-cookies"> -->
    <div class="sidebar-option-icon">
      <Checkbox
        v-model="allowCookies"
        v-tooltip.top="StringUtils.getCheckboxStateTooltip(allowCookies)"
        :binary="true"
        @change="onAllowCookiesChanged()"
      />
    </div>
    <div
      v-tooltip.top="$t('caption.cookiesExplanation')"
      class="general-options-name"
      :class="!allowCookies ? ' general-options-disabled-text' : ''"
      @click="toggleAllowCookies()"
    >
      {{ $t('caption.allowCookies') }}
    </div>
    <!-- </div> -->
  </div>
  <div
    v-for="(additionalGeneralOption, index) of additionalGeneralOptions"
    :key="index"
    :class="getAdditionalOptionCssClasses(additionalGeneralOption)"
    @click="additionalGeneralOption.onClick()"
  >
    <div class="sidebar-option-icon">
      <font-awesome-icon :icon="additionalGeneralOption.icon" />
      <span>{{ $t(additionalGeneralOption.caption) }}</span>
    </div>
  </div>

  <!-- Additional option groups -->
  <div
    v-for="additionalOptionsGroup of additionalsOptionGroups"
    :key="additionalOptionsGroup.name"
    class="general-options-addition-group"
  >
    <div class="sidebar-title">
      <div class="sidebar-title-icon">
        <font-awesome-icon :icon="additionalOptionsGroup.icon" />
      </div>
      <span>{{ $t(additionalOptionsGroup.caption) }}</span>
    </div>
    <div
      v-for="(additionalOption, index) of additionalOptionsGroup.options"
      :key="index"
      :class="getAdditionalOptionCssClasses(additionalOption)"
      @click="additionalOption.onClick()"
    >
      <div>
        <div class="sidebar-option-icon">
          <font-awesome-icon
            :icon="additionalOption.icon"
            class="icon-before-text"
          />
        </div>
        <span>{{ $t(additionalOption.caption) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./GeneralOptionsComponent.ts" />
<style scoped lang="css" src="./GeneralOptionsComponent.css" />