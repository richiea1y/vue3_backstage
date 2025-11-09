<template>
  <MembersLayout>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </MembersLayout>
</template>

<script setup>
import MembersLayout from '@/components/common/Layout.vue';
</script>
