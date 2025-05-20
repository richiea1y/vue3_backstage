<template>
  <el-dialog v-model="visible" :title="title" :width="width">
    <el-form>
      <!-- First row -->
      <div class="flex flex-wrap justify-between gap-4">
        <!-- 前台顯示 -->
        <el-form-item prop="Show" label="前台顯示:">
          <el-switch v-model="formModel.Show" />
        </el-form-item>
        <!-- 商品別名 -->
        <el-form-item prop="ImagesIdnet" label="商品別名:" class="w-[200px]">
          <el-input type="text" placeholder="商品別名(Ident)" />
        </el-form-item>
      </div>
      <!-- Second row -->
      <div class="flex flex-wrap justify-between gap-4">
        <!-- 商品名稱 -->
        <el-form-item prop="Name" label="商品名稱:" class="w-[500px]">
          <el-input type="text" placeholder="商品名稱" />
        </el-form-item>
      </div>
      <!-- Third row -->
      <div class="flex flex-wrap justify-between gap-x-4">
        <!-- 商品類別 -->
        <el-form-item prop="GoodsTypeID" label="商品類別:" class="w-[200px]">
          <el-select placeholder="選擇商品類別" clearable>
            <el-option label="商品類別1" value="1" />
            <el-option label="商品類別2" value="2" />
          </el-select>
        </el-form-item>
        <!-- 商品價格 -->
        <el-form-item prop="UnitPrice" label="商品價格:" class="w-[200px]">
          <el-input type="text" placeholder="商品價格" />
        </el-form-item>
        <!-- 商品規格 -->
        <!-- <el-form-item label="商品規格:" class="w-[200px]">
          <el-input type="text" placeholder="商品規格" />
        </el-form-item> -->
      </div>
      <!-- 商品圖片上傳 -->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus';

/* ----------------------
  Props
----------------------- */
defineProps({
  title: {
    type: String,
    default: '新增商品'
  },
  width: {
    type: [String, Number],
    default: 500
  }
});

/* ----------------------
  Models
----------------------- */

// v-model for dialog visibility
const visible = defineModel();
// v-model for form data
const formModel = defineModel('formModel', {
  default: () => ({
    ID: null,
    Show: true,
    GoodsTypeID: 1,
    Name: '',
    SpecsAllowance: 0,
    GoodsSpecs: [],
    UnitPrice: 0,
    ImagesIdnet: '',
    Description: ''
  })
});

/* ----------------------
  Methods
----------------------- */
const handleCancel = () => {
  visible.value = false;
};

const handleConfirm = async () => {
  // 發送 confirm 事件並等待父組件處理結果
  try {
    emit('confirm', formModel.value);
    // 如果父組件沒有拋出錯誤，則關閉對話框
  } catch (error) {
    // 如果父組件拋出錯誤，對話框保持打開狀態
    console.error('Form submission failed:', error);
  }
};
</script>

<style lang="scss" scoped></style>
