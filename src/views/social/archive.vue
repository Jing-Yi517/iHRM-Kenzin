<template>
  <div class="container">
    <div class="app-container">
      <el-card class="main-card">
        <!-- 年份选择 -->
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

        <!-- 循环渲染每个月报表 -->
        <el-card
          v-for="(item, index) in totalData"
          :key="item.yearsMonth"
          class="month-card"
          style="margin-bottom: 10px;"
        >
          <template #header>
            <el-row type="flex" align="middle" @click.native="toggleExtend(index)" class="clickable-row">
              <el-col :span="3" class="years-month">
                <div>
                  <span class="arrow">→</span>
                  <span>社保报表</span>
                  <span class="text">{{ item.yearsMonth }}</span>
                </div>
              </el-col>
              <el-col :span="3" class="archive-stats">
                <div>
                  <span>企业缴纳</span>
                  {{ item.enterprisePayment }}
                </div>
              </el-col>
              <el-col :span="3" class="archive-stats">
                <div>
                  <span>个人缴纳</span>
                  {{ item.personalPayment }}
                </div>
              </el-col>
              <el-col :span="3" class="archive-stats">
                <div>
                  <span>合计</span>
                  {{ item.total }}
                </div>
              </el-col>
            </el-row>
          </template>

          <!-- 表格内容 -->
          <div v-if="isExtended[index]">
            <ReportTable :data="tableData[index]" :height="300"/>
          </div>
        </el-card>
      </el-card>
    </div>
  </div>
</template>

<script>
import { archiveSocialSecurityReportHistory, getSocialSecurityReport } from '@/api/social'
import ReportTable from './components/ReportTable.vue'

export default {
  name: 'SocialArchive',
  components: { ReportTable },
  data() {
    return {
      selectedYear: '',          // 当前选择的年份
      totalData: [],             // 月份总数据
      tableData: [],             // 每个月的表格数据，数组
      isExtended: []             // 每个月展开状态，布尔数组
    }
  },
  methods: {
    // 年份选择变化
    async handleYearChange(date) {
      if (!date) return // 处理清空日期的情况
      
      const year = date.getFullYear()
      try {
        const res = await archiveSocialSecurityReportHistory(year)
        this.totalData = res
        // 创建新数组而不是填充现有数组
        this.isExtended = res.map(() => false)
        this.tableData = res.map(() => [])

        // 可选：提前加载第一个月表格
        if (res.length > 0) {
          this.fetchTableData(0)
        }
      } catch (err) {
        console.error('请求出错:', err)
        this.$message.error('获取社保报表历史数据失败')
      }
    },

    // 点击展开/收起
    toggleExtend(index) {
      // 使用Vue.set更新数组元素以确保响应性
      this.$set(this.isExtended, index, !this.isExtended[index])

      // 第一次展开时请求表格数据
      if (this.isExtended[index] && (!this.tableData[index] || this.tableData[index].length === 0)) {
        this.fetchTableData(index)
      }
    },
    
    // 获取表格数据
    async fetchTableData(index) {
      if (index < 0 || index >= this.totalData.length) return
      
      try {
        const month = this.totalData[index].yearsMonth
        const res = await getSocialSecurityReport(month)
        // 使用Vue.set更新表格数据以确保响应性
        this.$set(this.tableData, index, res)
      } catch (err) {
        console.error('请求表格数据出错:', err)
        this.$message.error('获取社保报表详情失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.main-card .el-card__body) {
  padding: 0;
}

.main-card {
  .years-month {
    border-right: 2px solid #ccc;
    .text {
      color: #999;
      margin-left: 10px;
    }
    .arrow {
      font-size: 22px;
      line-height: 80px;
      margin-right: 10px;
    }
  }

  .archive-stats {
    font-size: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-size: 14px;
      display: block;
      color: #999;
      margin-bottom: 5px;
    }
    &:nth-child(-n + 3) {
      border-right: 2px solid #ccc;
    }
  }

  .clickable-row {
    cursor: pointer;
  }
}
</style>