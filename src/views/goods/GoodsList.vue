<template>
  <div class="flex items-center flex-1 flex-wrap gap-4"></div>
  <el-table :data="tableData" flexible stripe style="width: 100%" v-loading="tableLoading">
    <el-table-column prop="ID" label="ID" width="100"> </el-table-column>
    <el-table-column prop="Name" label="商品名稱"> </el-table-column>
    <el-table-column label="商品圖片">
      <template #default="{ row }">
        <img :src="row.ImageUrls[0].Url" alt="商品圖片" class="w-[120px] aspect-auto-[1]" />
      </template>
    </el-table-column>
    <el-table-column prop="UnitPrice" label="價格"> </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useGoodsList } from './composables';

const { tableData, tableLoading, getGoodsListRequest } = useGoodsList();

onMounted(async () => {
  await nextTick();
  getGoodsListRequest();
});
</script>
