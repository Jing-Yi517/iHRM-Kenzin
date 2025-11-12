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
            <el-select v-model="leaveSettingForm.departmentId">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-table :data="leaveTypeList" border>
            <el-table-column prop="name" label="类型" width="200" />
            <el-table-column label="是否启用" width="200">
              <template v-slot="{row}">
                <el-switch
                  v-model="row.isEnable"
                  :active-value="1"
                  :inactive-value="0"
                />
              </template>
            </el-table-column>
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
import { getAttendanceSetting, updateAttendanceSetting, getLeaveSetting, updateLeaveSetting } from '@/api/attendance'
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
      },
      leaveSettingForm: {
        departmentId: 1
      },
      leaveTypeList: [
        { name: '年假', leaveType: '60000', isEnable: 0 },
        { name: '事假', leaveType: '60100', isEnable: 0 },
        { name: '病假', leaveType: '60200', isEnable: 0 },
        { name: '婚假', leaveType: '60300', isEnable: 0 },
        { name: '丧假', leaveType: '60400', isEnable: 0 },
        { name: '产假', leaveType: '60500', isEnable: 0 },
        { name: '奖励产假', leaveType: '60600', isEnable: 0 },
        { name: '陪产假', leaveType: '60700', isEnable: 0 },
        { name: '探亲假', leaveType: '60800', isEnable: 0 },
        { name: '工伤假', leaveType: '60900', isEnable: 0 },
        { name: '调休假', leaveType: '61000', isEnable: 0 },
        { name: '产检假', leaveType: '61100', isEnable: 0 },
        { name: '流产假', leaveType: '61200', isEnable: 0 },
        { name: '长期病假', leaveType: '61300', isEnable: 0 }
      ]
    }
  },
  watch: {
    'attendanceSettingForm.departmentId'(newVal, oldVal) {
      this.getDepartmentAttendanceSetting(newVal)
    },
    'leaveSettingForm.departmentId'(newVal) {
      this.getDepartmentLeaveSetting(newVal)
    }
  },
  async created() {
    this.departmentList = await getDepartmentInfo()
    this.getDepartmentAttendanceSetting(1)
    this.getDepartmentLeaveSetting(1)
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
    async getDepartmentLeaveSetting(departmentId) {
      const res = await getLeaveSetting(departmentId)
      console.log(res)
      this.leaveTypeList.forEach(item => {
        const match = res.find(r => r.leaveType === item.leaveType)
        item.isEnable = match ? match.isEnable : 0
      })
    },

    async updateDepartmentLeaveSetting() {
      const leaveTypeListWithDepartmentId = this.leaveTypeList.map(item => ({
        ...item,
        departmentId: this.leaveSettingForm.departmentId
      }))

      await updateLeaveSetting(leaveTypeListWithDepartmentId)
      this.$message({
        type: 'success',
        message: '更改请假设置成功'
      })
      this.$emit('closeDialog')
    },
    async handleUpdate(activeTab) {
      if (activeTab === 'attendance') {
        this.updateDepartmentAttendanceSetting()
      } else if (activeTab === 'leave') {
        this.updateDepartmentLeaveSetting()
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
