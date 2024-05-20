<script setup lang="ts">
import { computed } from 'vue'

const modelValue = defineModel<number>('value')

const props = withDefaults(
  defineProps<{
    caption?: string,
    captionMode: 'caption' | 'placeholder',
    max?: number,
    min?: number,
    readOnly?: boolean,
    required: boolean,
    requiredMessagePosition?: 'bottom' | 'right'
  }>(),
  {
    caption: '',
    captionMode: 'caption',
    max: undefined,
    min: 0,
    readOnly: false,
    required: false,
    requiredMessagePosition: 'bottom'
  })

const captionAsPlaceholder = computed(() => props.captionMode === 'placeholder')
const invalid = computed(() => props.required && modelValue.value == null)
</script>












<template>
  <div :class="'p-field input-number-field input-number-field-required-message-' + requiredMessagePosition">
    <label v-if="!captionAsPlaceholder">{{ caption }}</label>
    <InputNumber
      v-model="modelValue"
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
    <div
      v-if="invalid"
      class="'p-error"
    >
      {{ $t('message.requiredField', { caption }) }}
    </div>
  </div>
</template>












<style scoped>
.input-number-field-required-message-bottom {
  font-size: 0.85rem;
  display: block;
}

.input-number-field-required-message-right {
  align-items: center;
  display: flex;
  font-size: 0.85rem;
}

.input-number-field-required-message-right > span {
  margin-left: 0.5rem;
  width: 100%;
}
</style>



<style>
.input-number-field .p-inputnumber {
  height: 3.25rem;
}

.input-number-field input {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  text-align: center;
  width: 100%;
}
</style>