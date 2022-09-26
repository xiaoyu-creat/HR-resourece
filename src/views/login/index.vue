<template>
  <div class="login-container">
    <div class="login-form">
      <img class="logo-container" src="@/assets/common/logo.png" alt="">
      <el-form
        ref="loginForm"
        class="login-form"
        auto-complete="on"
        label-position="left"
        :model="loginForm"
        :rules="rules"
      >
        <el-form-item prop="loginName">
          <span class="svg-container el-icon-mobile-phone" />
          <el-input v-model="loginForm.loginName" placeholder="请输入账号" />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input ref="pwd" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" />
          <span class="svg-container" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye':'eye-open'" />
          </span>
        </el-form-item>

        <el-form-item>
          <span class="svg-container el-icon-s-claim" />
          <el-input v-model="loginForm.code" class="codeipt" placeholder="请输入验证码" />
          <div class="codepic" @click="getPic">
            <img :src="codeurl" alt="">
          </div>
        </el-form-item>

        <el-button :loading="loading" class="login-btn" @click="login">登录</el-button>

      </el-form>

    </div>
  </div>
</template>

<script>
import { getCodePic } from '@/api'
export default {
  name: 'Login',
  data() {
    return {
      passwordType: 'password',
      loginForm: {
        loginName: 'admin',
        password: 'admin',
        code: '',
        clientToken: '',
        loginType: 0
      },
      // 用户名和密码验证
      rules: {
        loginName: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          {
            pattern: /^[a-zA-Z0-9_-]{4,16}$/,
            message: '用户名格式错误',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 4,
            max: 16,
            message: '密码格式错误',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ]
      },
      loading: false,
      codeurl: ''
    }
  },
  watch: {
  },
  created() {
    this.getPic()
  },
  methods: {
    showPwd() {
      this.passwordType === 'password' ? this.passwordType = '' : this.passwordType = 'password'
      this.$nextTick(() => {
        this.$refs.pwd.focus()
      })
    },
    // 获取验证码图片
    async getPic() {
      this.loginForm.clientToken = Math.random()
      const res = await getCodePic(this.loginForm.clientToken)
      // this.codeurl = window.URL.createObjectURL(res.data)
      this.codeurl = res.request.responseURL
    },
    // 登录请求
    async login() {
      try {
        await this.$refs.loginForm.validate()
        this.loading = true
        // 接口请求
        await this.$store.dispatch('user/loginAction', this.loginForm)
        // 刷新验证码
        this.getPic()
        this.$router.push('/dashboard')
      } catch (error) {
        this.$toast(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#d4e3ff;
$light_gray:#818693;
$cursor: #ccc;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url('~@/assets/common/background.png'); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
    position: relative;
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      width: 70.8333333333%;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .codepic{
    position: absolute;
    right: 0;
    bottom: -3px;
    width: 29.1666666667%;
    height: 50px;
  }

  .el-form-item {
    width: 100%;
    height: 52px;
    margin-bottom: 24px;
    background: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
}
  }

</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: absolute;
    width: 518px;
    height: 388px;
    top: 50%;
    left: 50%;
    margin-top: -194px;
    margin-left: -259px;
    padding: 76px 35px 0;
    background: #fff;
    -webkit-box-shadow: 0 3px 70px 0 rgb(30 111 72 / 35%);
    box-shadow: 0 3px 70px 0 rgb(30 111 72 / 35%);
    border-radius: 10px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .logo-container {
    position: absolute;
    width: 96px;
    height: 96px;
    top: -46px;
    left: 50%;
    margin-left: -48px;
    z-index: 10;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .login-btn {
    width: 100%;
    height: 52px;
    background: linear-gradient(262deg,#2e50e1,#6878f0);
    opacity: .91;
    border-radius: 8px;
    color: #fff;
    text-shadow: 0 7px 22px #cfcfcf;
}
 .el-form-item__error {
    color: #fff
  }

}
</style>
