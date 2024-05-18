<template>
  <div class="language-selector">
    <div class="language-selector-icon">
      <font-awesome-icon
        icon="language"
        class="icon-before-text"
      />
    </div>
    <span class="language-selector-caption">{{ $t('caption.language') }}</span>
    <div class="language-selector-dropdown language-selector-dropdown-override">
      <Dropdown
        v-model="currentLanguage"
        :options="languages"
        :placeholder="$t('caption.language')"
        @change="setLanguage()"
      >
        <template #option="slotProps">
          <div class="language-selector-item language-selector-option">
            <img
              class="language-selector-item-flag"
              :src="Images['language' + StringUtils.toUpperFirst(slotProps.option)]"
            >
            <span>{{ $t('caption.language_' + slotProps.option) }}</span>
          </div>
        </template>
        <template #value="slotProps">
          <div class="language-selector-item">
            <img
              class="language-selector-item-flag"
              :src="Images['language' + StringUtils.toUpperFirst(slotProps.value)]"
            >
            <span>{{ $t('caption.language_' + slotProps.value) }}</span>
          </div>
        </template>
      </Dropdown>
    </div>
  </div>
</template>

<script lang="ts" src="./LanguageSelectorComponent.ts" />
<style scoped lang="css" src="./LanguageSelectorComponent.css" />
<style lang="css" src="./LanguageSelectorComponent.unscoped.css" />