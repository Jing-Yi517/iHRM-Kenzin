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
          <el-col :span="4" :offset="18">
            <el-button size="mini">打卡范围</el-button>
            <el-button size="mini">报表</el-button>
            <el-button type="primary" size="mini" @click="isSettingDialogVisible=true">设置</el-button>
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
          <el-table-column label="序号" prop="id" width="120" />
          <el-table-column label="姓名" prop="username" width="120" />
          <el-table-column label="工号" prop="workNumber" width="120" />
          <el-table-column label="部门" prop="departmentName" width="120" />
          <el-table-column label="手机" prop="mobile" width="120" />
          <!-- 动态 attendanceRecord 列 -->
          <!-- 动态考勤列 -->
          <el-table-column
            v-for="(col, index) in tableData[0]?.attendanceRecord || []"
            :key="index"
            :label="parseDate(col.day)"
            width="140"
          >
            <template #default="scope">
              <el-popover
                placement="top"
                trigger="hover"
                popper-class="attendance-popover"
              >
                <el-card shadow="never" class="popover-card">
                  <template #header>
                    <el-row type="flex" justify="space-between" align="middle">
                      <div>{{ scope.row.username }}- {{ scope.row.attendanceRecord[index]?.day }}-考勤记录</div>
                      <el-tag
                        :type="getTagType(scope.row.attendanceRecord[index]?.adtStatu)"
                        class="attendance-tag"
                      >
                        {{ getAttendanceStatus(scope.row.attendanceRecord[index]?.adtStatu) }}
                      </el-tag>
                    </el-row>
                  </template>

                  <div class="pop-item"><strong>上班时间：</strong>{{ scope.row.attendanceRecord[index]?.adtInTime || "无" }}</div>
                  <div class="pop-item"><strong>上班地点：</strong>{{ scope.row.attendanceRecord[index]?.adtInPlace || "无" }}</div>
                  <div class="pop-item"><strong>下班时间：</strong>{{ scope.row.attendanceRecord[index]?.adtOutTime || "无" }}</div>
                  <div class="pop-item"><strong>下班地点：</strong>{{ scope.row.attendanceRecord[index]?.adtOutPlace || "无" }}</div>
                </el-card>

                <el-tag
                  slot="reference"
                  :type="getTagType(scope.row.attendanceRecord[index]?.adtStatu)"
                  class="attendance-tag"
                  @click="isModifyDialogVisible = true"
                >
                  {{ getAttendanceStatus(scope.row.attendanceRecord[index]?.adtStatu) }}
                </el-tag>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center">
          <el-pagination layout="prev,pager,next,total" :total="pagination.total" :page-size="pagination.pagesize" :current-page="pagination.page" @current-change="handlePageChange" />
        </el-row>
      </el-card>

      <AttendanceModifyDialog :is-modify-dialog-visible="isModifyDialogVisible" @closeDialog="isModifyDialogVisible=false" />
      <AttendanceSettingDialog :is-setting-dialog-visible="isSettingDialogVisible" @closeDialog="isSettingDialogVisible=false" />
    </div>
  </div>
</template>

<script>
import { getDepartmentInfo } from '@/api/department'
import { getAttendanceList } from '@/api/attendance'
import AttendanceModifyDialog from './components/AttendanceModifyDialog.vue'
import AttendanceSettingDialog from './components/AttendanceSettingDialog.vue'
export default {
  name: 'Attendance',
  components: { AttendanceModifyDialog, AttendanceSettingDialog },
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
      isTableLoading: false,
      isModifyDialogVisible: false,
      isSettingDialogVisible: false
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
      console.log(res)
      this.isTableLoading = false
      this.pagination.total = res.data.total
      this.tableData = res.data.rows
    },
    handlePageChange(page) {
      this.pagination.page = page
      this.getAttendanceList()
    },

    parseDate(dateStr) {
      if (!dateStr) return '-'
      const month = dateStr.substring(4, 6)
      const day = dateStr.substring(6, 8)

      return `${Number(month)}月 ${Number(day)}日`
    },

    // adtStatu 映射中文
    getAttendanceStatus(status) {
      const statusMap = {
        1: '正常',
        2: '旷工',
        3: '迟到',
        4: '早退',
        5: '外出',
        6: '出差',
        7: '年假',
        8: '事假',
        9: '病假',
        10: '婚假',
        11: '丧假',
        12: '产假',
        13: '奖励产假',
        14: '陪产假',
        15: '探亲假',
        16: '工伤假',
        17: '调休',
        18: '产检假',
        19: '流产假',
        20: '长期病假',
        21: '补签',
        22: '休息'
      }
      return statusMap[status] || '-'
    },

    getTagType(status) {
      if (!status) return 'info'

      // 旷工：红色
      if (status === 2) return 'danger'

      // 正常：绿色
      if (status === 1) return 'success'

      // 早退(4) 或 迟到(3)：黄色
      if (status === 3 || status === 4) return 'warning'

      // 请假、休息（7-21、22）：灰色
      if (status >= 7 || status === 22 || status === 5 || status === 6) return 'info'

      return 'info'
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

.attendance-tag{
  width: 60px;
  text-align: center;
}

.popover-card{
  width: 400px;
}

.pop-item{
  margin-bottom: 20px;
}
</style>
