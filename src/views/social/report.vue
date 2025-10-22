<template>
  <div class="container">
    <div class="app-container">
      <el-card class="box-card">
        <div slot="header">
          <span class="title">社保报表</span>
        </div>
        <el-table>
          <el-table-column label="序号" />
          <el-table-column label="姓名" />
          <el-table-column label="入职时间" />
          <el-table-column label="手机号" />
          <el-table-column label="身份证号码" />
          <el-table-column label="学历" />
          <el-table-column label="开户行" />
          <el-table-column label="一级部门" />
          <el-table-column label="二级部门" />
          <el-table-column label="工作城市" />
          <el-table-column label="社保电脑号" />
          <el-table-column label="公积金账号" />
          <el-table-column label="离职时间" />
          <el-table-column label="户籍类型" />
          <el-table-column label="参保城市" />
          <el-table-column label="社保月份" />
          <el-table-column label="社保基数" />
          <el-table-column label="社保合计" />
          <el-table-column label="社保企业" />
          <el-table-column label="社保个人" />
          <el-table-column label="公积金城市" />
          <el-table-column label="公积金月份" />
          <el-table-column label="公积金基数" />
          <el-table-column label="公积金企业基数" />
          <el-table-column label="公积金企业比例" />
          <el-table-column label="公积金个人基数" />
          <el-table-column label="公积金个人比例" />
          <el-table-column label="公积金合计" />
          <el-table-column label="公积金企业" />
          <el-table-column label="公积金个人" />
          <el-table-column label="养老企业基数" />
          <el-table-column label="养老企业比例" />
          <el-table-column label="养老企业" />
          <el-table-column label="养老个人基数" />
          <el-table-column label="养老个人比例" />
          <el-table-column label="养老个人" />
          <el-table-column label="失业企业基数" />
          <el-table-column label="失业企业比例" />
          <el-table-column label="失业企业" />
          <el-table-column label="失业个人基数" />
          <el-table-column label="失业个人比例" />
          <el-table-column label="失业个人" />
          <el-table-column label="医疗企业基数" />
          <el-table-column label="医疗企业比例" />
          <el-table-column label="医疗企业" />
          <el-table-column label="医疗个人基数" />
          <el-table-column label="医疗个人比例" />
          <el-table-column label="医疗个人" />
          <el-table-column label="工伤企业基数" />
          <el-table-column label="工伤企业比例" />
          <el-table-column label="工伤企业" />
          <el-table-column label="生育企业基数" />
          <el-table-column label="生育企业比例" />
          <el-table-column label="生育企业" />
          <el-table-column label="大病企业基数" />
          <el-table-column label="大病企业比例" />
          <el-table-column label="大病企业" />
          <el-table-column label="大病个人基数" />
          <el-table-column label="大病个人比例" />
          <el-table-column label="大病个人" />
          <el-table-column label="公积金备注" />
          <el-table-column label="社保备注" />

        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getSocialSecurityReport } from '@/api/social'
export default {
  name: 'SocialReport',
  data() {
    return {
      tableData: []
    }
  },
  async created() {
    const res = await getSocialSecurityReport(this.$route.query.yearMonth)
    this.tableData = res
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
