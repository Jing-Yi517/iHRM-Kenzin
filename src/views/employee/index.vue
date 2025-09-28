<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input v-model="queryParams.keyword" style="margin-bottom:10px" type="text" prefix-icon="el-icon-search" size="small" placeholder="输入员工姓名全员搜索" @input="searchForEmployee" />
        <el-tree
          ref="deptTree"
          :data="dept"
          :props="treeSettings"
          :default-expand-all="true"
          :highlight-current="true"
          :expand-on-click-node="false"
          node-key="id"
          @current-change="handleTreeNodeChange"
        />
      </div>
      <div class="right">
        <el-row type="flex" justify="end" class="employee-operation-btn">
          <el-button type="primary" @click="handleAddEmployee">添加员工</el-button>
          <el-button @click="isDialogVisible=true">导入Excel</el-button>
          <el-button @click="handleExportExcel">导出Excel</el-button>
        </el-row>
        <el-row>
          <el-table v-loading="isTableLoading" :data="employee">
            <el-table-column align="center" label="头像" prop="staffPhoto">
              <template v-slot="scope">
                <el-avatar v-if="scope.row.staffPhoto" :src="scope.row.staffPhoto" :size="30" />
                <span v-else class="default-avatar">{{ scope.row.username.startsWith('黑马') ? scope.row.username.charAt(2) : scope.row.username.charAt(0) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="username">
              <template v-slot="scope">
                {{ scope.row.username.startsWith('黑马') ? scope.row.username.slice(2) : scope.row.username }}
              </template>
            </el-table-column>
            <el-table-column label="手机号" sortable prop="mobile" />
            <el-table-column label="工号" sortable prop="workNumber" />
            <el-table-column prop="formOfEmployment" label="聘用形式">
              <template v-slot="{ row }">
                <span v-if="row.formOfEmployment === 1">正式</span>
                <span v-else-if="row.formOfEmployment === 2">非正式</span>
                <span v-else>无</span>
              </template>
            </el-table-column>
            <el-table-column label="部门" prop="departmentName" />
            <el-table-column label="入职时间" sortable prop="timeOfEntry" />
            <el-table-column label="操作" width="280px">
              <template v-slot="scope">
                <el-button size="mini" type="text">查看</el-button>
                <el-button size="mini" type="text">角色</el-button>
                <el-popconfirm
                  title="确定要删除当前的员工吗?"
                  trigger="click"
                  @onConfirm="handleConfirmDelete(scope.row.id)"
                >
                  <el-button slot="reference" size="mini" type="text" style="margin-left: 10px;" :autofocus="true">删除</el-button>
                </el-popconfirm>

              </template></el-table-column>
          </el-table>
        </el-row>
        <el-row type="flex" justify="end" align="center">
          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :page-size="queryParams.pagesize"
            @current-change="handlePageChange"
          />
        </el-row>
      </div>
    </div>
    <ExcelImportDialog :is-dialog-visible.sync="isDialogVisible" @upload-success="getCurrentEmployee()" />
  </div>
</template>

<script>
import { getDepartmentInfo } from '@/api/department'
import { getEmployeeList, exportEmployeeExcel, deleteEmployee } from '@/api/employee'
import { list2Tree } from '@/utils'
import ExcelImportDialog from '@/views/employee/components/ExcelImportDialog.vue'
import FileSaver from 'file-saver'
export default {
  name: 'Employee',
  components: { ExcelImportDialog },
  data() {
    return {
      dept: [],
      employee: [],
      treeSettings: {
        label: 'name', // 设置显示的字段属性名
        children: 'children' // 设置子节点的属性名
      },
      queryParams: {
        departmentId: '',
        pagesize: 5,
        page: 1,
        keyword: ''
      },
      total: 0,
      isTableLoading: false,
      timer: '',
      isDialogVisible: false
    }
  },
  async created() {
    await this.getInitTree()
    await this.getCurrentEmployee()
  },
  methods: {
    /**
     * ? 初始化树形数据
     * * 该函数调用了department模块的数据获取方法，并转化为树形结构
     * * 将查询节点默认设置为根节点
     * * 等待渲染完成后，将el-tree的根节点设置为默认选中节点
     */
    async getInitTree() {
      const res = await getDepartmentInfo()
      this.dept = list2Tree(res, 0)
      this.queryParams.departmentId = this.dept[0].id
      this.$nextTick(() => {
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId) // 等待渲染完成后，默认选中根节点
      })
    },

    /**
     * ? 获取el-table el-pagination数据
     * * 设置了v-loading的优化
     */
    async getCurrentEmployee() {
      this.isTableLoading = true
      const res = await getEmployeeList({ ...this.queryParams })
      this.total = res.total
      this.employee = res.rows
      this.isTableLoading = false
    },

    /**
     * ? 监听到选中树节点改变的响应逻辑
     * @param data 当前选中节点的数据
     * * 将查询的页码改为 1
     */
    async handleTreeNodeChange(data) {
      this.queryParams.departmentId = data.id
      this.queryParams.page = 1 // 如果切换部门， 将页码设置为1
      await this.getCurrentEmployee()
    },

    /**
     * ? 监听到当前页码改变的响应逻辑，仅点击el-pagination时生效
     * @param currPage 当前页码
     */
    async handlePageChange(currPage) {
      this.queryParams.page = currPage
      await this.getCurrentEmployee()
    },

    /**
     * ? 监听 输入框的 input事件的响应逻辑
     * * 此处做了防抖处理
     */
    async searchForEmployee() {
      // 防抖
      clearTimeout(this.timer) // 清理上一次的定时器
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getCurrentEmployee()
      }, 300)
    },

    async handleExportExcel() {
      const loading = this.$loading({
        lock: true,
        text: '正在下载，请耐心等待',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await exportEmployeeExcel()
        FileSaver.saveAs(res, '员工列表.xlsx')
        this.$message({ type: 'success', message: '下载成功' })
      } catch (err) {
        this.$message({ type: 'error', message: '导出失败' + err })
      }

      loading.close()
    },
    async handleConfirmDelete(id) {
      try {
        await deleteEmployee(id)
        this.$message({ type: 'success', message: '删除成功' })
        if (this.queryParams.page > 1 && this.employee.length === 1) {
          this.queryParams.page--
        }
        this.getCurrentEmployee()
      } catch (err) {
        console.log(err)
      }
    },
    handleAddEmployee() {
      this.$router.push('/employee/detail')
    }

  }
}
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border: 1px solid #eaeef4
  }
  .right {
    flex: 1;
    padding: 20px;
    .employee-operation-btn{
      margin: 10px;
    }
    .avatar{
      width: 30px;
      height: 30px;
    }
    .default-avatar{
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}
</style>
