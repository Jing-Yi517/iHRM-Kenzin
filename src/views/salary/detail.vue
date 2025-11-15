<template>
  <div class="container">
    <div class="app-container">
      <el-card>
        <div class="employee-stat">
          <el-avatar v-if="user.staffPhoto" :src="user.staffPhoto" />
          <div v-else class="default-avatar">{{ user.username[0] }}</div>

          <div>
            <el-tag v-if="user.inServiceStatus === 1">在职</el-tag>
            <el-tag v-else type="danger">离职</el-tag>
            <div>
              <div class="stat-container">
                <div>入职时间: {{ user.timeOfEntry || '--' }}</div>
                <div>最新工资: {{ userSalary.currentSalary || '--' }}</div>
              </div>
              <div class="stat-container">
                <div>当月基本工资: {{ userSalary.currentBasicSalary || '--' }}</div>
                <div>当月岗位工资: {{ userSalary.currentPostWage || '--' }}</div>
              </div>
            </div>
          </div>
        </div>

        <el-form label-width="150px">
          <!-- 社保和公积金 -->
          <el-form-item label="社保公积金">
            <div>
              <span>企业：</span>
              {{ userSocialSecurity.enterpriseProvidentFundPayment }}
            </div>
            <div>
              <span>个人：</span> {{ userSocialSecurity.personalProvidentFundPayment }}
            </div>

            <el-table :data="socialSecurityTable" style="margin-top: 10px;">
              <el-table-column prop="item" label="缴费项目" />
              <el-table-column prop="base" label="基数" />
              <el-table-column prop="enterprise" label="企业缴纳" />
              <el-table-column prop="personal" label="个人缴纳" />
            </el-table>
          </el-form-item>

          <el-form-item label="实际出勤天数(正式)">
            <el-input :value="userSocialSecurity.attendanceDays || ''" disabled style="width: 700px;" />
          </el-form-item>
          <el-form-item label="计薪天数(正式)">
            <el-input :value="userSocialSecurity.salaryDays || ''" disabled style="width: 700px;" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeeSalary } from '@/api/salary'
import { getSocialSecurityDetail } from '@/api/social'

export default {
  data() {
    return {
      user: {},
      userSocialSecurity: {},
      userSalary: {},
      socialSecurityTable: []
    }
  },
  async created() {
    const id = this.$route.params.userId
    const res = await getEmployeeSalary(id)
    const ans = await getSocialSecurityDetail(id)
    this.userSalary = res
    this.user = ans.user
    this.userSocialSecurity = ans.userSocialSecurity

    // 生成表格数据
    this.socialSecurityTable = [
      {
        item: '社保',
        base: this.userSocialSecurity.socialSecurityBase,
        enterprise: this.userSocialSecurity.enterprisesPaySocialSecurityThisMonth ? '已缴' : '未缴',
        personal: this.userSocialSecurity.socialSecurityType
      },
      {
        item: '公积金',
        base: this.userSocialSecurity.providentFundBase,
        enterprise: this.userSocialSecurity.enterpriseProvidentFundPayment,
        personal: this.userSocialSecurity.personalProvidentFundPayment
      }
    ]
  }
}
</script>

<style scoped lang="scss">
.el-avatar {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}

::v-deep .el-card__body{
  .employee-stat{
    display: flex;
    margin-bottom: 30px;
  }

  .stat-container{
    display: flex;
    margin-top: 20px;
  }

}

.default-avatar{
  width: 100px;
  height: 100px;
  border-radius: 50%;
  line-height: 100px;
  text-align: center;
  background-color: aqua;
  font-size: 24px;

}
</style>
