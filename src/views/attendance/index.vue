<template>
  <div class="container">
    <div class="app-container">
      <el-card>
        <el-row type="flex" align="middle">
          <el-col :span="4">
            <div class="attendance-stats">
              <div class="text">未处理</div>
              <div class="stats">0</div>
            </div>
          </el-col>
          <el-col :span="2" :offset="18">
            <el-button size="mini">打卡范围</el-button>
            <el-button type="primary" size="mini">设置</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-form>
          <el-form-item label-width="50px" label="部门">
            <el-checkbox-group v-model="deptID">
              <el-checkbox v-for="(item) in departmentList" :key="item.id" :label="item.id">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card>
        <el-table v-loading="isTableLoading" :data="tableData">
          <el-table-column label="序号" prop="id" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="工号" prop="workNumber" />
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="手机" prop="mobile" />
          <el-table-column />
        </el-table>
        <el-row type="flex" justify="center">
          <el-pagination layout="prev,pager,next,total" :total="pagination.total" :page-size="pagination.pagesize" :current-page="pagination.page" @current-change="handlePageChange" />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getDepartmentInfo } from '@/api/department'
import { getAttendanceList } from '@/api/attendance'
export default {
  name: 'Attendance',
  data() {
    return {
      departmentList: [],
      deptID: [],
      tableData: [],
      pagination: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      isTableLoading: false
    }
  },
  watch: {
    deptID: {
      handler() {
        this.pagination.page = 1
        this.getAttendanceList()
      },
      deep: true
    }
  },
  async created() {
    this.departmentList = await getDepartmentInfo()
    this.getAttendanceList()
  },
  methods: {
    async getAttendanceList() {
      this.isTableLoading = true
      const res = await getAttendanceList({
        deptID: this.deptID.join(','),
        page: this.pagination.page,
        pagesize: this.pagination.pagesize
      })
      this.isTableLoading = false
      this.pagination.total = res.data.total
      this.tableData = res.data.rows
    },
    handlePageChange(page) {
      this.pagination.page = page
      this.getAttendanceList()
    }
  }
}
</script>

<style lang="scss" scoped>
.attendance-stats{
  height: 50px;
  text-align: center;
  .text {
    font-size: 18px;
    margin-top: 10px;
  }
  .stats{
    margin-top: 10px;
    font-size: 18px;
  }
}
</style>
