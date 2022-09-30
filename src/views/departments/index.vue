<template>
  <div class="departments-container">
    <el-card>
      <treeTools :tree-node="company" :is-root="false" @addDept="handleAddRole" />
    </el-card>
    <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
      <!-- el-tree 里面的内容 就是插槽内容--填坑内容 --》有多少个节点循环多少次 -->
      <!-- scope-scope 是tree组件传给每个节点的插槽的内容的数据 -->
      <!-- 顺序一定是 执行 slot-scope赋值 才去执行props的传值 -->
      <treeTools slot-scope="{data}" :tree-node="data" @addDept="handleAddRole" />
    </el-tree>
    <!-- 放置新增弹层组件  -->
    <add-dept :dialog-visible.sync="dialogVisible" :tree-node="currentNode" />
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue' // 引入新增部门组件
export default {
  components: { treeTools, AddDept },
  data() {
    return {
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      defaultProps: {
        label: 'name'
      },
      departs: [
        { name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      dialogVisible: false, // 显示窗体
      currentNode: {}
    }
  },
  mounted() {
    this.getDepartments()
  },
  methods: {
    // 组织架构数据
    async getDepartments() {
      const { depts, companyManage, companyName } = await getDepartments()
      this.departs = tranListToTreeData(depts, '')
      this.company = { name: companyName, manager: companyManage, id: '' }
    },
    handleAddRole(node) {
      // addDept 显示
      // addDept 组件引入
      // addDept 组件 绑定变量 dialogVisible
      this.dialogVisible = true
      this.currentNode = node
    }
  }
}
</script>

<style lang="scss">
.departments-container {
  width: 900px;
  margin: 20px auto;
  .el-tree {
    .el-card__body {
    padding-right: 0px;
    }
  }
}
</style>
