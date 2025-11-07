<template>
  <div class="container">
    <div class="app-container">
      <el-card>
        <el-tabs :value="'report'" class="report-tabs">
          <el-tab-pane label="工资报表" name="report">

            <el-row type="flex" justify="end" style="margin-bottom: 10px;">
              <el-button type="primary" size="mini" @click="handleExportReport">导出</el-button>
            </el-row>

            <el-table :data="tableData" border>

              <!-- 序号 -->
              <el-table-column label="序号" type="index" width="60" />

              <el-table-column label="姓名" prop="username" width="180" />
              <el-table-column label="手机号" prop="mobile" width="180" />
              <el-table-column label="工号" prop="workNumber" width="180" />
              <el-table-column label="部门名称" prop="departmentName" width="180" />

              <el-table-column label="在职状态" width="180">
                <template slot-scope="{ row }">
                  {{ row.inServiceStatus === 1 ? '在职' : '离职' }}
                </template>
              </el-table-column>

              <el-table-column label="公积金个人" prop="providentFundIndividual" width="180" />
              <el-table-column label="社保个人" prop="socialSecurityIndividual" width="180" />
              <el-table-column label="社保企业" prop="socialSecurityEnterprise" width="180" />
              <el-table-column label="公积金企业" prop="providentFundEnterprises" width="180" />
              <el-table-column label="公积金社保企业" prop="socialSecurityProvidentFundEnterprises" width="180" />

              <el-table-column label="基本工资" width="180" />
              <el-table-column label="岗位工资" width="180" />
              <el-table-column label="福利津贴" width="180" />
              <el-table-column label="考勤扣款" width="180" />
              <el-table-column label="税前工资合计" width="180" />
              <el-table-column label="应纳税合计" width="180" />
              <el-table-column label="应扣税" width="180" />
              <el-table-column label="实发工资" width="180" />

            </el-table>

            <el-row type="flex" justify="center" align="middle">
              <el-button type="primary" size="mini" @click="handleArchiveReport">归档{{ $route.params.yearMonth.slice(4,6) }}报表</el-button>
              <el-button type="primary" size="mini" @click="handleCreateReport">新建报表</el-button>
              <el-button size="mini" @click="$router.push('/salary')">取消</el-button>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getSalaryReport, exportSalaryReport, archiveSalaryReport, createNewSalaryReport } from '@/api/salary'
import FileSaver from 'file-saver'
export default {
  data() {
    return {
      tableData: [] // 表格数据
    }
  },

  async created() {
    const res = await getSalaryReport(this.$route.params.yearMonth)
    this.tableData = res || []
  },
  methods: {
    async handleExportReport() {
      const loading = this.$loading({
        lock: true,
        text: '正在下载，请耐心等待',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await exportSalaryReport(this.$route.params.yearMonth)
        FileSaver.saveAs(res, '工资报表.xlsx')
        this.$message({ type: 'success', message: '下载成功' })
      } catch (err) {
        this.$message({ type: 'error', message: '导出失败' + err })
      }

      loading.close()
    },
    async handleArchiveReport() {
      this.$confirm(`是否归档 ${this.$route.params.yearMonth} 报表?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await archiveSalaryReport(this.$route.params.yearMonth)
        this.$message({
          type: 'success',
          message: '归档成功'
        })
      }).catch()
    },
    getNextYearMonth() {
      const yearMonth = this.$route.params.yearMonth // 比如 202412
      let year = parseInt(yearMonth.slice(0, 4))
      let month = parseInt(yearMonth.slice(4, 6))

      // 计算下一个月份
      month++
      if (month > 12) {
        month = 1
        year++
      }

      // 补 0 返回 yyyymm 格式
      return `${year}${month.toString().padStart(2, '0')}`
    },
    handleCreateReport() {
      const nextYM = this.getNextYearMonth()
      this.$confirm(`是否创建新报表?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await createNewSalaryReport(nextYM)
        this.$message({
          type: 'success',
          message: '创建成功'
        })
      }).catch()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .report-tabs {
    ::v-deep(.is-active) {
      color: #000;
      font-size: 18px;
      font-weight: 600;
    }
    ::v-deep(.el-tabs__active-bar) {
      background-color: #000;
      width: 72px !important;
    }
  }
}
</style>
