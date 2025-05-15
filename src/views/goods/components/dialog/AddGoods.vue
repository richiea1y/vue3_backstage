<template>
  <el-dialog v-model="visible">
    <el-form>
      <el-form-item label="前台顯示">
        <el-radio-button :value="true">是</el-radio-button>
        <el-radio-button :value="false">否</el-radio-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
// v-model for dialog visibility
const visible = defineModel();
</script>
