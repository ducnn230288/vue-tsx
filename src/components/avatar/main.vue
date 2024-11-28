<script setup lang="tsx" name="CAvatar">
import { Popover } from 'ant-design-vue';

import Avatar from './avatar.vue';
import type { PropsObject } from './interface';

const {
  text,
  src,
  size = 20,
  showName = true,
  keySrc = 'avatarPath',
  keyName = 'fullName',
  maxCount = 4,
  index = 0,
} = defineProps<PropsObject>();
</script>
<template>
  <Avatar v-if="typeof text !== 'object'" :text="text" :src="src" :showName="showName" :size="size" :index="index" />
  <div v-else class="flex items-center">
    <Avatar
      v-for="(item, index) in text.filter((_, index: number) => index < maxCount)"
      :showName="false"
      :text="item[keyName]"
      :src="item[keySrc]"
      :size="size"
      :index="index"
      :key="'avatar' + index"
    />
    <Popover>
      <template #content>
        <Avatar
          v-for="(item, index) in text.filter((_, index: number) => index >= maxCount)"
          :showName="true"
          :text="item[keyName]"
          :src="item[keySrc]"
          :size="size"
          :index="index"
          :key="'avatar' + index"
        />
      </template>
      <div
        :style="{ height: size, width: size }"
        class="-ml-2 inline-block rounded-xl border border-primary bg-primary/30 text-center text-xs text-primary"
      >
        +{{ text.length - maxCount }}
      </div>
    </Popover>
  </div>
</template>
