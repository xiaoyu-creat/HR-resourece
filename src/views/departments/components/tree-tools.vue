<template>
  <el-row type="flex" justify="space-between" align="middle" style="heigth:40px;width:100%">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <span style="margin-right:10px">{{ treeNode.manager }}</span>
        <el-dropdown @command="handleCommand">
          <span>操作
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">添加子部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot" command="edit">编辑部门</el-dropdown-item>
            <el-dropdown-item v-if="isRoot" command="del">删除部门</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleCommand(type) {
      if (type === 'add') {
        // 新增
        // 现在 treeTools 和 addDept 是兄弟组件，在treeTools里控制 addDept的显示隐藏不方便
        // 点击添加子部门拿到当前这个节点 对应数据 this.treeNode
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        // 修改
        // 现在 treeTools 和 addDept 是兄弟组件，在treeTools里控制 addDept的显示隐藏不方便
        this.$emit('editDept', this.treeNode)
      } else {
        // 删除
        // 二次确认
        this.$confirm('是否确定删除该部门？', '提示', {
          type: 'warning'
        }).then(async res => {
          console.log(res)
          // 调用删除接口
          await delDepartments(this.treeNode.id)
        }).then(res => {
          this.$message.success('删除成功')
          // 通知父组件 getDepartments
          this.$emit('refreshList')
        })
      }
    }
  }
}
</script>

<style>

</style>
