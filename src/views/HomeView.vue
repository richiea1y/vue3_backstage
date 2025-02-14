<template>
  <div class="main-layout">
    <div class="main">
      <div class="bg-slate-600">
        <img src="@/assets/img/usagi.gif" class="p-6" />
      </div>
      <div class="page">
        <router-view :key="route.path" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
