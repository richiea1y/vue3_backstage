<template>
  <div class="flex flex-col h-[100vh] items-center justify-center">
    <div class="login-block">
      <div class="login-form">
        <h1>Admin Backoffice</h1>
        <el-form @submit.prevent="handleSubmit" @keydown.enter.prevent="handleEnterKey">
          <el-form-item>
            <el-input type="text" placeholder="Username" />
          </el-form-item>
          <el-form-item>
            <el-input type="password" placeholder="Password" />
          </el-form-item>
          <el-form-item>
            <el-input type="text" placeholder="OTP" />
          </el-form-item>
        </el-form>
        <el-button type="success">Login</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const handleSubmit = async () => {
  console.log('Login');
};

const handleEnterKey = event => {
  if (event.key === 'Enter') {
    handleSubmit();
  }
};
</script>
