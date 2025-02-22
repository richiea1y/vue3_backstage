<template>
  <el-sub-menu v-if="item.children" :index="item.index">
    <template #title>
      <el-icon>
        <component :is="item.icon" />
      </el-icon>
      <span class="w-full">{{ item.title }}</span>
    </template>
    <MenuItem v-for="child in item.children" :key="child.index" :item="child" class="terminate-child-menu" />
  </el-sub-menu>
  <el-menu-item v-else :index="item.index" :disabled="item.disabled" @click="handleClick">
    <el-icon>
      <component :is="item.icon" />
    </el-icon>
    <span class="w-full">{{ item.title }}</span>
  </el-menu-item>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const handleClick = () => {
  router.push(props.item.path);
};
</script>
