<template>
  <div class="flex items-end justify-between p-3 my-3 bg-white rounded bd-1">
    <div class="flex items-center gap-2">
      <div class="w-[140px]">
        <el-input v-model="searchFilter.GoodsName" placeholder="Search By Name" clearable />
      </div>
      <div class="w-[180px]">
        <el-select v-model="searchFilter.GoodsType" placeholder="Select Goods Type" clearable>
          <el-option v-for="item in goodsTypeList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>
      <el-button type="primary" icon="Search" @click="getGoodsListRequest(false)">Search</el-button>
    </div>
    <el-button type="primary" plain icon="Plus" @click="dialog.createGoods = true">New Goods</el-button>
  </div>
  <div class="flex flex-col p-3 my-3 bg-white rounded bd-1">
    <el-pagination
      v-model:currentPage="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :background="true"
      layout="sizes, prev, pager, next"
      :total="pagination.total"
      @size-change="onPageSizeChange"
      @current-change="onPageChange"
    />
    <!-- tableData 回傳資料的型別（來自 getGoodsList()），應該是： prop="ID"， 所以 row-key 也應該是 ID（大寫），而不是 id（小寫）！-->
    <el-table
      ref="multipleTableRef"
      row-key="ID"
      :data="tableData"
      flexible
      stripe
      style="width: 100%"
      v-loading="tableLoading"
      @selection-change="handleSelectionChange"
      @row-click="clickToSelect"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="ID" label="ID" width="100"> </el-table-column>
      <el-table-column prop="Name" label="商品名稱"> </el-table-column>
      <el-table-column label="商品圖片">
        <template #default="{ row }">
          <img
            v-if="row.ImageUrls && row.ImageUrls.length > 0"
            :src="row.ImageUrls[0].Url"
            alt="商品圖片"
            class="w-[90px] aspect-auto-[1]"
          />
          <span v-else>無圖片</span>
        </template>
      </el-table-column>
      <el-table-column prop="UnitPrice" label="價格"> </el-table-column>
    </el-table>
  </div>
  <CreateGoods v-model="dialog.createGoods" v-model:formModel="goodsForm" />
  <BulkActionBar :selectedCount @clearSelection="clearSelection" @deleteSelection="deleteSelection" />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useGoodsList } from '@/views/goods/composables';
import CreateGoods from '@/views/goods/components/dialog/CreateGoods.vue';
import BulkActionBar from '@/views/goods/components/dialog/BulkActionBar.vue';
import { updateGoods } from '@/service/api';
import { ElMessage } from 'element-plus';

const {
  searchFilter,
  tableData,
  pagination,
  tableLoading,
  goodsForm,
  goodsTypeList,
  getGoodsListRequest,
  getGoodsTypeList,
  postDeleteGoods
} = useGoodsList();

const multipleTableRef = ref(); // Table reference
const multipleSelection = ref([]); // Selected rows

// The row-click event passes row, column, and event as parameters
// 處理點擊行時，切換選取狀態
const clickToSelect = row => {
  multipleTableRef.value.clearSelection(); // ✅ Clears all
  multipleTableRef.value.toggleRowSelection(row); // ✅ Selects just the clicked one
};

// 處理選取狀態變化，更新 multipleSelection
const handleSelectionChange = val => {
  multipleSelection.value = val;
  console.log('Selected rows:', val);
  console.log('Selected Count:', selectedCount.value);
};

const selectedCount = computed(() => multipleSelection.value.length);

const clearSelection = () => {
  multipleTableRef.value.clearSelection();
};

const deleteSelection = async () => {
  // Make sure at least one item is selected
  if (selectedCount.value === 0) return;

  const idsToDelete = multipleSelection.value.map(item => item.ID);
  const originalData = [...tableData.value]; // Create a copy of the original goods list that backup for rollback

  // Optimistically remove items from UI
  tableData.value = tableData.value.filter(item => !idsToDelete.includes(item.ID));
  // Send the Delete API Request
  for (const id of idsToDelete) {
    const success = await postDeleteGoods({ ID: id });
    if (!success) {
      // ❌ Error: Rollback UI and show error if deletion fails
      tableData.value = originalData;
      ElMessage.error(`Failed to delete goods with ID ${id}. Rolling back...`);
      break; // Stop further deletes
    }
  }

  // ✅ Success: all deletes completed
  ElMessage.success('Selected items deleted successfully!');
  clearSelection(); // Clear selection after deletion
};

const dialog = ref({
  createGoods: false,
  updateGoods: false
});

const onPageChange = val => {
  pagination.value.currentPage = val;
  getGoodsListRequest(true);
};

const onPageSizeChange = val => {
  pagination.value.pageSize = val;
  pagination.value.currentPage = 1;
  getGoodsListRequest(true);
};

onMounted(async () => {
  await nextTick();
  getGoodsTypeList();
  getGoodsListRequest(false);
});
</script>
