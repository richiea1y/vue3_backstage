<template>
  <div class="main-layout">
    <div class="main">
      <Navigator />
      <div class="page">
        <ToolBar />
        <router-view :key="route.path" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import ToolBar from '@/components/common/navigator/ToolBar.vue';
import Navigator from '@/components/common/navigator/Navigator.vue';
import { useNavigatorStore } from '@/stores/navigator';
import { useRoute } from 'vue-router';

const navStore = useNavigatorStore();
const route = useRoute();

// const navCollapsed = computed(() => navStore.navToggleStatus);
</script>
