<template>
  <div class="container">
    <div class="app-container">
      <el-card class="detail">
        <el-row>
          <el-col :span="2">
            <img :src="securityDetail.user.staffPhoto" class="staff-photo">
          </el-col>
          <el-col :span="8">
            <el-row>
              <h3>{{ securityDetail.user.username }}</h3>
            </el-row>
            <el-row>
              <el-col :span="8">最新工资基数:</el-col>
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
      <el-card>
        <el-form>
          <el-form-item label="参保城市">
            <el-select />
          </el-form-item>
          <el-form-item label="社保类型">
            <el-select />
          </el-form-item>
          <el-form-item label="户籍类型">
            <el-select />
          </el-form-item>
          <el-form-item label="社保基数">
            <el-input />
          </el-form-item>
          <el-form-item label="工伤比例">
            <el-input />
          </el-form-item>
          <el-form-item label="社保缴纳">
            <el-input label="个人" />
            <el-input label="公司" />
            <el-table />
          </el-form-item>
          <el-form-item label="社保备注">
            <el-input type="textarea" />
          </el-form-item>
          <el-form-item label="公积金城市">
            <el-select />
          </el-form-item>
          <el-form-item label="公积金基数">
            <el-input />
          </el-form-item>
          <el-form-item label="企业比例">
            <el-input />
          </el-form-item>
          <el-form-item label="个人比例">
            <el-input />
          </el-form-item>
          <el-form-item label="公积金缴纳">
            <el-input label="个人" />
            <el-input label="公司" />
          </el-form-item>
          <el-form-item label="公积金备注">
            <el-input type="textarea" />
          </el-form-item>
        </el-form>
        <el-button type="primary">确认</el-button>
        <el-button>取消</el-button>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getSocialSecurityDetail } from '@/api/social'
export default {
  data() {
    return {
      securityDetail: {}
    }
  },
  async created() {
    const res = await getSocialSecurityDetail(this.$route.params.id)
    this.securityDetail = res
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.app-container{
  .detail{
    .staff-photo{
      border-radius: 50%;
    }
  }
}
</style>
