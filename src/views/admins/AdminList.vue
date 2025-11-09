<template>
    <!-- Top Section: Search Bar -->
    <div class="flex p-3 my-3 bg-white rounded bd-1">
      <div class="flex gap-2">
        <!-- Left Section: Search Input -->
        <div class="w-[300px]">
          <el-input placeholder="Search By Name" clearable />
        </div>
        <div>
          <el-button type="default" icon="Filter" />
        </div>
        <!-- Right Section: New Admin Button -->
        <div>
          <el-button type="primary" icon="Plus">Admin</el-button>
        </div>
      </div>
    </div>
    <!-- Bottom Section: Admin List -->
    <div class="flex p-3 my-3 bg-white rounded bd-1">
      <el-table ref="adminTableRef" row-key="ID" :data="admins" style="width: 100%" :loading="tableLoading">
        <el-table-column prop="ID" label="ID" width="100"> </el-table-column>
        <el-table-column prop="Name" label="管理員名稱"> </el-table-column>
        <el-table-column prop="Email" label="Email"> </el-table-column>
        <el-table-column prop="Phone" label="手機"> </el-table-column>
        <el-table-column prop="Account" label="帳號"> </el-table-column>
        <el-table-column prop="Password" label="密碼"> </el-table-column>
      </el-table>
    </div>
</template>

<script setup>
import { useAdminList } from '@/views/admins/composables/useAdminList';
import { onMounted, ref } from 'vue';

const { admins, loading: tableLoading, fetchAdmins } = useAdminList();
const adminTableRef = ref(null);

onMounted(() => {
  fetchAdmins();
});
</script>
