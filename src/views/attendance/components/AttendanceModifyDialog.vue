<template>
  <el-dialog :visible="isModifyDialogVisible" width="800px" @close="handleDialogClose">
    <template slot="title">
      <el-row type="flex" justify="center">{{ record.day }}(实际工作日考勤方案)</el-row>
    </template>

    <el-row>
      <div style="color: red; font-size: 17px; margin-bottom: 10px;">注：统计考勤时，异常状态优先正常状态</div>
    </el-row>
    <el-form>
      <el-form-item label="考勤状态">
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
import { modifyEmployeeAttendanceRecord } from '@/api/attendance'
export default {
  props: {
    isModifyDialogVisible: {
      type: Boolean,
      default: false
    },
    record: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedStatus: null, // 双向绑定到 radio
      statusMap: {
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
    }
  },
  watch: {
    isModifyDialogVisible(val) {
      if (val) {
        this.selectedStatus = this.record?.adtStatu ?? null
      }
    }
  },
  methods: {
    handleDialogClose() {
      this.$emit('closeDialog')
    },

    async submitModify() {
      await modifyEmployeeAttendanceRecord(this.record.id, { userId: this.record.userId, day: this.record.day, adtStatu: this.selectedStatus, departmentId: this.record.departmentId })
      this.$message({ type: 'success', message: '更新成功' })
      this.$emit('success-modify')
      this.$emit('closeDialog')
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
