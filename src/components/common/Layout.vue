<template>
  <div class="content">
    <div class="px-3">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
</script>
