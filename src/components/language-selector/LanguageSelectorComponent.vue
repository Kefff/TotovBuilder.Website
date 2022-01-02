<template>
  <div class="language-selector">
    <font-awesome-icon
      icon="language"
      class="icon-before-text"
    />
    <span class="language-selector-caption">{{ $t('caption.language') }}</span>
    <div class="language-selector-dropdown language-selector-dropdown-override">
      <Dropdown
        v-model="currentLanguage"
        :options="languages"
        :placeholder="$t('caption.language')"
        @change="setLanguage($event.value)"
      >
        <template #option="slotProps">
          <div class="language-selector-item">
            <img
              class="language-selector-item-flag"
              :src="'/assets/language_' + slotProps.option + '.webp'"
            >
            <span>{{ $t('caption.language_' + slotProps.option) }}</span>
          </div>
        </template>
        <template #value="slotProps">
          <div class="language-selector-item">
            <img
              class="language-selector-item-flag"
              :src="'/assets/language_' + slotProps.value + '.webp'"
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