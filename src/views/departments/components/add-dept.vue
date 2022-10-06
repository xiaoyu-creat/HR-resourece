<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="title" :visible="dialogVisible" :before-close="handleClose">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addDeptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button v-loading="loading" type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, getEmployeeSimple, addDepartments, updateDepartments } from '@/api'
export default {
  name: 'HrasssAddDept',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 部门编码 在整个模块中都不允许重复
    // 拿到所有的部门数据  一个个的比较过去 如果出现重复 则校验不通过 否则校验通过
    const codeCheck = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = true
      // 编辑模式下  让我自己和自己校验？？
      // 解决方案 对比过程中 把自己排除掉 然后再去对比
      if (this.formData.id) { // 编辑
        // depts [{},{},{},我]
        // isRepeat = depts.some(ele => 排出自己 && ele.code === value)
        isRepeat = depts.some(ele => ele.id !== this.formData.id && ele.code === value)
        console.log(depts)
      } else {
        isRepeat = depts.some(ele => ele.code === value)
      }
      isRepeat ? callback(new Error(`模块下已存在${value}编码`)) : callback()
    }
    // 部门名称 同级部门中禁止出现重复部门
    // 重点 同级部门 是从所有部门中 把同级部门的数据筛选出来
    // 先确定 父ID
    // 先从 tree-tools 拿到数据 再把数据 送到父组件 父组件在吧数据给addDept
    const nameCheck = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // 编辑模式下 存在的问题：无法准确校验同级部门的数据(同级的列表找的不对)
      // 解决方案：先找到所有与自己处于同级的列表，然后再排出自己  然后判断
      //  找同级部门
      let isRepeat = true
      if (this.formData.id) { // 编辑
      // 找同级部门
      // depts ==> 找到真正的同级部门 pid
      // depts [{},{},{}....]
      // 排除自己 再判断名称是否重复
        const deptstj1 = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id)
        isRepeat = deptstj1.some(ele => ele.name === value)
      } else { // 新增子部门
        const deptstj = depts.filter(item => item.pid === this.treeNode.id)
        // console.log(deptstj)
        isRepeat = deptstj.some(ele => ele.name === value)
      }
      isRepeat ? callback(new Error(`模块下已存在${value}编码`)) : callback()
    }
    // 先拿到所有  同级部门的数据 一个个的比较过去 如果出现重复 则校验不通过 否则校验通过
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 部门名称（name）：必填 1-50个字符  / 同级部门中禁止出现重复部门
      // 部门编码（code）：必填 1-50个字符  / 部门编码在整个模块中都不允许重复
      // 部门负责人（manager）：必填
      // 部门介绍 ( introduce)：必填 1-300个字符
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: nameCheck, trigger: 'blur' }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: codeCheck, trigger: 'blur' }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      peoples: [], // 接收获取的员工简单列表的数据
      loading: false
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.addDeptForm.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    // 获取员工简单列表数据
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    async submit() {
      try {
        // 表单校验通过
        await this.$refs.addDeptForm.validate()
        // 调用新增接口
        // 因为是添加子部门 所以我么需要将新增的部门pid设置成当前部门的id，新增的部门就成了自己的子部门
        this.loading = true
        if (this.formData.id) { // 编辑
          await updateDepartments(this.formData)
        } else {
          await addDepartments({ ...this.formData, pid: this.treeNode.id })
        }
        // 确定按钮的loading状态
        // 接口新增成功之后 消息提示成功
        this.$message.success(`${this.formData.id ? '编辑' : '新增'}成功`)
        // 刷新父组件到的组织架构列表
        this.$parent.getDepartments()
        // 关闭弹窗
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
