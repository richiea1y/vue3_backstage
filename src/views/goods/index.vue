<template>
  <GoodsLayout>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </GoodsLayout>
</template>

<script setup>
import GoodsLayout from '@/components/common/Layout.vue';
</script>
