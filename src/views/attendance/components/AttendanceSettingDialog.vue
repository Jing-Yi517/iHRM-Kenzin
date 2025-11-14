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
        <el-form label-width="80px">
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

      <el-tab-pane label="扣款设置" name="punish">
        <el-form label-width="110px">

          <!-- 部门 -->
          <el-form-item label="部门">
            <el-select v-model="punishSettingForm.departmentId">
              <el-option
                v-for="dep in departmentList"
                :key="dep.id"
                :value="dep.id"
                :label="dep.name"
              />
            </el-select>
          </el-form-item>

          <div v-for="(rule) in punishSettingForm.rules" :key="rule.dedTypeCode">
            <el-card class="rule-card" shadow="never">
              <div slot="header">
                {{ getRuleName(rule.dedTypeCode) }}
              </div>

              <el-form-item label="是否启用">
                <el-switch
                  v-model="rule.isEnable"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>

              <template v-if="rule.dedTypeCode !== '53000'">
                <el-form-item label="时间下限(分钟)">
                  <el-input v-model="rule.periodLowerLimit" style="width: 120px" />
                </el-form-item>

                <el-form-item label="时间上限(分钟)">
                  <el-input v-model="rule.periodUpperLimit" style="width: 120px" />
                </el-form-item>

                <el-form-item label="次数下限">
                  <el-input v-model="rule.timesLowerLimit" style="width: 120px" />
                </el-form-item>

                <el-form-item label="次数上限">
                  <el-input v-model="rule.timesUpperLimit" style="width: 120px" />
                </el-form-item>

                <el-form-item label="金额下限(元)">
                  <el-input v-model="rule.dedAmonutLowerLimit" style="width: 120px" />
                </el-form-item>

                <el-form-item label="金额上限(元)">
                  <el-input v-model="rule.dedAmonutUpperLimit" style="width: 120px" />
                </el-form-item>
              </template>

              <!-- 53000 旷工扣款：单独版本 -->
              <template v-else>
                <el-form-item label="扣款倍数">
                  <el-input v-model="rule.fineSalaryMultiples" style="width: 120px" />
                </el-form-item>
              </template>

            </el-card>
          </div>

        </el-form>
      </el-tab-pane>

      <el-tab-pane label="加班设置" name="overtime">
        <el-form label-width="100px">
          <el-form-item label="部门">
            <el-select v-model="overtimeSettingForm.departmentId">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="加班规则">
            <div v-for="(rule, index) in overtimeSettingForm.rules" :key="index" class="overtime-rules">
              <el-switch v-model="rule.isEnable" :active-value="1" :inactive-value="0" :active-text="rule.rule" />
              <div>
                <el-radio
                  v-model="rule.isTimeOff"
                  :label="'1'"
                >
                  调休
                </el-radio>

                <el-time-select
                  v-model="rule.ruleStartTime"
                  :clearable="false"
                  :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '23:59'
                  }"
                />

                <el-time-select
                  v-model="rule.ruleEndTime"
                  :clearable="false"
                  :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '23:59'
                  }"
                />
              </div>
            </div>
          </el-form-item>

          <el-form-item label="打卡验证">
            <el-switch
              v-model="overtimeSettingForm.isClock"
              :active-value="1"
              :inactive-value="0"
              active-text="加班需要有打卡记录"
            />
          </el-form-item>

          <el-form-item label="开启补偿">
            <el-switch
              v-model="overtimeSettingForm.isCompensationint"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>

          <el-form-item label="调休假设置">
            <div>
              最晚有效期：次年
              <el-date-picker
                v-model="overtimeSettingForm.latestEffectDate"
                :editable="false"
                type="date"
                format="M-dd"
                value-format="M-dd"
                :clearable="false"
              />
            </div>

            <div style="margin-top: 10px;">
              请假最小单位
              <el-input v-model="overtimeSettingForm.unit" style="width: 60px" type="number" />
              天
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-row type="flex" justify="center">
        <el-button type="primary" @click="handleUpdate(activeTab)">确认修改</el-button>
        <el-button @click="handleDialogClose">取消</el-button>
      </el-row>

    </el-tabs>

  </el-dialog>
</template>

<script>
import { getAttendanceSetting, updateAttendanceSetting, getLeaveSetting, updateLeaveSetting, getOvertimeSetting, updateOvertimeSetting, getPunishSetting, updatePunishSetting } from '@/api/attendance'
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
      ],
      overtimeSettingForm: {
        departmentId: 1,
        isClock: 0,
        isCompensationint: 0,
        latestEffectDate: '2023-06-27',
        unit: 1,
        rules: []
      },
      punishSettingForm: {
        departmentId: 1,

        // 因为接口要求数组，所以前端也用数组更自然
        rules: [
          // 5100: 迟到
          {
            dedTypeCode: '51000',
            isEnable: '0',
            periodLowerLimit: '',
            periodUpperLimit: '',
            timesLowerLimit: '',
            timesUpperLimit: '',
            dedAmonutLowerLimit: '',
            dedAmonutUpperLimit: '',
            absenceDays: '',
            fineSalaryMultiples: '',
            absenceTimesUpperLimt: ''
          },
          // 5200: 早退
          {
            dedTypeCode: '52000',
            isEnable: '0',
            periodLowerLimit: '',
            periodUpperLimit: '',
            timesLowerLimit: '',
            timesUpperLimit: '',
            dedAmonutLowerLimit: '',
            dedAmonutUpperLimit: '',
            absenceDays: '',
            fineSalaryMultiples: '',
            absenceTimesUpperLimt: ''
          },
          // 5300: 旷工
          {
            dedTypeCode: '53000',
            isEnable: '0',
            periodLowerLimit: '',
            periodUpperLimit: '',
            timesLowerLimit: '',
            timesUpperLimit: '',
            dedAmonutLowerLimit: '',
            dedAmonutUpperLimit: '',
            absenceDays: '',
            fineSalaryMultiples: '',
            absenceTimesUpperLimt: ''
          }
        ]
      }
    }
  },
  watch: {
    'attendanceSettingForm.departmentId'(newVal, oldVal) {
      this.getDepartmentAttendanceSetting(newVal)
    },
    'leaveSettingForm.departmentId'(newVal) {
      this.getDepartmentLeaveSetting(newVal)
    },
    'overtimeSettingForm.departmentId'(newVal) {
      this.getDepartmentOvertimeSetting(newVal)
    },
    'punishSettingForm.departmentId'(newVal) {
      this.getDepartmentPunishSetting(newVal)
    }
  },
  async created() {
    this.departmentList = await getDepartmentInfo()
    this.getDepartmentAttendanceSetting(1)
    this.getDepartmentLeaveSetting(1)
    this.getDepartmentOvertimeSetting(1)
    this.getDepartmentPunishSetting(1)
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

    async getDepartmentOvertimeSetting(departmentId = 1) {
      const res = await getOvertimeSetting(departmentId)

      this.overtimeSettingForm.isClock = res.extraDutyConfig.isClock
      this.overtimeSettingForm.isCompensationint = res.extraDutyConfig.isCompensationint
      this.overtimeSettingForm.latestEffectDate = res.dayOffConfigs.latestEffectDate
      this.overtimeSettingForm.unit = res.dayOffConfigs.unit
      this.overtimeSettingForm.rules = res.extraDutyRuleList
    },
    async updateDepartmentOvertimeSetting() {
      await updateOvertimeSetting({ ...this.overtimeSettingForm })
      this.$message({
        type: 'success',
        message: '更改加班设置成功'
      })
      this.$emit('closeDialog')
    },

    async getDepartmentPunishSetting(departmentId = 1) {
      const res = await getPunishSetting(departmentId)
      this.punishSettingForm.rules = res
    },
    async updateDepartmentPunishSetting() {
      await updatePunishSetting(this.punishSettingForm.rules)
      this.$message({
        type: 'success',
        message: '更改加班设置成功'
      })
      this.$emit('closeDialog')
    },

    async handleUpdate(activeTab) {
      if (activeTab === 'attendance') {
        this.updateDepartmentAttendanceSetting()
      } else if (activeTab === 'leave') {
        this.updateDepartmentLeaveSetting()
      } else if (activeTab === 'overtime') {
        this.updateDepartmentOvertimeSetting()
      } else {
        this.updateDepartmentPunishSetting()
      }
    },
    getRuleName(code) {
      switch (code) {
        case '51000': return '迟到扣款'
        case '52000': return '早退扣款'
        case '53000': return '旷工扣款'
        default: return '扣款规则'
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

.overtime-rules{
  display: flex;
  align-items: center;
  justify-content: space-between;

}
</style>
