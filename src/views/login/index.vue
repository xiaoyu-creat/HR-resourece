<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      class="login-form"
      auto-complete="on"
      label-position="left"
      :model="loginForm"
      :rules="rules"
    >
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>
      <el-form-item prop="mobile">
        <span class="svg-container el-icon-user-solid" />
        <el-input v-model="loginForm.mobile" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="pwd"
          v-model="loginForm.password"
          :type="passwordType"
        />
        <span class="svg-container" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye':'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" class="loginBtn" @click="login">登录</el-button>

      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
// 环境变量作用
// 1.正常公司中 有4个环境 开发dev，测试test，预发uat，上线pro
// 2.在项目里如何配置这几个环境 通过.env配置base api
// 开发环境的接口前缀 /api
// 线上环境的接口前缀 /prod-api

// 在 request.js中配置baseURL:process.env.VUE_APP_BASE_API
// import { validUsername } from '@/utils/validate'

// 密码盒子切换
// 1.点击闭上眼睛图片 --》睁开type text 图片变为 睁开眼睛
// 2.图片睁开眼睛 --》闭上 type password 图片变为 闭上眼睛

// - El-form-item绑定对应的属性，El-input 绑定对应的值
// - 手机号 必填 格式 按照国家要求来
// - 密码  必填  程度6，16

import { validPhone } from '@/utils/validate'
export default {
  name: 'Login',
  data() {
    // Validator接口有三个方法，可用于验证整个实体或仅验证实体的单个属性
    const phoneValid = (rules, value, callback) => {
      // rule 对应的规则
      // value 对应的值
      // callback 验证完成后调用的回调函数 验证通过直接调用 验证不通过 也是 调用 callback,但是会把错误信息 传递出去
      if (!validPhone(value)) {
        callback(new Error('格式错误'))
      } else {
        callback()
      }
    }
    return {
      passwordType: 'password',
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      rules: {
        mobile: [
          {
            required: true,
            message: '手机号必填',
            trigger: 'blur'
          },
          { validator: phoneValid, trigger: 'blur' }
          // {
          //   pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
          //   message: '手机号格式不正确',
          //   trigger: 'blur'
          // }
        ],
        password: [
          {
            required: true,
            message: '密码必填',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '密码格式不正确',
            trigger: 'blur'
          }
        ]
      },
      loading: false
    }
  },
  watch: {

  },
  methods: {
    showPwd() {
      this.passwordType === 'password' ? this.passwordType = '' : this.passwordType = 'password'
      this.$nextTick(() => {
        this.$refs.pwd.focus()
      })
    },
    async login() {
      try {
        // validate 对整个表单进行校验的方法，参数为一个回调函数。
        // 该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。
        // 若不传入回调函数，则会返回一个 promise
        await this.$refs.loginForm.validate()
        this.loading = true
        // 接口请求
        await this.$store.dispatch('user/loginAction', this.loginForm)
        // 跳转页面
        this.$router.push('/')
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
$light_gray:#68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url('~@/assets/common/login.jpg'); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
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

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7);
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__error {
    color: #fff
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
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
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

  .loginBtn {
  background: #407ffe;
  height: 64px;
  line-height: 32px;
  font-size: 24px;
  width:100%;
  margin-bottom:30px;
  border:none;
  color:#fff;
}

}
</style>
