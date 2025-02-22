<template>
  <div class="navigator-block">
    <el-menu
      background-color="#fff"
      class="navigator"
      :collapse="navStore.getStorageNavigatorToggle"
      style="height: 100%"
      text-color="#333"
      active-text-color="#3f9eff"
      unique-opened
      @open="handleOpen"
      @close="handleClose"
    >
      <!-- 使用 MenuItem 遞迴組件來渲染 menu -->
      <MenuItem v-for="item in menuItems" :key="item.index" :item="item" />
    </el-menu>
  </div>
</template>

<script setup>
import { onMounted, reactive, computed, ref } from 'vue';
import MenuItem from './MenuItem.vue';
import { useNavigatorStore } from '@/stores/navigator';
import { useRouter } from 'vue-router';

const props = defineProps({
  isOpened: Boolean
});

const emit = defineEmits(['toggleNavigator']);

const navStore = useNavigatorStore();
const router = useRouter();

const menuItems = reactive([
  {
    title: '總覽',
    icon: 'Odometer',
    index: 'Home-1'
  },
  {
    title: '會員管理',
    icon: 'User',
    index: 'User-1',
    children: [
      {
        title: '會員列表',
        path: '/users/user-list',
        index: 'Users-1-1'
      }
    ]
  },
  {
    title: '商品管理',
    icon: 'Goods',
    index: 'Goods-1',
    children: [
      {
        title: '商品列表',
        path: '/goods/goods-list',
        index: 'Goods-1-1'
      },
      {
        title: '商品類別列表',
        path: '/goods/goods-type-list',
        index: 'Goods-1-2'
      }
    ]
  },
  {
    title: '訂單管理',
    icon: 'Document',
    index: 'Orders-1',
    children: [
      {
        title: '訂單列表',
        path: '/orders/orders-list',
        index: 'Orders-1-1'
      }
    ]
  },
  {
    title: '管理員設定',
    icon: 'Tools',
    index: 'Admin-1'
  }
]);

const handleOpen = (key, keyPath) => {
  // console.log(key, keyPath);
};

const handleClose = (key, keyPath) => {
  // console.log(key, keyPath);
};

onMounted(() => {
  // console.log('Component mounted');
});
</script>
