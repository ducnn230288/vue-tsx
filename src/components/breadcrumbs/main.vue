<script setup lang="tsx" name="CBreadcrumbs">
import { EIcon } from '@/enums';
import { CSvgIcon } from '../svg-icon';
import type Props from './interface';

const { title, list } = defineProps<Props>();
</script>
<template>
  <div class="wrapper-flex">
    <h2 class="-intro-x">{{ title }}</h2>
    <div class="intro-x breadcrumbs">
      <ul v-if="list">
        <li>
          <CSvgIcon :name="EIcon.Home" />
        </li>
        <li v-for="item in list" :key="item"><CSvgIcon :name="EIcon.Arrow" :size="8" />{{ item }}</li>
      </ul>
    </div>
  </div>
</template>
