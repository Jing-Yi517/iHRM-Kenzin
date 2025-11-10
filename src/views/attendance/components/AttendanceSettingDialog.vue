<template>
  <el-dialog :visible="isSettingDialogVisible" width="1000px" @close="handleDialogClose">
    <template slot="title">
      <el-row type="flex" justify="start" style="font-size: 18px; margin-bottom: 30px;">考勤设置</el-row>
    </template>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="出勤设置" name="attendance">
        <el-form label-width="80px" :model="attendanceSettingForm">
          <el-form-item label="部门">
            <el-select v-model="attendanceSettingForm.departmentId">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="出勤时间">
            <div style="margin-bottom: 10px;">
              <el-time-select
                v-model="attendanceSettingForm.morningStartTime"
                :picker-options="{
                  start: '09:00',
                  step: '00:15',
                  end: '18:30'
                }"
              />
              -
              <el-time-select
                v-model="attendanceSettingForm.morningEndTime"
                :picker-options="{
                  start: '09:00',
                  step: '00:15',
                  end: '18:30'
                }"
              />
            </div>
            <div>
              <el-time-select
                v-model="attendanceSettingForm.afternoonStartTime"
                :picker-options="{
                  start: '09:00',
                  step: '00:15',
                  end: '18:30'
                }"
              />
              -
              <el-time-select
                v-model="attendanceSettingForm.afternoonEndTime"
                :picker-options="{
                  start: '09:00',
                  step: '00:15',
                  end: '18:30'
                }"
              />
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="请假设置" name="leave">
        <el-form>
          <el-form-item label="部门">
            <el-select v-model="attendanceSettingForm.departmentId">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-table>
            <el-table-column label="类型" width="100px " />
            <el-table-column label="是否可用" width="200px" />
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="扣款设置" name="punish">扣款设置</el-tab-pane>
      <el-tab-pane label="加班设置" name="overtime">加班设置</el-tab-pane>
      <el-row type="flex" justify="center">
        <el-button type="primary" @click="handleUpdate(activeTab)">确认修改</el-button>
        <el-button>取消</el-button>
      </el-row>
    </el-tabs>

  </el-dialog>
</template>

<script>
import { getAttendanceSetting, updateAttendanceSetting } from '@/api/attendance'
import { getDepartmentInfo } from '@/api/department'
export default {
  props: {
    isSettingDialogVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      activeTab: 'attendance',
      departmentList: [],
      attendanceSettingForm: {
        departmentId: 1,
        companyId: this.$store.state.user.userProfile.companyId,
        morningStartTime: null,
        morningEndTime: null,
        afternoonStartTime: null,
        afternoonEndTime: null

      }
    }
  },
  watch: {
    'attendanceSettingForm.departmentId'(newVal, oldVal) {
      this.getDepartmentAttendanceSetting(newVal)
    }
  },
  async created() {
    this.departmentList = await getDepartmentInfo()
    this.getDepartmentAttendanceSetting(1)
  },
  methods: {
    handleDialogClose() {
      this.$emit('closeDialog')
    },
    async getDepartmentAttendanceSetting(id = 1) {
      const res = await getAttendanceSetting(id)
      this.attendanceSettingForm.morningStartTime = res.morningStartTime
      this.attendanceSettingForm.morningEndTime = res.morningEndTime
      this.attendanceSettingForm.afternoonStartTime = res.afternoonStartTime
      this.attendanceSettingForm.afternoonEndTime = res.afternoonEndTime
    },
    async updateDepartmentAttendanceSetting() {
      await updateAttendanceSetting({ ...this.attendanceSettingForm })
      this.$message({
        type: 'success',
        message: '修改考勤时间成功'
      })
      this.$emit('closeDialog')
    },
    async handleUpdate(activeTab) {
      if (activeTab === 'attendance') {
        this.updateDepartmentAttendanceSetting()
      }
    }
  }
}
</script>

<style scoped>
.el-radio{
  width: 90px;
  margin-bottom: 10px;
}
</style>
