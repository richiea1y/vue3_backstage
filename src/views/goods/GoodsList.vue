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
    <el-table :data="tableData" flexible stripe style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="ID" label="ID" width="100"> </el-table-column>
      <el-table-column prop="Name" label="商品名稱"> </el-table-column>
      <el-table-column label="商品圖片">
        <template #default="{ row }">
          <img :src="row.ImageUrls[0].Url" alt="商品圖片" class="w-[90px] aspect-auto-[1]" />
        </template>
      </el-table-column>
      <el-table-column prop="UnitPrice" label="價格"> </el-table-column>
    </el-table>
  </div>
  <CreateGoods v-model="dialog.createGoods" v-model:formModel="goodsForm" />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useGoodsList } from './composables';
import CreateGoods from './components/dialog/CreateGoods.vue';
import { updateGoods } from '@/service/api';

const {
  searchFilter,
  tableData,
  pagination,
  tableLoading,
  goodsForm,
  goodsTypeList,
  getGoodsListRequest,
  getGoodsTypeList
} = useGoodsList();

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
