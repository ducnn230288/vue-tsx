<script setup lang="tsx">
import { ref } from 'vue';
import { OTPInput, type SlotProps } from 'vue-input-otp';
import type { PropsOtp } from './interface';

const { onChange } = defineProps<PropsOtp>();

const Slot = (props: SlotProps) => (
  <div class={['input', { active: props.isActive }]}>
    <div class='group-has-[input[data-input-otp-placeholder-shown]]:opacity-20'>{props.char ?? ''}</div>
    {props.hasFakeCaret && <FakeCaret />}
  </div>
);

// You can emulate a fake textbox caret!
const FakeCaret = () => (
  <div class='fake-caret'>
    <div />
  </div>
);

// Inspired by Stripe's MFA input.
const FakeDash = () => (
  <div class='fake-dash'>
    <div />
  </div>
);
const refFirstLoad = ref(false);
setTimeout(() => {
  refFirstLoad.value = true;
}, 100);
</script>
<template>
  <OTPInput
    v-slot="{ slots }"
    :maxlength="6"
    container-class="c-otp"
    @input="event => refFirstLoad && onChange?.(event)"
  >
    <div class="flex">
      <component :is="Slot" v-for="(slot, idx) in slots.slice(0, 3)" v-bind="slot" :key="idx" />
    </div>

    <component :is="FakeDash" />

    <div class="flex">
      <component :is="Slot" v-for="(slot, idx) in slots.slice(3)" v-bind="slot" :key="idx" />
    </div>
  </OTPInput>
</template>
