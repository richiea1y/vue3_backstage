<template>
  <div class="act-bar-container">
    <div v-if="optionDialog" class="modal">
      <ul class="flex gap-3 items-center py-1">
        <li @click="openFileDialog">
          <button class="flex gap-3 items-center px-3 py-1">
            <ImageUp class="ImageUp w-5" />
            Change Image
          </button>
        </li>
      </ul>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="white"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-play-icon lucide-play"
      >
        <polygon points="6 3 20 12 6 21 6 3" />
      </svg>
    </div>
    <div
      v-if="selectedCount"
      class="act-bar flex justify-evenly gap-1.5 w-full max-w-[450px] bg-blue-900/[.95] text-slate-50 text-sm font-medium rounded-xl px-3 py-2.5"
    >
      <button class="act-bt flex items-center py-1.5 rounded-lg" @click="emit('clearSelection')">
        <img src="@/assets/icon/x-icon.svg" class="white-icon text-slate-50 px-2 max-w-8" />
        <div class="pr-3">{{ selectedCount }} Goods</div>
      </button>
      <div class="border-x flex justify-center gap-1 px-3">
        <button class="act-bt flex items-center py-1.5 rounded-lg">
          <img src="@/assets/icon/inbox.svg" class="white-icon text-slate-50 px-2 max-w-8" />
          <div class="pr-2">Categorize</div>
        </button>
        <button class="act-bt flex items-center py-1.5 rounded-lg" @click="emit('deleteSelection')">
          <img src="@/assets/icon/trash-2.svg" class="white-icon text-slate-50 px-2 max-w-8" />
          <div class="pr-2">Delete</div>
        </button>
      </div>
      <button @click="handleOptionClick" class="act-bt flex items-center py-1.5 rounded-lg">
        <img src="@/assets/icon/ellipsis.svg" class="white-icon text-slate-50 px-2 max-w-8" />
        <div class="pr-2">More</div>
      </button>
    </div>
  </div>
  <input ref="fileInput" type="file" accept="image/*" @change="handleImageChange" class="hidden" />
</template>

<script setup>
import { ref, watch } from 'vue';
import { ImageUp } from 'lucide-vue-next';
import { ElMessage } from 'element-plus';

const fileInput = ref(null);

const props = defineProps({
  selectedCount: Number,
  multipleSelection: Array
});

const emit = defineEmits(['clearSelection', 'deleteSelection', 'updateImage']);

// Option dialog state
const optionDialog = ref(false);

watch(
  () => props.multipleSelection,
  newVal => {
    // Close the option dialog when selection changes
    if (newVal.length === 0) {
      optionDialog.value = false;
    }
  },
  { immediate: true }
);

const handleOptionClick = () => {
  optionDialog.value = !optionDialog.value;
};

const openFileDialog = () => {
  // Logic to open file dialog
  optionDialog.value = false; // Close the options dialog
  if (props.multipleSelection.length !== 1) {
    ElMessage.error('Please select only one item to change the image.');
    return;
  }
  fileInput.value?.click();
};
const handleImageChange = () => {
  console.log('Selected Image:', fileInput.value.files[0], props.multipleSelection[0].ID);
  emit('updateImage', fileInput.value.files, props.multipleSelection[0].ID);
};
</script>

<style lang="scss" scoped>
.act-bar-container {
  position: fixed;
  left: 50%;
  bottom: 7%;
  z-index: 10;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease-in-out;
}

.act-bt:hover {
  background-color: rgba(78, 129, 212, 0.5);
  /* transition: all 0.3s ease-in-out; */
}
img.white-icon {
  filter: invert(1);
}

.ImageUp {
  color: #696763;
}

.modal {
  position: relative;
  z-index: 11;
  left: 65%;
  width: 15em;
  margin-bottom: -0.5rem;
  padding: 0.2rem 0.5rem;
  font-size: 0.9rem;
  color: #272525;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}

.modal li {
  width: 100%;
  border-radius: 5px;
  &:hover {
    background-color: #f8f6f2;
  }
}

.lucide-play-icon {
  position: absolute;
  bottom: -1.3rem;
  left: 5.5rem;
  rotate: 90deg;
}
</style>
