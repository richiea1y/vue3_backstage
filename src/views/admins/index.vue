<template>
  <AdminsLayout>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </AdminsLayout>
</template>

<script setup>
import AdminsLayout from '@/components/common/Layout.vue';
</script>
