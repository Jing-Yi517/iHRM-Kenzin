<template>
  <div class="container">
    <div class="app-container">
      <el-card class="box-card">
        <div slot="header">
          <span class="title">社保报表</span>
          <el-row type="flex" justify="end">
            <el-button type="primary" size="mini" @click="handleExportExcel">导出</el-button>
          </el-row>
        </div>

        <ReportTable :data="tableData" />
        <el-row type="flex" justify="center">
          <el-button type="danger" @click="handleArchiveReport">归档</el-button>
          <el-button type="primary" @click="handleCreateReport">新建报表</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getSocialSecurityReport, exportSocialSecurityReportExcel, archiveSocialSecurityReport, createSocialSecurityReport } from '@/api/social'
import ReportTable from './components/ReportTable.vue'
import FileSaver from 'file-saver'
export default {
  name: 'SocialReport',
  components: { ReportTable },
  data() {
    return {
      tableData: []
    }
  },
  async created() {
    const res = await getSocialSecurityReport(this.$route.query.yearMonth)
    this.tableData = res
    console.log(res)
  },
  methods: {
    /**
     * ? 导出当前社保报表数据
     */
    async handleExportExcel() {
      const loading = this.$loading({
        lock: true,
        text: '正在下载，请耐心等待',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await exportSocialSecurityReportExcel(this.$route.query.yearMonth)
        FileSaver.saveAs(res, `${this.$route.query.yearMonth}社保报表.xlsx`)
        this.$message({ type: 'success', message: '下载成功' })
      } catch (err) {
        this.$message({ type: 'error', message: '导出失败' + err })
      }
      loading.close()
    },

    /**
     * ? 归档当前社保数据
     */
    async handleArchiveReport() {
      this.$confirm(`是否确定归档 ${this.$route.query.yearMonth} 报表？ 该操作会覆盖上一次的归档记录`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await archiveSocialSecurityReport(this.$route.query.yearMonth)
        this.$message({ type: 'success', message: '成功归档!' })
      }).catch(() => {})
    },

    /**
     * ? 新建社保报表数据
     */
    handleCreateReport() {
      // 原始年月
      const year = Number(this.$route.query.yearMonth.slice(0, 4))
      const month = Number(this.$route.query.yearMonth.slice(4, 6))

      // 下个月
      let nextYear = year
      let nextMonth = month + 1

      if (nextMonth > 12) {
        nextMonth = 1
        nextYear++
      }

      // 格式补零 '01' '02'
      const paddedMonth = nextMonth.toString().padStart(2, '0')

      const nextYearMonth = `${nextYear}${paddedMonth}`

      this.$confirm(`您即将新建《${nextYearMonth}》报表`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await createSocialSecurityReport(nextYearMonth)
          this.$message({ type: 'success', message: '新建成功' })
          this.$router.push(`/social/report?yearMonth=${nextYearMonth}`)
        } catch (err) {
          // 获取状态码
          const status = err?.response?.status
          if (status === 400) {
            this.$message({ type: 'warning', message: '上个月的数据还未归档，请先进行归档操作' })
          } else {
            this.$message({ type: 'error', message: '创建失败，请稍后重试' })
          }
        }
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  .title{
    font-size: 20px;
  }
}
</style>
