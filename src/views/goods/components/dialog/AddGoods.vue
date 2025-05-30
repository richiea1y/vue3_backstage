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
        <el-form-item prop="ImagesIdnet" label="商品別名:" class="w-[270px]">
          <div class="flex items-center gap-3">
            <el-input v-model="formModel.ImagesIdnet" type="text" placeholder="商品別名(Ident)" />
            <button @click="rollbackIdent" class="cursor-pointer">
              <RotateCcw class="w-5 h-5" />
            </button>
          </div>
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
      <el-form-item label="圖片上傳:" prop="ImagesIdnet">
        <div class="flex flex-col w-full gap-2">
          <label class="upload-customize">
            <span class="upload-btn">
              <el-icon><PictureFilled /></el-icon>
              選擇圖片
            </span>
            <input type="file" @change="selectFile($event)" />
          </label>
          <span class="upload-file-name mx-2"
            >選擇圖檔:
            <span :class="fileSizeExceeded ? 'fileNameColor' : 'fileNameWramning'">{{ filesModel.imgFileName }}</span>
          </span>
        </div>
        <div class="goods-img-preview">
          <img v-if="filesModel.imgFile" :src="previewUrl" />
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
import { ElMessage } from 'element-plus';
import { computed, ref, watch } from 'vue';
import { nanoid } from 'nanoid';
import { RotateCcw } from 'lucide-vue-next';

/* ----------------------
  Props
----------------------- */
const props = defineProps({
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
  },
  tableData: {
    type: Array,
    required: true
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
const autoIdent = ref(''); // Auto-generated ident for images

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
  visible.value = false; // Close dialog after submission
};

const checkIdentUnique = (genIdent, dataSources) => {
  const isUnique = dataSources.find(item => item.ImagesIdnet === genIdent);
  return isUnique ? false : true;
};

const rollbackIdent = () => {
  // Reset ident to auto-generated value
  formModel.value.ImagesIdnet = autoIdent.value;
};

/** Image Upload */

let fileSizeExceeded = ref(false); // Flag to track if file size exceeds limit
let previewUrl = null; // URL for the image preview

const filesModel = ref({
  imgFile: null,
  imgFileName: '',
  imgIdent: '',
  goodsImg: {}
});

const selectFile = async event => {
  fileSizeExceeded = false;
  console.log('###event: ', event);
  const file = event.target.files[0];
  const fileSize = file.size / 1024; // Convert to KB
  if (previewUrl) URL.revokeObjectURL(previewUrl); // Clean up previous URL

  previewUrl = URL.createObjectURL(file); // Create a new URL for the image preview
  // 可上傳的檔案類別: jpg, jpeg, png, webp, gif
  filesModel.value.imgFile = file;
  filesModel.value.imgFileName = file.name;
  filesModel.value.imgIdent = formModel.value.ImagesIdnet; // Associate file with the current ident

  console.log('File size:', (file.size / 1024).toFixed(2), 'KB', filesModel.value.imgFile);
  console.log('FileModel', filesModel.value);

  if (fileSize > 250) {
    // Limit file size to 250KB
    fileSizeExceeded = true;
    ElMessage.error('File size exceeds 250KB limit');
    filesModel.value.imgFileName = '檔案不可大於 250KB，請重新選擇圖片';
    return;
  }
};

/** Watcher */
watch(
  () => visible.value,
  async newVal => {
    try {
      if (newVal) {
        // Generate a unique ident when dialog is opened
        let tries = 0;
        let candidate = '';
        do {
          candidate = `UNC-${nanoid(10)}`;
          tries++;
          console.log('Table data:', props.tableData[0]?.ImagesIdnet);
          if (tries > 10) {
            throw new Error('Failed to generate a unique ident after 10 attempts');
            console.error('已嘗試產生 10 次識別碼仍重複，請確認 tableData 是否有異常');
          }
          console.log(`🌀 checkIdentUnique(${candidate}) =`, checkIdentUnique(candidate, props.tableData));
          // Check if the generated ident is unique
          // If not, generate a new one
        } while (!checkIdentUnique(candidate, props.tableData));
        autoIdent.value = candidate;
        formModel.value.ImagesIdnet = autoIdent.value;
      } else {
        // Reset ident when dialog is closed
        autoIdent.value = '';
      }
    } catch (err) {
      console.error('Unhandled error during ident generation in watcher:', err);
    }
  }
);
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
    opacity: 0; /* Hide the file input */
  }
}

.upload-file-name {
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fileNameColor {
  color: red;
}
.fileNameWramning {
  color: #3256ca;
}

.goods-img-preview {
  display: block;
  width: 100%;
  padding: 1rem 0;
  img {
    max-width: 100%;
    height: 150px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
