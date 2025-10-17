<template>
  <div class="container">
    <div class="app-container">
      <div class="approval-container">
        <el-card>
          <el-row>
            <el-col :span="2" class="approval-stats">
              <p>当前审批中</p>
              <span>{{ approvalStats.currApproveCount }}</span>
            </el-col>
            <el-col :span="2" class="approval-stats">
              <p>本月审批通过</p>
              <span>{{ approvalStats.approveCount }}</span>
            </el-col>
            <el-col :span="2" class="approval-stats">
              <p>本月审批驳回</p>
              <span>{{ approvalStats.rejectionCount }}</span>
            </el-col>

          </el-row>
        </el-card>
        <el-card style="margin-top: 20px;">
          <el-table v-loading="isTableLoading" :data="tableData">
            <el-table-column label="序号" width="100" prop="processId" />
            <el-table-column label="审批类型" prop="processName" />
            <el-table-column label="申请人" prop="username" />
            <el-table-column label="当前审批人" prop="procCurrNodeUserName" />
            <el-table-column label="审批发起时间" prop="procApplyTime" />
            <el-table-column label="审批状态">
              <template v-slot="scope">
                {{
                  scope.row.processState === 1
                    ? '审批中'
                    : scope.row.processState === 2
                      ? '已通过'
                      : scope.row.processState === 3
                        ? '已拒绝'
                        : '已撤销'
                }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="text" size="small" @click="handleCheckDetail(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-row type="flex" justify="center">
            <el-pagination
              :current-page="pagination.page"
              :page-size="pagination.pageSize"
              layout="prev, pager, next"
              :total="total"
              @current-change="handlePageChange"
            />
          </el-row>

        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getApprovalList } from '@/api/approval'
export default {
  name: 'Approval',
  data() {
    return {
      pagination: {
        page: 1,
        pageSize: 5
      },
      total: 0,
      tableData: [],
      isTableLoading: false,
      approvalStats: {
        approveCount: 0,
        currApproveCount: 0,
        rejectionCount: 0
      }
    }
  },
  async created() {
    await this.getApprovalList()
  },
  methods: {
    async getApprovalList() {
      this.isTableLoading = true
      try {
        const res = await getApprovalList(this.pagination.page, this.pagination.pageSize)
        this.total = res.total
        this.tableData = res.rows
        this.approvalStats.approveCount = res.approveCount
        this.approvalStats.rejectionCount = res.rejectionCount
        this.approvalStats.currApproveCount = res.currApproveCount
      } finally {
        this.isTableLoading = false
      }
    },
    async handlePageChange(currPage) {
      this.pagination.page = currPage
      await this.getApprovalList()
    },
    handleCheckDetail(row) {
      this.$router.push(`/approval/detail/${row.processId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.approval-container{
  .approval-stats{
    text-align: center;
    p{
      font-size: 20px;
    }
    span{
      font-size: 18px;
    }
  }
}
</style>
