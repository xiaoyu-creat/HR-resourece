<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <el-row :gutter="10">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="addRole">新增角色</el-button>
          </el-row>
          <el-table
            v-loading="loading"
            :data="roleList"
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              width="120"
              type="index"
            />
            <el-table-column
              label="角色"
              width="180"
              prop="name"
            />
            <el-table-column
              label="操作"
              prop="description"
            />
            <el-table-column
              label="描述"
              width="240px"
            >
              <template slot-scope="{row}">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- // background   添加背景
          // current-page 当前的页面
          // page-size    每一页展示的条数
          // page-sizes   每页显示个数选择器的选项设置
          // total        总共多少条数据
          // layout       布局
          // current-change 改变当前页码的触发（current-page 值改变的时候触发）
          // size-change 改变页面的数据条数的时候 触发（page-size 值改变的时候触发） -->
          <el-row type="flex" justify="end" align="middle" style="height: 60px">
            <el-pagination
              v-if="total>0"
              background
              layout="prev, pager, next, sizes"
              :total="total"
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              :page-sizes="[2,5,10,15]"
              @current-change="getRoleList"
              @size-change="getRoleList"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form :model="companyInfo" label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>

        </el-tab-pane>
      </el-tabs>
    </el-card>
    <add-role ref="addRole" :dialog-visible.sync="dialogVisible" @refreshList="getRoleList" />
    <!-- update:dialogvisible -->
  </div>
</template>

<script>
import { getRoleList, deleteRole, getCompanyInfo } from '@/api'
import addRole from './components/addRole.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Settings',
  components: { addRole },
  data() {
    return {
      activeName: 'first',
      page: {
        page: 1,
        pagesize: 10
      },
      total: 0,
      roleList: [],
      loading: false,
      dialogVisible: false,
      companyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { total, rows } = await getRoleList(this.page)
        this.total = total
        this.roleList = rows
        // total 大于0 并且rows的length === 0 这种情况并不是正在的没有数据 是有的，要重新发起请求
        if (total > 0 && rows.length === 0) {
          this.page.page--
          this.getRoleList()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    addRole() {
      this.dialogVisible = true
    },
    // 绑定点击事件
    // 拿到当前行这条数据
    // 回显再新增角色的组件上
    editRole(row) {
      // row直接赋值给addRole 的formData
      this.$refs.addRole.formData = { ...row } // 浅拷贝
      this.dialogVisible = true
      // 优化 数据是引用类型带来的问题
    },
    // 删除角色
    async delRole(id) {
      // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then((success) => {
      //   console.log(success)
      // }).catch((cancel) => {
      //   console.log(cancel)
      // })
      try {
        await this.$confirm('确认删除该角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // console.log('success')
        // 删除接口封装
        // 调用删除接口
        await deleteRole(id)
        // 刷新列表
        this.getRoleList()
      } catch (error) {
        // console.log('cancel')
      }
    },
    // 获取公司详情接口
    // 拿到companyId
    // this.$store.state.user.userInfo.companyId
    // this.$store.getters.companyId
    async getCompanyInfo() {
      this.companyInfo = await getCompanyInfo(this.companyId)
      console.log(this.companyInfo)
    }
  }
}
</script>

<style>

</style>
