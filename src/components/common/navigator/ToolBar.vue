<template>
  <div class="top-navigator min-w-[1200px]">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center h-[30px] text-xl text-dark-60 cursor-pointer gap-4" @click="toggleNavigator">
        <el-icon size="xl">
          <Fold />
        </el-icon>
        <div class="top-logo" @click="router.push({ path: '/main' })" />
      </div>
      <h1 class="text-[20px] header-dark-80">
        {{ route.meta.header }}
      </h1>
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/main' }">Home</el-breadcrumb-item>
        <template v-for="item in breadcrumbItems" :key="item.path">
          <el-breadcrumb-item :to="item.path">
            {{ item.title }}
          </el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>

    <div class="top-toolbar">
      <p class="min-w-[200px] text-sm text-dark-60">{{ `GMT+8 ${formattedTime}` }}</p>
      <div class="flex items-center justify-center text-dark-60">
        <el-icon size="lg">
          <UserFilled />
        </el-icon>
        <!-- <p class="ml-2 text-sm">{{ adminStore.adminInfo?.manager?.account }}</p> -->
      </div>
      <el-divider direction="vertical" />
      <el-button type="danger" plain size="small" @click="handleLogout">Logout</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import { useAdminStore } from '@/stores/adminInfo';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import to from 'await-to-js';
import { useNavigatorStore } from '@/stores/navigator';

// const adminStore = useAdminStore();
const navStore = useNavigatorStore();

dayjs.extend(utc);
dayjs.extend(timezone);

const router = useRouter();
const route = useRoute();

const toggleNavigator = () => {
  navStore.saveNavigatorToggle(!navStore.navToggleStatus);
};

const formattedTime = ref('');
let timer = null;

const updateTime = () => {
  formattedTime.value = dayjs().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
};

const handleLogout = async () => {
  // 教室的登出機制是只要清除localstorage的token和user登入資訊就可以了
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push({ name: 'Login' });
};

const createBreadcrumbTitle = (titleConfig, query, isDynamic = false) => {
  if (typeof titleConfig === 'function' && isDynamic) {
    return titleConfig(query);
  }
  return titleConfig;
};

const createBreadcrumbPath = (name, path) => {
  if (name) {
    return router.resolve({ name }).path;
  }
  return path ?? '';
};

const createBreadcrumbFromMeta = (meta, route) => ({
  title: createBreadcrumbTitle(meta.title, route.params, meta.dynamic),
  path: createBreadcrumbPath(meta.name, meta.path)
});

const createBreadcrumbFromRoute = route => ({
  title: route.meta?.title,
  path: route.path
});

const breadcrumbItems = computed(() => {
  const matchedRoutes = route.matched.slice(1);
  return matchedRoutes.flatMap(matched => {
    const breadcrumbs = matched.meta?.breadcrumb;

    if (!breadcrumbs?.length) {
      return [createBreadcrumbFromRoute(matched)];
    }

    return breadcrumbs.map(crumb => createBreadcrumbFromMeta(crumb, route));
  });
});

onMounted(async () => {
  await nextTick();
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer !== null) {
    clearInterval(timer);
  }
});
</script>
