<template>
  <div class="container">
    <div class="app-container">
      <el-row type="flex">
        <el-col :span="18">
          <el-row>
            <el-card>
              <el-row>
                <el-col :span="3">
                  <p>姓名：{{ approvalDetails.username }}</p>
                  <p>部门：{{ approvalDetails.departmentName }}</p>
                </el-col>
                <el-col :span="3" :offset="1">
                  <p>入职时间：{{ approvalDetails.timeOfEntry }}</p>
                </el-col>
              </el-row>
            </el-card>
            <el-card>
              <el-row v-if="approvalType === 1">
                <p>请假申请</p>
                <el-col :span="3">
                  <p>审批类型：{{ procData.processName }}</p>
                  <p>休假类别：{{ procData.holidayType === "1" ? '事假': '' }}</p>
                  <p>请假时长：{{ procData.duration }}</p>
                  <p>申请事由：{{ procData.reason }}</p>
                </el-col>
                <el-col :span="5" :offset="1">
                  <p>开始时间：{{ procData.startTime }}</p>
                  <p>结束时间：{{ procData.endTime }}</p>
                  <p>申请单位：{{ procData.applyUnit }}</p>
                  <p>审批状态：
                    {{
                      approvalDetails.processState === 1
                        ? '审批中'
                        : approvalDetails.processState === 2
                          ? '已通过'
                          : approvalDetails.processState === 3
                            ? '已拒绝'
                            : '已撤销'
                    }}
                  </p>
                </el-col>
              </el-row>
              <el-row v-else-if="approvalType === 2">
                <p>加班申请</p>
                <el-col :span="5">
                  <p>补偿方式：{{ procData.compensation }}</p>
                  <p>加班结束时间：{{ procData.end_time }}</p>
                </el-col>
                <el-col :span="5" :offset="1">
                  <p>加班开始时间：{{ procData.start_time }}</p>
                  <p>申请原因：{{ procData.reason }}</p>
                </el-col>
              </el-row>
              <el-row v-else-if="approvalType === 3">
                <p>离职申请</p>
                <el-col :span="3">
                  <p>申请类型：{{ procData.processName }}</p>
                  <p>离职原因：{{ procData.reason }}</p>
                </el-col>
                <el-col :span="5" :offset="1">
                  <p>期望离职时间：{{ procData.exceptTime }}</p>
                </el-col>
                <el-col />
              </el-row>
            </el-card>
          </el-row>
        </el-col>
        <el-col :span="4" class="stepsContainer">
          <p>审批记录</p>
          <el-steps direction="vertical" :active="approvalSteps.length" finish-status="success" class="steps">
            <el-step
              v-for="(item) in approvalSteps"
              :key="item.taskId"
              status="success"
            >
              <template #title>
                <span class="step-name">{{ item.handleUserName }}</span>
                <span class="step-opinion">{{ item.handleOpinion }}</span>
              </template>
              <template #description>
                {{ item.handleTime }}
              </template>
            </el-step>
          </el-steps>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getApprovalDetails, getApprovalSteps } from '@/api/approval'
export default {
  data() {
    return {
      approvalSteps: [],
      approvalType: 0,
      approvalDetails: {},
      procData: {}
    }
  },
  async created() {
    this.approvalDetails = await getApprovalDetails(this.$route.params.id)
    console.log(this.approvalDetails)
    this.procData = JSON.parse(this.approvalDetails.procData)
    console.log(this.procData)
    this.approvalSteps = await getApprovalSteps(this.$route.params.id)
    this.approvalType = this.approvalDetails.processDefinitionId
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.stepsContainer{
  padding:10px;
  .steps{
    height: 70%;
  }
}
</style>
