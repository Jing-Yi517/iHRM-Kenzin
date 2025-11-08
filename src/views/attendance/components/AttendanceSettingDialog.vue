<template>
  <el-dialog :visible="isSettingDialogVisible" width="800px" @close="handleDialogClose">
    <template slot="title">
      <el-row type="flex" justify="center">xx/xx(实际工作日考勤方案)</el-row>
    </template>

    <el-row>
      <div style="color: red; font-size: 17px; margin-bottom: 10px;">注：统计考勤时，异常状态优先正常状态</div>
    </el-row>
    <el-form>
      <el-form-item label="考勤状态">
        <el-radio-group v-model="selectedStatus">
          <el-radio v-for="(label, value) in statusMap" :key="value" :label="value">
            {{ label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-row type="flex" justify="center">
      <el-button type="primary" @click="submitStatus">确定</el-button>
      <el-button @click="handleDialogClose">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isSettingDialogVisible: {
      type: Boolean,
      default: false
    },

    defaultStatus: { // 外部传入当前考勤状态
      type: Number,
      default: null
    }
  },
  data() {
    return {
      selectedStatus: this.defaultStatus, // 双向绑定到 radio
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
  methods: {
    handleDialogClose() {
      this.$emit('closeDialog')
    },

    submitStatus() {
      this.$emit('submitStatus', this.selectedStatus)
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
