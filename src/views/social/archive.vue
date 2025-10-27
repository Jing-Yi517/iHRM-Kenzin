<template>
  <div class="container">
    <div class="app-container">
      <el-card class="main-card">
        <template #header>
          <el-row type="flex" justify="space-between" align="middle">
            <h2>归档社保报表</h2>
            <el-date-picker
              v-model="selectedYear"
              type="year"
              placeholder="选择年"
              @change="handleYearChange"
            />
          </el-row>
        </template>

        <!-- 内部内容 -->
        <el-card>
          <template #header v-if="totalData.length">
            <el-row type="flex" align="middle">
              <el-col :span="3" style="height: 80px;" class="years-month">
                <div>
                  <span class="arrow">→</span>
                  <span>社保报表</span>
                  <span class="text">{{ totalData[0]?.yearsMonth }}</span>
                </div>
              </el-col>
              <el-col :span="3" style="height: 55px;" class="archive-stats">
                <div>
                  <span>企业缴纳</span>
                  {{ totalData[0]?.enterprisePayment }}
                </div>
              </el-col>
              <el-col :span="3" style="height: 55px;" class="archive-stats">
                <div>
                  <span>个人缴纳</span>
                  {{ totalData[0]?.personalPayment }}
                </div>
              </el-col>
              <el-col :span="3" style="height: 55px;" class="archive-stats">
                <div>
                  <span>合计</span>
                  {{ totalData[0]?.total }}
                </div>
              </el-col>
            </el-row>
          </template>

          <!-- 表格或空提示 -->
          <div v-if="tableData.length">
            <ReportTable :data="tableData" />
          </div>
          <div v-else class="no-data">
            <p>该年份暂无数据</p>
          </div>
        </el-card>
      </el-card>
    </div>
  </div>
</template>

<script>
import { archiveSocialSecurityReportHistory, getSocialSecurityReport } from '@/api/social'
import ReportTable from './components/ReportTable.vue';

export default {
  name: 'SocialArchive',
  components:{ReportTable},
  data() {
    return {
      selectedYear: '', // 当前选择的年份
      totalData: [],
      tableData: []  // 新增表格数据
    }
  },
  methods: {
    async handleYearChange(date) {
      const year = date.getFullYear() // 只取年份数字
      try {
        const res = await archiveSocialSecurityReportHistory(year)
        this.totalData = res
        if (this.totalData.length > 0) {
          const tableRes = await getSocialSecurityReport(this.totalData[0].yearsMonth)
          this.tableData = tableRes
        }
      } catch (err) {
        console.error('请求出错:', err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.main-card .el-card__body){
  padding: 0;
}
.main-card{
  .years-month{
    border-right: 2px solid #ccc;
    .text{
      color:#999;
      margin-left: 10px;
    }
    .arrow{
      font-size: 22px;
      line-height: 80px;
      margin-right: 10px;
    }
  }
  .archive-stats{
    font-size: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    span{
      font-size: 14px;
      display: block;
      color:#999;
      margin-bottom: 5px;
    }
    &:nth-child(-n+3){
      border-right: 2px solid #ccc;
    }
  }
}
</style>
