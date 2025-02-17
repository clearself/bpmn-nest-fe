<template>
  <div class="login-container">
    <div class="lang-change">
      <I18n />
    </div>
    <div class="pt-2 login-card">
      <a-form :model="loginForm" layout="vertical" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item
          :label="$t('login.userName')"
          name="username"
          :rules="[{ required: true, message: '请输入用户名！' }]"
        >
          <a-input v-model:value="loginForm.username" />
        </a-form-item>

        <a-form-item
          :label="$t('login.password')"
          name="password"
          :rules="[{ required: true, message: '请输入密码！' }]"
        >
          <a-input-password v-model:value="loginForm.password" />
        </a-form-item>
        <a-form-item :label="$t('login.captcha')" name="code" :rules="[{ required: true, message: '请输入验证码！' }]">
          <div class="w100 ub ub-ac">
            <div class="ub ub-f1">
              <a-input v-model:value="loginForm.code" />
            </div>
            <div class="captcha" @click="refreshCode">
              <span v-html="captchaUrl" />
            </div>
          </div>
        </a-form-item>
        <a-checkbox v-model:checked="loginForm.rememberMe">记住密码</a-checkbox>
        <div class="ub w100 ub-ac ub-pc mt-4">
          <a-button :loading="loading" style="width: 100%" type="primary" html-type="submit">登 录</a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router' //路由
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import useUserStoreHook from '@/store/modules/user'

import { message } from 'ant-design-vue'
import { setToken } from '@/utils/tools'
import { getCaptcha } from './server'
const userStore = useUserStoreHook()
const router = useRouter()

const route = useRoute()
const captchaUrl = ref('')
const loading = ref(false)
// 验证码开关
const captchaEnabled = ref(true)
interface loginFormProps {
  username: string
  password: string
  rememberMe: boolean
  code?: string
  uuid?: string
}
const loginForm = ref<loginFormProps>({
  username: 'admin',
  password: '123456',
  rememberMe: false,
  code: '',
  uuid: ''
})

// 注册开关
// const register = ref(false)
const redirect = ref<any>(undefined)

watch(
  route,
  (newRoute) => {
    redirect.value = newRoute.query && newRoute.query.redirect
  },
  { immediate: true }
)
const refreshCode = async () => {
  const res: ApiResponseData = await getCaptcha()
  console.log(res, '验证码')
  if (res?.code === 200) {
    captchaEnabled.value = res.data.captchaEnabled === undefined ? true : res.data.captchaEnabled
    captchaUrl.value = res.data.img
    loginForm.value.uuid = res.data.uuid
  }
}
const getCookie = () => {
  const username = Cookies.get('username')
  const password = Cookies.get('password')
  const rememberMe = Cookies.get('rememberMe')
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  }
}
const onFinish = async () => {
  loading.value = true
  // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
  if (loginForm.value.rememberMe) {
    Cookies.set('username', loginForm.value.username, { expires: 30 })
    Cookies.set('password', encrypt(loginForm.value.password), { expires: 30 })
    Cookies.set('rememberMe', loginForm.value.rememberMe, { expires: 30 })
  } else {
    // 否则移除
    Cookies.remove('username')
    Cookies.remove('password')
    Cookies.remove('rememberMe')
  }
  // 调用action的登录方法
  userStore
    .login(loginForm.value)
    .then(() => {
      message.success('登陆成功！')
      setTimeout(() => {
        router.push({ path: '/' })
      }, 500)
    })
    .catch(() => {
      loading.value = false
      // 重新获取验证码
      if (captchaEnabled.value) {
        refreshCode()
      }
    })
}
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

refreshCode()
getCookie()
</script>
<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  background-color: #f2f3f5;
  background-image: url(@/assets/imgs/login_bg.jpg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  .theme-switch {
    position: fixed;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }

  .login-card {
    width: 480px;
    border-radius: 20px;
    // box-shadow: 0 0 10px #dcdfe6;
    background-color: rgba(255, 255, 255, 1);
    padding: 40px 40px;

    overflow: hidden;
    .captcha {
      cursor: pointer;
    }
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100px;
      img {
        width: 80%;
      }
    }

    .content {
      padding: 20px 20px 40px;
      .content-item {
        height: 100px;
        padding: 20px;
        background-color: #f2f3f5;
        border-radius: 10px;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.3s ease-in-out;
        &:hover {
          background-color: darken($default-theme-color, 10%);
          > div:nth-child(1) {
            color: #ffffff;
          }
          .con-title,
          .text,
          .arraw {
            color: #ffffff;
          }
        }
        > div:nth-child(1) {
          font-size: 30px;
          margin-right: 10px;
          color: $default-theme-color;
          transition: all 0.5s ease-in-out;
        }
        .con-title {
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease-in-out;
        }
        .text {
          transition: all 0.3s ease-in-out;
        }
        .arraw {
          color: $default-theme-color;
          transition: all 0.3s ease-in-out;
        }
      }
      .a-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
