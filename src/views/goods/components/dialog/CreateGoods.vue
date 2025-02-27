<template>
  <el-dialog v-model="visible" :title="title" :width="width" @close="emit('close')">
    <el-form ref="ruleFormRef" :model="formModel" :rules="formRules">
      <el-form-item prop="key" label="前台顯示" :label-width="labelWidth" :label-position="labelPosition">
        <el-radio-group v-model="formModel.Show" size="small">
          <el-radio-button :value="true">是</el-radio-button>
          <el-radio-button :value="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
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
import { ref } from 'vue';

/* ----------------------
  Props
----------------------- */
defineProps({
  title: {
    type: String,
    default: 'Edit'
  },
  width: {
    type: [String, Number],
    default: 500
  },
  labelWidth: {
    type: [String, Number],
    default: 'auto'
  },
  labelPosition: {
    type: String,
    default: 'left'
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

const ruleFormRef = ref();

const formRules = {
  name: [{ required: true, message: 'Please input a gameplay name.', trigger: 'blur' }],
  timeInterval: [{ required: true, message: 'Please input time(s)', trigger: 'blur' }],
  quantityMin: [{ required: true, message: 'Please input minimum buy-in(USDT)', trigger: 'blur' }],
  quantityMax: [{ required: true, message: 'Please input maximum buy-in(USDT)', trigger: 'blur' }],
  yieldMode: [{ required: true, message: 'Please input average yield', trigger: 'blur' }],
  userLevel: [{ required: true, message: 'Please input required user level ', trigger: 'blur' }],
  teamLevel: [{ required: true, message: 'Please input required team level ', trigger: 'blur' }],
  displaySort: [{ required: true, message: 'Please input display sort', trigger: 'blur' }]
};

const submitForm = async formEl => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      handleConfirm();
    } else {
      console.log('error submit!', fields);
    }
  });
};
</script>
