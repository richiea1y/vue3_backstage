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
    <div>
      <el-button type="primary" plain icon="Plus" @click="dialog.createGoods = true">New Images</el-button>
      <el-button type="primary" plain icon="Plus" @click="dialog.addGoods = true">New Goods</el-button>
    </div>
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
    <BulkActionBar
      :selectedCount
      :multipleSelection
      @clearSelection="clearSelection"
      @deleteSelection="deleteSelection"
      @updateImage="getUpdateImage"
    />
  </div>
  <CreateGoods v-model="dialog.createGoods" v-model:formModel="goodsForm" />
  <AddGoods
    @confirm="postAddGoods"
    v-model="dialog.addGoods"
    v-model:formModel="goodsForm"
    :goods-type-list="goodsTypeList"
    :table-data="tableData"
  />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useGoodsList } from '@/views/goods/composables';
import CreateGoods from '@/views/goods/components/dialog/CreateGoods.vue';
import BulkActionBar from '@/views/goods/components/dialog/BulkActionBar.vue';
import { addGoods, updateGoods } from '@/service/api';
import { ElMessage } from 'element-plus';
import AddGoods from './components/dialog/AddGoods.vue';

const {
  searchFilter,
  tableData,
  pagination,
  tableLoading,
  goodsForm,
  goodsTypeList,
  getGoodsListRequest,
  getGoodsTypeList,
  postAddGoods,
  postDeleteGoods,
  postDeleteGoodsImage,
  resetForm
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

// 計算選取的數量
const selectedCount = computed(() => multipleSelection.value.length);

// 清除選取狀態
const clearSelection = () => {
  multipleTableRef.value.clearSelection();
};

// 刪除選取的商品項目
const deleteSelection = async () => {
  for (let item of multipleSelection.value) {
    const success = await postDeleteGoods(item); // ✅ 傳整筆 item
    if (!success) {
      ElMessage.error(`刪除失敗：${item.Name}`);
      break;
    }
  }

  // ✅ Success: all deletes completed
  ElMessage.success('已刪除選取的項目');
  clearSelection(); // Clear selection after deletion
};

const getUpdateImage = async (imageFile, selectedGoodsID) => {
  const filesModel = ref({
    imgFile: null,
    imgFileName: '',
    imgIdent: '',
    goodsImg: {}
  });

  // Fill the file and name of filesModel with the selected image file
  filesModel.value.imgFile = imageFile;
  console.log('Selected Image File:', imageFile);
  filesModel.value.imgFileName = imageFile.name;
  console.log('Selected Image File Name:', filesModel.value.imgFileName);

  // Set the imgIdent by the selectedGoodsID
  console.log('Ident for selected image:', selectedGoodsID);
  const deleteImageSuccess = await postDeleteGoodsImage(selectedGoodsID); // Delete existing images
  if (!deleteImageSuccess) {
    ElMessage.error('刪除舊圖片失敗');
    return;
  }
};

const dialog = ref({
  createGoods: false,
  updateGoods: false,
  addGoods: false
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
  await nextTick(); // Wait for the DOM to update
  getGoodsTypeList();
  getGoodsListRequest(false);
});
</script>
