<template>
  <div class="container">
    <div class="app-container">
      <el-card>
        <el-row type="flex">
          <el-button type="danger">设置</el-button>
          <el-button type="primary">{{ companySettings.dataMonth }}报表</el-button>
        </el-row>
      </el-card>
      <el-card>
        <el-form>
          <el-form-item label="聘用形式" label-width="120px">
            <el-checkbox-group v-model="approvalsTypeChecks">
              <el-checkbox :label="1">{{ '正式' }}</el-checkbox>
              <el-checkbox :label="2">{{ '非正式' }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="部门" label-width="120px">
            <el-checkbox-group v-model="departmentChecks">
              <el-checkbox v-for="(item) in departmentList" :key="item.id" :label="item.id">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card>
        <el-table v-loading="isTableLoading" :data="tableData">
          <el-table-column label="序号" prop="id" width="50" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="手机" prop="mobile" />
          <el-table-column label="工号" prop="workNumber" />
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="scope">
              {{ scope.row.formOfEmployment === 1 ? '正式' :'非正式' }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry" />
          <el-table-column label="工资基数" prop="currentBasicSalary" />
          <el-table-column label="津贴方案" prop="subsidyName" />
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button
                v-if="scope.row.currentBasicSalary === null"
                size="mini"
                type="danger"
                @click="handleModifySalary(1, scope)"
              >
                定薪
              </el-button>

              <el-button
                v-else
                size="mini"
                type="primary"
                @click="handleModifySalary(2, scope)"
              >
                调薪
              </el-button>

              <el-button size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center">
          <el-pagination layout="prev,pager,next,total" :total="pagination.total" :page-size="pagination.pageSize" :current-page="pagination.page" @current-change="handlePageChange" />
        </el-row>
      </el-card>
      <SalaryJustifyDialog :is-dialog-visible="isDialogVisible" :is-init-salary="isInitSalary" :user-id="currentUserId" @dialogClose="handleDialogClose" @justifySuccess="getSalaryList()" />
    </div>
  </div>
</template>

<script>
import { getDepartmentInfo } from '@/api/department'
import { getSalaryList, getCompanySettings } from '@/api/salary'
import SalaryJustifyDialog from './components/SalaryJustifyDialog.vue'

export default {
  name: 'Salary',
  components: { SalaryJustifyDialog },
  data() {
    return {
      departmentList: [],
      approvalsTypeChecks: [],
      departmentChecks: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      isTableLoading: false,
      companySettings: {},
      isDialogVisible: false,
      isInitSalary: false,
      currentUserId: 0
    }
  },
  watch: {
    departmentChecks() {
      this.pagination.page = 1
      this.getSalaryList()
    },
    approvalsTypeChecks() {
      this.pagination.page = 1
      this.getSalaryList()
    }
  },
  async created() {
    this.departmentList = await getDepartmentInfo()
    this.companySettings = await getCompanySettings()
    this.getSalaryList()
  },
  methods: {
    async getSalaryList() {
      this.isTableLoading = true
      const res = await getSalaryList({
        approvalsTypeChecks: this.approvalsTypeChecks.join(','),
        departmentChecks: this.departmentChecks.join(','),
        page: this.pagination.page,
        pageSize: this.pagination.pageSize
      })
      this.isTableLoading = false
      this.pagination.total = res.total
      this.tableData = res.rows
    },
    handlePageChange(page) {
      this.pagination.page = page
      this.getSalaryList()
    },
    handleModifySalary(type, scope) {
      this.currentUserId = +scope.row.id
      console.log(this.currentUserId)
      if (type === 1) {
        this.isInitSalary = true
        this.isDialogVisible = true
      } else {
        this.isInitSalary = false
        this.isDialogVisible = true
      }
    },
    handleDialogClose() {
      this.isDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
