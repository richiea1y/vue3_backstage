<template>
  <el-dialog v-model="visible" :title="title" :width="width" @close="emit('close')">
    <el-form ref="ruleFormRef" :model="formModel" :rules="formRules">
      <el-form-item prop="key" label="前台顯示" :label-width="labelWidth" :label-position="labelPosition">
        <el-radio-group v-model="formModel.Show" size="small">
          <el-radio-button :value="true">是</el-radio-button>
          <el-radio-button :value="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="圖片上傳:" prop="ImagesIdnet">
        <div class="flex flex-col w-full gap-2">
          <label class="upload-customize">
            <span class="upload-btn">
              <el-icon><PictureFilled /></el-icon>
              選擇圖片
            </span>
            <input type="file" @change="selectFile($event)" />
          </label>
          <span class="upload-file-name mx-2">選擇圖檔: {{ filesModel.imgFileName }}</span>
          <div class="w-[150px]">
            <el-input v-model="formModel.ImagesIdnet" type="text" placeholder="圖片別名(Ident)" />
          </div>
          <el-button type="primary" class="deep_dark" icon="UploadFilled" @click="handleUpload">上傳圖片</el-button>
        </div>
        <div class="goods-img-preview">
          <div v-for="(item, i) in getcurrentImgs[formModel.ImagesIdnet]" :key="i" class="img-preview__items">
            <div class="img-container">
              <img :src="item.Url" />
              {{ item.Url }}
            </div>
            <div class="flex flex-col items-center">
              <p class="mx-4">ID: {{ item.ID }}</p>
              <p>Ident: {{ item.Ident }}</p>
            </div>
            <!-- <el-icon @click="handleRemoveImg(item)">
              <Close />
            </el-icon> -->
          </div>
        </div>
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
import { ref, computed } from 'vue';
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

const filesModel = ref({
  imgFile: null,
  imgFileName: '',
  imgIdent: '',
  goodsImg: {}
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

/** Image Upload */

const getcurrentImgs = computed(() => {
  const obj = { ...filesModel.value.goodsImg };
  return obj;
});

const selectFile = async event => {
  console.log('###event: ', event);
  const file = event.target.files[0];
  const fileSize = file.size / 1024;

  // 可上傳的檔案類別: jpg, jpeg, png, webp, gif

  filesModel.value.imgFile = file;
  filesModel.value.imgFileName = file.name;
  console.log('###upload info: ', (file.size / 1024).toFixed(2), 'kb', filesModel.value.imgFile);
  if (fileSize > 250) {
    ElMessage({
      message: '檔案不可大於 250KB',
      type: 'error'
    });
    filesModel.value.imgFileName = '檔案不可大於 250KB，請重新選擇圖片';
    return;
  }
};

const handleUpload = () => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('Ident', formModel.value.ImagesIdnet);
  formData.append('Img', filesModel.value.imgFile);

  const options = {
    method: 'POST',
    headers: {
      token: token
    },
    body: formData
  };

  if (filesModel.value.imgFile === null) {
    ElMessage({
      type: 'error',
      message: '未選擇檔案'
    });
    return;
  }
  if (!filesModel.value.goodsImg.hasOwnProperty(formModel.ImagesIdnet)) {
    filesModel.value.goodsImg[formModel.ImagesIdnet] = [];
  }
  const baseUrl = import.meta.env.MODE === 'production' ? import.meta.env.VITE_BASE_API : '/api';
  fetch(baseUrl + '/admin/image/c', options)
    .then(res => res.json())
    .then(res => {
      filesModel.value.goodsImg[formModel.ImagesIdnet].push(res.Data);
      console.log(res, filesModel.value.goodsImg);
      ElMessage({
        type: 'success',
        message: '已成功上傳圖片'
      });
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: 'API錯誤'
      });
    });
};

/** */

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

<style lang="scss" scoped>
.upload-customize {
  display: flex;
  align-items: center;
  position: relative;
  width: auto;
  height: 34px;
  cursor: pointer;
  span {
    display: inline-flex;
    font-size: 0.85rem;
    padding: 0 16px 0 10px;
    white-space: nowrap;
    &.upload-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #d9d9d9;
      border-radius: 34px;
      background-color: #333;
      .el-icon {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }
    }
  }
  input[type='file'] {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
  }
}

.upload-file-name {
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goods-img-preview {
  display: block;
  width: 100%;
  padding: 1rem 0;
  .img-preview__items {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 90px;
    padding-right: 1rem;
    margin-bottom: 0.5rem;
    &:last-child {
      margin-bottom: 0px;
    }
    border: 1px solid #999;
    .el-icon {
      width: 24px;
      height: 24px;
      cursor: pointer;
      svg {
        width: 100%;
        height: 100%;
      }
    }
    .img-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 100%;
      background-color: #f0f0f0;
      img {
        width: auto;
        height: 100%;
      }
    }
  }
}
</style>
