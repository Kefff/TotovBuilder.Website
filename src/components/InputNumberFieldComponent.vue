<script setup lang="ts">
import { computed, nextTick, onMounted, useTemplateRef } from 'vue'

const modelValue = defineModel<number>('value')

const props = withDefaults(
  defineProps<{
    autofocus?: boolean,
    caption?: string,
    captionMode: 'caption' | 'placeholder',
    max?: number,
    min?: number,
    readOnly?: boolean,
    required: boolean,
    requiredMessagePosition?: 'bottom' | 'right'
  }>(),
  {
    autofocus: false,
    caption: '',
    captionMode: 'caption',
    max: undefined,
    min: 0,
    readOnly: false,
    required: false,
    requiredMessagePosition: 'bottom'
  })

const input = useTemplateRef('input')

const captionAsPlaceholder = computed(() => props.captionMode === 'placeholder')
const invalid = computed(() => props.required && modelValue.value == null)

onMounted(() => {
  if (props.autofocus) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = (input.value as any)?.$refs.input.$el // Cast as any needed otherwise $input is considered to not exist while it does

    if (element != null) {
      nextTick(() => element.select()) // nextTick required for the focus to work in sidebars
    }
  }
})
</script>










<template>
  <div :class="'p-field input-number-field input-number-field-required-message-' + requiredMessagePosition">
    <label v-if="!captionAsPlaceholder">{{ caption }}</label>
    <InputNumber
      ref="input"
      v-model="modelValue"
      :class="invalid ? 'p-invalid' : ''"
      :disabled="readOnly"
      :max="max"
      :min="min"
      :placeholder="captionAsPlaceholder ? caption : undefined"
      :step="1"
      button-layout="horizontal"
      decrement-button-icon="pi pi-minus"
      increment-button-icon="pi pi-plus"
      show-buttons
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
  height: 2.75rem;
}

.input-number-field input {
  padding: 0.25rem;
  text-align: center;
  width: 100%;
}
</style>