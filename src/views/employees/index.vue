<template>
  <!-- 具名插槽 -->
  <!-- <template v-slot:before>
        <span>共25条数据</span>
      </template> -->
  <!-- <template #before>
        <span>共25条数据</span>
      </template> -->
  <!-- 作用域插槽 -->
  <!-- <template v-slot:before="scope">
        <span>共25条数据{{ scope }}</span>
      </template> -->
  <!-- 插槽语法
    1.新语法
    默认插槽
    具名插槽
    作用域插槽 -->
  <div class="app-container">
    <PageTools :is-show-before="true">
      <template #before>
        <span>共166条记录</span>
      </template>
      <template #after>
        <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
        <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
        <el-button size="small" type="primary" @click="handleDialog">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" type="index" sortable="" width="80" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatterFn" />
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState">
          <template slot-scope="{row}">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="goDetail(row)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next,sizes"
          :total="total"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[2,5,10]"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
    <addemployment :dialog-visible.sync="dialogVisible" />
  </div>
</template>
<script>
import EmployeeEnum from '@/api/constant/employees'
import PageTools from '@/components/PageTools'
import { getEmployeeList, delEmployee } from '@/api'
import addemployment from './components/add-employee.vue'
export default {
  components: { PageTools, addemployment },
  data() {
    return {
      page: {
        page: 1,
        size: 10
      },
      list: [],
      total: 0,
      loading: false,
      hireType: EmployeeEnum.hireType,
      dialogVisible: false
    }
  },
  mounted() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      try {
        this.loading = true
        const { total, rows } = await getEmployeeList(this.page)
        this.list = rows
        this.total = total
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    formatterFn(row, column, callValue) {
      const res = this.hireType.find(ele => ele.id === callValue)
      return res && res.value || '非正式'
      // return res ? res.value : ''
    },
    handleDialog() {
      this.dialogVisible = true
    },
    async del(id) {
      try {
        await this.$confirm('确定要删除该员工吗', '提示', {
          type: 'warning'
        })
        // 调用删除接口
        await delEmployee(id)
        // 刷新页面
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },

    async exportExcel() {
      // 文件懒加载
      // import {export_json_to_excel} from '@/vender/Export2Excel.js'
      const { export_json_to_excel } = await import('@/vender/Export2Excel.js')
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.total
      })
      // console.log(rows)

      // 表头数据
      // 表内容的数据
      // [[],[]]
      // 二维数组内容的数据结构：每一行的数据，顺序和表头保持一致
      // const header = ['手机号', '姓名', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      // 表内容的数据和员工列表相同，所以根据员工列表生成
      const exportExcelMapPath = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const header = Object.keys(exportExcelMapPath)
      const data = rows.map(item => {
        // []
        // 根据表头获得跟表头长度一样的数组
        return header.map(h => {
          // 循环表头为手机号
          // item mobile
          if (h === '聘用形式') {
            const find = this.hireType.find(hire => hire.id === item[exportExcelMapPath[h]])
            return find ? find.value : '未知'
          }
          return item[exportExcelMapPath[h]]
        })
      })

      export_json_to_excel({
        header, // 表头 必填
        multiHeader: [['手机号', '员工信息', '其他信息']],
        merges: ['A1:A2', 'B1:E1', 'F1:G1'],
        // data里面的二维数组，每一个数组是一行的数据
        data, // 具体数据 必填
        filename: '黑马员工表', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    // 查看员工详情
    goDetail(row) {
      // 编程式导航
      this.$router.push('/employees/detail/' + row.id)
    }
  }
}
</script>

<style>

</style>
