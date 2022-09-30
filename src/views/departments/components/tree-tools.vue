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
        // 现在 treeTools 和 addDept 是兄弟组件，在treeTools里控制 addDept的显示隐藏
        // 点击添加子部门拿到当前这个节点 对应数据 this.treeNode
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        // 修改
      } else {
        // 删除
      }
    }
  }
}
</script>

<style>

</style>
