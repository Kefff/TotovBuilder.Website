<template>
  <div :class="'p-field input-number-field required-message-' + requiredMessagePosition">
    <label v-if="!captionAsPlaceholder">{{ caption }}</label>
    <InputNumber
      v-model="value"
      button-layout="horizontal"
      :class="invalid ? 'p-invalid' : ''"
      decrement-button-icon="pi pi-minus"
      :disabled="readOnly"
      increment-button-icon="pi pi-plus"
      :min="min"
      :max="max"
      :placeholder="captionAsPlaceholder ? caption : undefined"
      show-buttons
      :step="1"
    />
    <span
      v-if="invalid"
      class="'p-error"
    >
      {{ $t('message.requiredField', { caption }) }}
    </span>
  </div>
</template>

<script lang="ts" src="./InputNumberFieldComponent.ts" />
<style scoped lang="css" src="./InputNumberFieldComponent.css" />
<style lang="css" src="./InputNumberFieldComponent.unscoped.css" />