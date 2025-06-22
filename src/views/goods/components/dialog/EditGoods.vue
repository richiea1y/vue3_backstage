<template>
  <el-dialog v-model="visible" :title="'編輯商品'" :width="'800px'">
    <el-form :model="updatedGoods" label-width="100px" class="goods-form flex-column w-full">
      <div class="goods-edit flex">
        <!-- 商品圖片預覽 -->
        <div class="goods-image-preview rounded-md flex item-center w-[275px] h-[275px]">
          <img
            v-if="existImages" :src="firstImageUrl"
            class="max-w-full max-h-full object-contain"
            />
          <div v-else class="rounded-md" >
            <Image size={64} />
          </div>
        </div>
        <!-- 商品基本信息  -->
        <div class="goods-specs w-[525px]">
          <div class="flex items-end justify-between">
            <el-form-item label="前台顯示">
              <el-switch v-model="updatedGoods.Show" />
            </el-form-item>
            <el-form-item label="商品別名" class="w-[250px]">
              <el-input v-model="updatedGoods.ImagesIdnet" />
            </el-form-item>
          </div>
          <div class="flex items-end  justify-between">
            <el-form-item label="商品名稱" class="w-full">
              <el-input v-model="updatedGoods.Name" />
            </el-form-item>
          </div>
          <div class="flex items-end  justify-between">
            <el-form-item label="商品類型" class="w-[250px]">
              <el-select v-model="updatedGoods.GoodsTypeID" placeholder="選擇商品類型">
                <el-option
                  v-for="type in goodsTypeList"
                  :key="type.ID"
                  :label="type.Name"
                  :value="type.ID"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="商品價格" class="w-[250px]">
              <el-input v-model="updatedGoods.UnitPrice" />
            </el-form-item>
          </div>
        </div>
      </div>
      <!-- 商品圖片 -->
      <div class="goods-images flex gap-4 w-full p-6 my-5 bg-blue-50/25 rounded-lg">
        <button class="bg-slate-100 hover:bg-slate-200 rounded-lg p-2 flex items-center justify-center">
          <Plus
            class="w-[80px] h-[80px] text-slate-500"
            @click="fileInput.click()"
          />
        </button>
        <div
          v-for="img in updatedGoods.ImageUrls"
          :key="img.ID"
          class="relative shadow-md "
        >
          <button
            class="mt-[-16px] p-1 rounded-full absolute -right-4 hover:bg-slate-50 hover:text-red-700 hover:shadow-lg"
            @click="handleDeleteImage(img)"
          >
            <Trash2 class="w-[20px]" />
          </button>
          <img
            :src="img.Url"
            alt="商品圖片"
            class="w-[100px] aspect-[1/1] object-cover rounded-lg"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          class="hidden"
          ref="fileInput"
          @change="handleFileChange"
        />
      </div>
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
import { Trash2, Plus, Image} from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { cloneDeep } from 'lodash-es';

/* ----------------------
  Props
----------------------- */
const props = defineProps({
  goodsTypeList: {
    type: Array,
    default: () => []
  }
});
/* ----------------------
  Models
----------------------- */

// v-model for dialog visibility
const visible = defineModel();
const updatedGoods = defineModel('updatedGoods');
// Store Img's ID for emitted from the dialog
const imagesNeedDelete = [];

/** */
const fileInput = ref(null);

const handleFileChange = (event) => {
  const imageUpdateModel = ref({
    ID: Date.now(), // Use timestamp as a unique ID
    Img: null,
    Url: '',
    Ident: '',
  });

  console.log('File changed:', event.target.files[0]);
  const fileSizeExceeded = ref(false);
  const file = event.target.files[0];
  const fileSize = file.size / 1024; // Convert to KB

  if (fileSize > 250) { // 5MB limit
    fileSizeExceeded.value = true;
    console.error('File size exceeds 250KB');
    ElMessage.error('檔案大小超過 250KB，請選擇較小的圖片。');
    return;
  }

  // const previousImageUrls = URL.createObjectURL(file);
  // imageUpdateModel.value.Url = previousImageUrls;
  // imageUpdateModel.value.Ident = file.name;
  // updatedGoods.value.ImageUrls.push(imageUpdateModel.value);
};

const handleCancel = () => {
  visible.value = false;
};

const handleDeleteImage = (targetImg) => {
  console.log('Current images:', updatedGoods.value.ImageUrls);
  imagesNeedDelete.push(targetImg.ID);
  updatedGoods.value.ImageUrls = updatedGoods.value.ImageUrls.filter((image) => image.ID !== targetImg.ID);
  // URL.revokeObjectURL(targetImg.Url)
};

/* ----------------------
  Computeds
----------------------- */
const existImages = computed(() => {
  return updatedGoods.value.ImageUrls && updatedGoods.value.ImageUrls.length > 0 ;
});

const firstImageUrl = computed(() => {
  return updatedGoods.value.ImageUrls && updatedGoods.value.ImageUrls.length > 0
    ? updatedGoods.value.ImageUrls[0].Url
    : null;
});

</script>

<style scoped>

</style>
