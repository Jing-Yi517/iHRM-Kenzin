<template>
  <el-dialog :visible="isModifyDialogVisible" width="800px" @close="handleDialogClose">
    <template slot="title">
      <el-row type="flex" justify="center">{{ record.day }} (实际工作日考勤方案)</el-row>
    </template>

    <el-row>
      <div style="color: red; font-size: 17px; margin-bottom: 10px;">
        注：统计考勤时，异常状态优先正常状态
      </div>
    </el-row>

    <el-form>
      <el-form-item v-loading="isRadioLoading" label="考勤状态">
        <el-radio-group v-model="selectedStatus">
          <el-radio v-for="(label, value) in statusMap" :key="value" :label="Number(value)">
            {{ label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-row type="flex" justify="center">
      <el-button type="primary" @click="submitModify">确定</el-button>
      <el-button @click="handleDialogClose">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { modifyEmployeeAttendanceRecord, getLeaveSetting } from '@/api/attendance'

export default {
  props: {
    isModifyDialogVisible: { type: Boolean, default: false },
    record: { type: Object, required: true }
  },

  data() {
    return {
      selectedStatus: null, // 双向绑定 Radio,
      isRadioLoading: false,

      /** 固定考勤状态 (不通过配置控制的) */
      baseStatusMap: {
        1: '正常',
        2: '旷工',
        3: '迟到',
        4: '早退',
        5: '外出',
        6: '出差',
        21: '补签',
        22: '休息'
      },

      /** leaveType(60000~61300) → 对应 adtStatu(7~20) 映射表 */
      leaveTypeToStatus: {
        60000: 7, // 年假
        60100: 8, // 事假
        60200: 9, // 病假
        60300: 10, // 婚假
        60400: 11, // 丧假
        60500: 12, // 产假
        60600: 13, // 奖励产假
        60700: 14, // 陪产假
        60800: 15, // 探亲假
        60900: 16, // 工伤假
        61000: 17, // 调休
        61100: 18, // 产检假
        61200: 19, // 流产假
        61300: 20 // 长期病假
      },

      /** 最终用于展示在 radio 的 */
      statusMap: {}
    }
  },

  watch: {
    async isModifyDialogVisible(val) {
      if (!val) return

      this.selectedStatus = this.record?.adtStatu ?? null
      this.isRadioLoading = true
      const res = await getLeaveSetting(this.record.departmentId)
      this.isRadioLoading = false

      // 生成动态可选的假期
      const dynamic = {}
      res.forEach(item => {
        if (item.isEnable === 1) {
          const smallStatus = this.leaveTypeToStatus[item.leaveType] //  大编码 → 小编码
          if (smallStatus) {
            dynamic[smallStatus] = this.getStatusLabel(smallStatus)
          }
        }
      })

      // 组合成最终可选值
      this.statusMap = { ...this.baseStatusMap, ...dynamic }
    }
  },

  methods: {
    /** 返回小编码对应的中文名称 */
    getStatusLabel(smallCode) {
      return {
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
        20: '长期病假'
      }[smallCode]
    },

    handleDialogClose() {
      this.$emit('closeDialog')
    },

    /** ✅ 保存考勤时，发送小数字 adtStatu */
    async submitModify() {
      await modifyEmployeeAttendanceRecord(this.record.id, {
        userId: this.record.userId,
        day: this.record.day,
        adtStatu: this.selectedStatus, //  发的是小数字
        departmentId: this.record.departmentId
      })

      this.$message({ type: 'success', message: '更新成功' })
      this.$emit('success-modify')
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>
.el-radio {
  width: 90px;
  margin-bottom: 10px;
}
</style>
