<template>
  <div class="container">
    <div class="app-container">
      <el-card class="social-card">
        <el-button type="danger" @click="$router.push('/social/archive')">历史归档</el-button>
        <el-button type="primary" @click="jumpToReport">{{ socialSecuritySettings.dataMonth }}报表</el-button>
      </el-card>
      <el-card class="social-card">
        <el-form label-position="right" label-width="100px">
          <el-form-item label="部门">
            <el-checkbox-group v-model="selectedDepartment">
              <el-checkbox v-for="(item) in departmentList" :key="item.id" :label="item.id">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="社保城市">
            <el-checkbox-group v-model="selectedSocialCity">
              <el-checkbox v-for="item in cityList" :key="item.id" :label="item.id">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="公积金城市">
            <el-checkbox-group v-model="selectedHousingCity">
              <el-checkbox v-for="item in cityList" :key="item.id" :label="item.id">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="social-card">
        <el-table v-loading="isTableLoading" :data="tableData" @row-click="handleTableRowClick">
          <el-table-column prop="id" label="序号" width="70" />
          <el-table-column prop="username" label="姓名" sortable />
          <el-table-column prop="mobile" label="手机" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="departmentName" label="部门" sortable />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column prop="leaveTime" label="离职时间" sortable>
            <template v-slot="scope">
              {{ scope.row.leaveTime ? scope.row.leaveTime : '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="participatingInTheCity" label="社保城市" />
          <el-table-column prop="providentFundCity" label="公积金城市" />
          <el-table-column prop="socialSecurityBase" label="社保基数" />
          <el-table-column prop="providentFundBase" label="公积金基数" />
        </el-table>
        <el-row type="flex" justify="center" class="pagination-container">
          <el-pagination :page-size="pagination.pageSize" :current-page="pagination.page" :total="pagination.total" layout="prev, pager, next, total" @current-change="handlePageChange" />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getCityList, getSocialSecurityList, getSocialSecuritySettings } from '@/api/social'
import { getDepartmentInfo } from '@/api/department'
export default {
  name: 'Social',
  data() {
    return {
      cityList: [], // 城市列表
      departmentList: [], // 部门列表
      selectedSocialCity: [], // 当前选中的社保城市
      selectedHousingCity: [], // 当前选择的公积金城市
      selectedDepartment: [], // 当前选择的部门
      tableData: [], // 员工社保表格
      isTableLoading: false, // 是否正在加载table
      socialSecuritySettings: {}, // 获取社保设置（当前归档情况等）
      pagination: { // 分页设置
        page: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  watch: {
  // 监听部门选择变化
    selectedDepartment() {
      this.pagination.page = 1 // 每次筛选重置页码
      this.getSocialList()
    },
    // 监听社保城市选择变化
    selectedSocialCity() {
      this.pagination.page = 1
      this.getSocialList()
    },
    // 监听公积金城市选择变化
    selectedHousingCity() {
      this.pagination.page = 1
      this.getSocialList()
    }
  },
  async created() {
    this.cityList = await getCityList()
    this.departmentList = await getDepartmentInfo()
    this.socialSecuritySettings = await getSocialSecuritySettings()
    await this.getSocialList()
  },
  methods: {
    /**
     * ? 获取员工社保表格数据
     * * 根据是否选中了公积金/社保城市，部门，进行一个精确查找
     */
    async getSocialList() {
      const data = {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        departmentChecks: this.selectedDepartment,
        providentFundChecks: this.selectedHousingCity,
        socialSecurityChecks: this.selectedSocialCity
      }
      this.isTableLoading = true
      const res = await getSocialSecurityList(data)
      this.tableData = res.rows
      this.pagination.total = res.total
      this.isTableLoading = false
    },

    /**
     * ? 监听页码变化，发送新请求
     * @param page 分页数据
     */
    async handlePageChange(page) {
      this.pagination.page = page
      await this.getSocialList()
    },

    /**
     * ? 点击表格行跳转员工社保详情逻辑
     * @param row 表格行数据
     */
    handleTableRowClick(row) {
      this.$router.push(`/social/detail/${row.id}`)
    },

    /**
     *  ? 跳转社保报表页面逻辑
     */
    jumpToReport() {
      this.$router.push({
        path: '/social/report',
        query: { yearMonth: this.socialSecuritySettings.dataMonth }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  .social-card{
    margin-bottom: 10px;
  }
  .pagination-container{
    margin-top: 20px;
  }
}
</style>
