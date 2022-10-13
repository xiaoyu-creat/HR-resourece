<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-tabs v-model="activeName" @tab-click="tabClick">
          <el-tab-pane lazy label="登录账户设置" name="first">
            <!--
                form表单校验：
                1.form组件： :model="表单数据" :rules="校验规则"
                2.form-item：prop属性
             -->
            <el-form ref="form" :model="accountInfo" :rules="accountInfoRules" label-width="80px">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="accountInfo.username" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="accountInfo.password" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateEmployees">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane lazy label="个人详情" name="second">
            <user-info />
          </el-tab-pane>
          <el-tab-pane lazy label="岗位设置" name="third">
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api'
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
import Cookies from 'js-cookie'
export default {
  components: { UserInfo, JobInfo },
  data() {
    return {
      activeName: Cookies.get('activeName') || 'first',
      accountInfo: {}, // 存储用户信息
      accountInfoRules: {
        username: [
          { required: true, message: '请输入员工名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2~10位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入员工密码', trigger: 'blur' },
          { min: 6, message: '长度不能少于6位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadEmpolyeesInfo()
  },
  methods: {
    async loadEmpolyeesInfo() {
      const res = await getUserDetailById(this.$route.params.id)
      this.accountInfo = res
    },
    // 更新用户信息
    async updateEmployees() {
      // await 和 async 有什么缺点
      // 必须通过try catch 才能捕获到错误
      try {
        await this.$refs.form.validate()
        await saveUserDetailById(this.accountInfo)
        this.$message.success('更新成功')
      } catch (error) {
        console.log(error)
      }
    },
    tabClick() {
      Cookies.set('activeName', this.activeName)
    }
  }
}
</script>

<style>

</style>
