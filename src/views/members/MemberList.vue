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
        <!-- Right Section: New Member Button -->
        <div>
          <el-button type="primary" icon="Plus">Member</el-button>
        </div>
      </div>
    </div>
    <!-- Bottom Section: Member List -->
    <div class="flex p-3 my-3 bg-white rounded bd-1"></div>
</template>

<script setup>
</script>
