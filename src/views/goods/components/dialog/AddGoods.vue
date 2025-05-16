<template>
  <el-dialog v-model="visible" :title="title" :width="width">
    <el-form>
      <!-- First row -->
      <div class="flex flex-wrap justify-between gap-4">
        <!-- 前台顯示 -->
        <el-form-item label="前台顯示:">
          <el-radio-group>
            <el-radio-button :value="true">是</el-radio-button>
            <el-radio-button :value="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- 商品別名 -->
        <el-form-item label="商品別名:" class="w-[200px]">
          <el-input type="text" placeholder="商品別名(Ident)" />
        </el-form-item>
      </div>
      <!-- Second row -->
      <div class="flex flex-wrap justify-between gap-4">
        <!-- 商品名稱 -->
        <el-form-item label="商品名稱:" class="w-[500px]">
          <el-input type="text" placeholder="商品名稱" />
        </el-form-item>
      </div>
      <!-- Third row -->
      <div class="flex flex-wrap justify-between gap-4">
        <!-- 商品類別 -->
        <el-form-item label="商品類別:" class="w-[200px]">
          <el-select placeholder="選擇商品類別" clearable>
            <el-option label="商品類別1" value="1" />
            <el-option label="商品類別2" value="2" />
          </el-select>
        </el-form-item>
        <!-- 商品規格 -->
        <el-form-item label="商品規格:" class="w-[200px]">
          <el-input type="text" placeholder="商品規格" />
        </el-form-item>
      </div>
      <!-- 商品價格 -->
      <el-form-item label="商品價格:" class="w-[200px]">
        <el-input type="text" placeholder="商品價格" />
      </el-form-item>
      <!-- 商品圖片上傳 -->
    </el-form>
  </el-dialog>
</template>

<script setup>
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
</script>

<style lang="scss" scoped></style>
