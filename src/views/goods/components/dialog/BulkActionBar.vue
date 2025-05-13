<template>
  <div
    v-if="selectedCount"
    class="fixed z-10 bottom-20 left-1/2 transform -translate-x-1/2 flex justify-evenly gap-1.5 w-full max-w-[440px] bg-blue-900/[.95] text-slate-50 text-sm font-medium rounded-xl px-3 py-2.5"
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
    <button class="act-bt flex items-center py-1.5 rounded-lg">
      <img src="@/assets/icon/ellipsis.svg" class="white-icon text-slate-50 px-2 max-w-8" />
      <div class="pr-1">More</div>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedCount: Number
});

const emit = defineEmits(['clearSelection', 'deleteSelection']);
</script>

<style scoped>
.act-bt:hover {
  background-color: rgba(78, 129, 212, 0.5);
  /* transition: all 0.3s ease-in-out; */
}
img.white-icon {
  filter: invert(1);
}
</style>
