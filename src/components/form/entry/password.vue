<script setup lang="tsx" name="CEPassword">
import { reactive } from 'vue';

import { EIcon } from '@/enums';
import { CSvgIcon } from '../../svg-icon';
import { PropsPassword } from './interface';

/**
 * Renders a password input component.
 */

const { value = '', placeholder, disabled, onChange, onBlur } = defineProps<PropsPassword>();
const state = reactive({ toggle: true });
</script>

<template>
  <div class="relative">
    <input
      autoComplete="on"
      :defaultValue="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :type="state.toggle ? 'password' : 'text'"
      class="ant-input pr-9"
      @blur="event => onBlur?.(event)"
      @input="event => onChange?.(event)"
    />
    <button type="button" class="icon" @click="() => (state.toggle = !state.toggle)">
      <CSvgIcon :name="state.toggle ? EIcon.EyeSlash : EIcon.Eye" class="icon" />
    </button>
  </div>
</template>
