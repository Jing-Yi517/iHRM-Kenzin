<template>
  <div class="container">
    <div class="app-container">
      <!-- 员工信息 -->
      <el-card class="detail">
        <el-row>
          <el-col :span="2">
            <img :src="securityDetail.user.staffPhoto" class="staff-photo">
          </el-col>
          <el-col :span="8">
            <el-row>
              <h3>{{ securityDetail.user.username }}</h3>
            </el-row>
            <el-row class="info-row">
              <el-col :span="8">最新工资基数：</el-col>
              <el-col :span="8">入职时间：{{ securityDetail.user.timeOfEntry }}</el-col>
              <el-col :span="8">联系电话：{{ securityDetail.user.mobile }}</el-col>
            </el-row>
            <el-row>
              <el-form inline>
                <el-form-item>
                  <el-switch
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    inactive-text="本月不缴纳社保"
                  />
                </el-form-item>
                <el-form-item>
                  <el-switch
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    inactive-text="本月不缴纳公积金"
                  />
                </el-form-item>
              </el-form>
            </el-row>
          </el-col>
        </el-row>
      </el-card>

      <!-- 表单区域 -->
      <el-card class="form-container">
        <el-form label-width="120px" label-position="right" class="main-form">
          <!-- 社保信息 -->
          <el-form-item label="参保城市">
            <el-select size="mini" placeholder="请选择参保城市" />
          </el-form-item>

          <el-form-item label="社保类型">
            <el-select size="mini" placeholder="请选择社保类型" />
          </el-form-item>

          <el-form-item label="户籍类型">
            <el-select size="mini" placeholder="请选择户籍类型" />
          </el-form-item>

          <el-form-item label="社保基数">
            <el-input size="mini" placeholder="请输入社保基数" />
          </el-form-item>

          <el-form-item label="工伤比例">
            <el-input size="mini" placeholder="请输入工伤比例" />
          </el-form-item>

          <el-form-item label="社保缴纳">
            <el-row>
              <el-col :span="6">
                <el-form-item label="个人" label-width="50px">
                  <el-input size="mini" placeholder="个人缴纳" class="short-input" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公司" label-width="50px">
                  <el-input size="mini" placeholder="公司缴纳" class="short-input" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-table
              :data="insuranceTable"
              border
              size="small"
              class="insurance-table"
              style="margin-top: 10px; width: 80%;"
            >
              <el-table-column prop="type" label="险种" width="150" />
              <el-table-column prop="personalRate" label="个人比例 (%)" width="150" />
              <el-table-column prop="companyRate" label="公司比例 (%)" width="150" />
              <el-table-column prop="personalPay" label="个人缴纳 (元)" width="150" />
              <el-table-column prop="companyPay" label="公司缴纳 (元)" width="150" />
            </el-table>
          </el-form-item>

          <el-form-item label="社保备注">
            <el-input type="textarea" placeholder="请输入备注" />
          </el-form-item>

          <el-divider />

          <!-- 公积金部分 -->
          <el-form-item label="公积金城市">
            <el-select size="mini" placeholder="请选择城市" />
          </el-form-item>

          <el-form-item label="公积金基数">
            <el-input size="mini" placeholder="请输入基数" />
          </el-form-item>

          <el-form-item label="企业比例">
            <el-input size="mini" placeholder="请输入企业比例" />
          </el-form-item>

          <el-form-item label="个人比例">
            <el-input size="mini" placeholder="请输入个人比例" />
          </el-form-item>

          <el-form-item label="公积金缴纳">
            <el-row>
              <el-col :span="6">
                <el-form-item label="个人" label-width="50px">
                  <el-input size="mini" placeholder="个人缴纳" class="short-input" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公司" label-width="50px">
                  <el-input size="mini" placeholder="公司缴纳" class="short-input" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="公积金备注">
            <el-input type="textarea" placeholder="请输入备注" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary">确认</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getSocialSecurityDetail } from '@/api/social'
export default {
  data() {
    return {
      securityDetail: {
        user: {}
      },
      insuranceTable: [
        { type: '养老保险', personalRate: 8, companyRate: 16, personalPay: 400, companyPay: 800 },
        { type: '医疗保险', personalRate: 2, companyRate: 10, personalPay: 100, companyPay: 500 },
        { type: '失业保险', personalRate: 0.5, companyRate: 1, personalPay: 25, companyPay: 50 }
      ]
    }
  },
  async created() {
    const res = await getSocialSecurityDetail(this.$route.params.id)
    this.securityDetail = res
  }
}
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;

  .detail {
    margin-bottom: 20px;
    .staff-photo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }
    .info-row {
      font-size: 17px;
      color: #666;
      margin-top: 5px;
    }
  }

  .form-container {
    padding: 20px;

    .main-form {
      .el-form-item {
        margin-bottom: 16px;
      }

      .el-input:not(.short-input) {
        width: 300px;
      }

      .el-select {
        width: 200px;
      }

      .el-textarea {
        width: 500px;
      }

      .short-input {
        width: 200px !important;
      }

      .el-row {
        align-items: center;
      }
    }

    .insurance-table {
      margin-top: 8px;
      border-radius: 6px;
    }
  }
}
</style>
