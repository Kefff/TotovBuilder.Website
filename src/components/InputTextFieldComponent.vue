<template>
  <div :class="'p-field field input-text-field input-text-field-required-message-' + requiredMessagePosition">
    <label v-if="!captionAsPlaceholder">{{ caption }}</label>
    <InputText
      v-model="modelValue"
      :class="inputClasses"
      :disabled="disabled"
      :placeholder="captionAsPlaceholder ? caption : undefined"
      :readonly="readOnly"
    />
    <div
      v-if="invalid"
      class="p-error"
    >
      {{ $t('message.requiredField', { caption }) }}
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'

const modelValue = defineModel<string>('value')

const props = withDefaults(
  defineProps<{
    caption?: string,
    captionMode?: 'caption' | 'placeholder',
    centered?: boolean,
    disabled?: boolean,
    readOnly?: boolean,
    required?: boolean,
    requiredMessagePosition?: 'bottom' | 'right'
  }>(),
  {
    caption: '',
    captionMode: 'caption',
    centered: false,
    disabled: false,
    readOnly: false,
    required: false,
    requiredMessagePosition: 'bottom'
  })

const captionAsPlaceholder = computed(() => props.captionMode === 'placeholder')
const inputClasses = computed(() => ({
  'input-text-field-centered': props.centered,
  'p-invalid': invalid.value
}))
const invalid = computed(() => props.required && (modelValue.value == null || modelValue.value === ''))
</script>










<style scoped>
.input-text-field-required-message-bottom {
  font-size: 0.85rem;
  display: block;
}

.input-text-field-required-message-right {
  align-items: center;
  display: flex;
  font-size: 0.85rem;
}

.input-text-field-required-message-right > span {
  margin-left: 0.5rem;
  width: 100%;
}
</style>

<style>
.input-text-field input {
  height: 2.75rem;
  padding: 0.25rem;
  width: 100%;
}

.input-text-field-centered {
  text-align: center;
}
</style>