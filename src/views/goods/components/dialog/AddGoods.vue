<template>
  <el-dialog v-model="visible" :title="title" :width="width">
    <el-form ref="ruleFormRef" :model="formModel" :rules="formRules">
      <!-- First row -->
      <div class="flex flex-wrap justify-between gap-4">
        <!-- 前台顯示 -->
        <el-form-item prop="Show" label="前台顯示:">
          <el-switch v-model="formModel.Show" />
        </el-form-item>
        <!-- 商品別名 -->
        <el-form-item prop="ImagesIdnet" label="商品別名:" class="w-[200px]">
          <el-input v-model="formModel.ImagesIdnet" type="text" placeholder="商品別名(Ident)" />
        </el-form-item>
      </div>
      <!-- Second row -->
      <div class="flex flex-wrap justify-between gap-4">
        <!-- 商品名稱 -->
        <el-form-item prop="Name" label="商品名稱:" class="w-[500px]">
          <el-input v-model="formModel.Name" type="text" placeholder="商品名稱" />
        </el-form-item>
      </div>
      <!-- Third row -->
      <div class="flex flex-wrap justify-between gap-x-4">
        <!-- 商品類別 -->
        <el-form-item prop="GoodsTypeID" label="商品類別:" class="w-[200px]">
          <el-select v-model="formModel.GoodsTypeID" placeholder="選擇商品類別" clearable>
            <el-option v-for="type in goodsTypeList" :key="type.ID" :label="type.Name" :value="type.ID" />
          </el-select>
        </el-form-item>
        <!-- 商品價格 -->
        <el-form-item prop="UnitPrice" label="商品價格:" class="w-[200px]">
          <el-input-number v-model="formModel.UnitPrice" :controls="false" placeholder="商品價格" />
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
import { ref } from 'vue';

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
  },
  goodsTypeList: {
    type: Array,
    default: () => []
  }
});

/* ----------------------
  Emits
----------------------- */
const emit = defineEmits(['close', 'confirm']);

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

const checkPrice = (rule, value, callback) => {
  if (isNaN(value)) {
    callback(new Error('Price must be a number'));
  } else if (value <= 0) {
    callback(new Error('Price must be a positive number'));
  } else {
    callback();
  }
};

/** */

const ruleFormRef = ref();

const formRules = {
  Name: [{ required: true, message: 'Please input the goods name', trigger: 'blur' }],
  UnitPrice: [
    { required: true, message: 'Please input the goods price', trigger: 'blur' },
    { validator: checkPrice, trigger: 'blur' }
  ],
  ImagesIdnet: [{ required: true, message: 'Please input the goods ident', trigger: 'blur' }]
};

const submitForm = async formEl => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 發送 confirm 事件並等待父組件處理結果
      emit('confirm', formModel.value);
    } else {
      console.log('error submit!!', fields);
    }
  });
};
</script>

<style lang="scss" scoped></style>
