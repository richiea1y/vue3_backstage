<template>
  <div class="flex flex-col h-[100vh] items-center justify-center">
    <div class="login-block">
      <div class="login-form">
        <h1>Admin Backoffice</h1>
        <el-form @submit.prevent="handleSubmit" @keydown.enter.prevent="handleEnterKey">
          <el-form-item>
            <el-input v-model="loginForm.username" type="text" placeholder="Username" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="loginForm.password" type="password" placeholder="Password" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="loginForm.otp" type="text" placeholder="OTP" />
          </el-form-item>
        </el-form>
        <el-button type="success" @click="handleSubmit">Login</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { getOtp, userLogin } from '@/service/api';
import to from 'await-to-js';
import { useRouter } from 'vue-router';

const router = useRouter();

const loginForm = ref({
  username: '',
  password: '',
  otp: ''
});

/** Get OTP */
const getOtpNumbers = async () => {
  const [err, res] = await to(getOtp());
  console.log('OTP:', res);
  if (res.status === 200) {
    loginForm.value.otp = res.data.Data.OTP;
  }
};

const handleSubmit = async () => {
  const [err, res] = await to(
    userLogin({
      Account: loginForm.value.username,
      Password: loginForm.value.password,
      OTP: loginForm.value.otp
    })
  );
  console.log('###Login: ', res);
  if (res.status === 200) {
    localStorage.setItem('token', res.data.Data.Token);
    localStorage.setItem('user', JSON.stringify(res.data.Data.Info));
    router.push('/');
  }
};

const handleEnterKey = event => {
  if (event.key === 'Enter') {
    handleSubmit();
  }
};

onMounted(async () => {
  await nextTick();
  await getOtpNumbers();
});
</script>
