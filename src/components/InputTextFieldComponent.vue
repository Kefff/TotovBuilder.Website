<template>
  <div :class="'p-field field input-text-field input-text-field-required-message-' + requiredMessagePosition">
    <label v-if="!captionAsPlaceholder">{{ caption }}</label>
    <InputText
      v-model="modelValue"
      :class="invalid ? 'p-invalid' : ''"
      :disabled="readOnly"
      :placeholder="captionAsPlaceholder ? caption : undefined"
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
    captionMode: 'caption' | 'placeholder',
    readOnly?: boolean,
    required: boolean,
    requiredMessagePosition?: 'bottom' | 'right'
  }>(),
  {
    caption: '',
    captionMode: 'caption',
    readOnly: false,
    required: false,
    requiredMessagePosition: 'bottom'
  })

const captionAsPlaceholder = computed(() => props.captionMode === 'placeholder')
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
  height: 3.25rem;
  min-width: 20rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  width: 100%;
}
</style>