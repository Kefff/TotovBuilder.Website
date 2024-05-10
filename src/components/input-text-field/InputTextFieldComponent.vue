<template>
  <div :class="'p-field field input-text-field required-message-' + requiredMessagePosition">
    <label v-if="!captionAsPlaceholder">{{ caption }}</label>
    <InputText
      v-model="valueInternal"
      :class="invalid ? 'p-invalid' : ''"
      :disabled="readOnly"
      :placeholder="captionAsPlaceholder ? caption : undefined"
    />
    <span
      v-if="invalid"
      class="p-error"
    >
      {{ $t('message.requiredField', { caption }) }}
    </span>
  </div>
</template>

<script lang="ts" src="./InputTextFieldComponent.ts" />
<style scoped lang="css" src="./InputTextFieldComponent.css" />
<style lang="css" src="./InputTextFieldComponent.unscoped.css" />