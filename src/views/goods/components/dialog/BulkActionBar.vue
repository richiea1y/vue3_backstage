<template>
  <div
    v-if="selectedCount"
    class="act-bar-container flex justify-evenly gap-1.5 w-full max-w-[450px] bg-blue-900/[.95] text-slate-50 text-sm font-medium rounded-xl px-3 py-2.5"
  >
    <button class="act-bt flex items-center py-1.5 rounded-lg" @click="emits('clearSelection')">
      <img src="@/assets/icon/x-icon.svg" class="white-icon text-slate-50 px-2 max-w-8" />
      <div class="pr-3">{{ selectedCount }} Goods</div>
    </button>
    <div class="border-x flex justify-center gap-1 px-3">
      <button class="act-bt flex items-center py-1.5 rounded-lg">
        <img src="@/assets/icon/inbox.svg" class="white-icon text-slate-50 px-2 max-w-8" />
        <div class="pr-2">Categorize</div>
      </button>
      <button class="act-bt flex items-center py-1.5 rounded-lg" @click="emits('deleteSelection')">
        <img src="@/assets/icon/trash-2.svg" class="white-icon text-slate-50 px-2 max-w-8" />
        <div class="pr-2">Delete</div>
      </button>
    </div>
    <button class="act-bt flex items-center py-1.5 rounded-lg" @click="emits('editGoods')">
      <img src="@/assets/icon/pencil.svg" class="white-icon text-slate-50 px-2 max-w-8" />
      <div class="pr-2">Edit</div>
    </button>
  </div>
</template>

<script setup>

const props = defineProps({
  selectedCount: Number
});

const emits = defineEmits(['clearSelection', 'deleteSelection', 'editGoods']);

</script>

<style lang="scss" scoped>
.act-bar-container {
  position: fixed;
  left: 50%;
  bottom: 10%;
  z-index: 10;
  transform: translateX(-50%);
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

.lucide-play-icon {
  position: absolute;
  bottom: -1.3rem;
  left: 5.5rem;
  rotate: 90deg;
}
</style>
