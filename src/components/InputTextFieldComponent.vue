<script setup lang="ts">
import { computed, nextTick, onMounted, useTemplateRef } from 'vue'

const modelValue = defineModel<string>('value')

const props = withDefaults(
  defineProps<{
    autofocus?: boolean,
    caption?: string,
    captionMode?: 'caption' | 'placeholder',
    centered?: boolean,
    disabled?: boolean,
    readOnly?: boolean,
    required?: boolean,
    requiredMessagePosition?: 'bottom' | 'right'
  }>(),
  {
    autofocus: false,
    caption: '',
    captionMode: 'caption',
    centered: false,
    disabled: false,
    readOnly: false,
    required: false,
    requiredMessagePosition: 'bottom'
  })

const input = useTemplateRef('input')

const captionAsPlaceholder = computed(() => props.captionMode === 'placeholder')
const inputClasses = computed(() => ({
  'input-text-field-centered': props.centered,
  'p-invalid': invalid.value
}))
const invalid = computed(() => props.required && (modelValue.value == null || modelValue.value === ''))

onMounted(() => {
  if (props.autofocus) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = (input.value as any)?.$el // Cast as any needed otherwise $el is considered to not exist while it does

    if (element != null) {
      nextTick(() => element.select()) // nextTick required for the focus to work in sidebars
    }
  }
})
</script>










<template>
  <div :class="`p-field field input-text-field input-text-field-required-message-${requiredMessagePosition}`">
    <label v-if="!captionAsPlaceholder">{{ caption }}</label>
    <InputText
      ref="input"
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










<style scoped>
.input-text-field-required-message-bottom {
  display: block;
  font-size: 0.85rem;
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