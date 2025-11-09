<template>
    <!-- Top Section: Search Bar -->
    <div class="flex p-3 my-3 bg-white rounded bd-1">
      <div class="flex gap-2">
        <!-- Left Section: Search Input -->
        <div class="w-[300px]">
          <el-input placeholder="Search By Name" clearable />
        </div>
        <div>
          <el-button type="default" icon="Filter" />
        </div>
        <!-- Right Section: New Admin Button -->
        <div>
          <el-button type="primary" icon="Plus">Admin</el-button>
        </div>
      </div>
    </div>
    <!-- Bottom Section: Admin List -->
    <div class="flex p-3 my-3 bg-white rounded bd-1"></div>
</template>

<script setup>
</script>
