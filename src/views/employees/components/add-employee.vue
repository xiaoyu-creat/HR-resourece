<template>
  <el-dialog title="新增员工" :visible="dialogVisible" @close="handleClose">
    <!-- 表单 -->
    <el-form ref="addEmploy" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree
          v-show="isShow"
          v-loading="loading"
          style="width:80%"
          :data="treeData"
          :props="{label:'name'}"
          default-expand-all
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
//  实现弹窗组件的显示和隐藏
//  其实 el-dialog 组件显示 隐藏 visible
//  父到子 props
//  点击关闭按钮 close $emit 去改父组件里的值 (upate:dialogVisible)
//  handleClose 完善 // 1. 表单重置 2.表单绑定的值从新赋值

// 数据校验
// - 用户名必填，username，长度为1-4位
// - 手机号必填，mobile，需满足 正则表达式 /^1[3-9]\d{9}$/
// - 聘用形式必填， formOfEmployment
// - 工号必填，workNumber
// - 部门必填，departmentName
// - 入职时间必填， timeOfEntry
// - 转正时间可选，correctionTime
import employeesEnum from '@/api/constant/employees'
import { getDepartments, addEmployee } from '@/api'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'HrsaasAddEmployee',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      hireType: employeesEnum.hireType,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: 'Please enter a username', trigger: 'blur' },
          { min: 1, max: 4, message: 'username 1~4', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: 'Please enter a mobile', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: 'mobile 不满足格式', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: 'Please enter a formOfEmployment' }
        ],
        timeOfEntry: [
          { required: true, message: 'Please enter a timeOfEntry' }
        ],
        workNumber: [
          { required: true, message: 'Please enter a workNumber', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: 'Please enter a departmentName' }
        ]
      },
      treeData: [{ name: '行政部', manager: '刘备' }],
      isShow: false,
      loading: false
    }
  },
  methods: {
    handleClose() {
      // 重置表单
      this.$refs.addEmploy.resetFields()
      //   重新赋值
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 通知父组件关闭弹窗
      this.$emit('update:dialogVisible', false)
    },
    async getDepartments() {
      this.isShow = true
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(node) {
    //   console.log(node)
      // 选中树中的节点，把树种的节点给formData 的 departmentName
      this.formData.departmentName = node.name
      //   细节问题
      //   el-tree显示隐藏问题
      //   el-tree loading状态
      this.isShow = false
    },
    // 点击确定按钮调用接口完成新增功能
    // 1.封装接口 复制
    // 2.确定按钮 点击事件 form校验通过之后 调用接口 引入接口
    // 3.调用接口成功 父组件刷新列表
    async btnOk() {
      try {
        // 表单校验通过
        await this.$refs.addEmploy.validate()
        // 调用接口
        await addEmployee(this.formData)
        // 关闭弹窗
        this.handleClose()
        // 调用父组件刷新列表
        this.$parent.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
