<template>
  <div class="container">
    <div class="app-container">
      <el-button type="primary" class="add-role-btn" @click="isDialogVisible = true">添加角色</el-button>
      <el-table
        v-loading="isTableLoading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="角色"
          width="200"
          align="center"
        />
        <el-table-column prop="state" label="启用" width="200" align="center">
          <template v-slot="scope">
            <span> {{ scope.row.state === 1 ? '已启用' : '未启用' }} </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          align="center"
        />
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button type="text" size="small">分配权限</el-button>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 放置分页组件 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <!-- 放置分页组件 -->
        <el-pagination
          layout="prev, pager, next"
          background
          :total="pagination.total"
          :page-size="pagination.pagesize"
          :current-page="pagination.page"
          @current-change="handlePageChange"
        />
      </el-row>

      <el-dialog title="新增角色" :visible.sync="isDialogVisible" width="500px" @close="handleCloseDialog">
        <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
          <el-form-item prop="name" label="角色名称">
            <el-input v-model="formData.name" style="width: 300px" size="mini" />
          </el-form-item>
          <el-form-item label="启用">
            <el-switch
              v-model="formData.state"
            />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="formData.description" style="width: 300px" size="mini" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center">
              <el-col :span="12">
                <el-button size="mini" type="primary" @click="handleSubmitDialog">确定</el-button>
                <el-button size="mini" @click="handleCloseDialog">取消</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addRole, getRoleList } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      pagination: {
        page: 1,
        pagesize: 5,
        total: 0
      },
      tableData: [],
      isTableLoading: false,
      isDialogVisible: false,
      formData: {
        name: '',
        state: false,
        description: ''
      },
      rules: {
        name:
        [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('请输入角色名称'))
              callback()
            }
          }
        ],
        description:
        [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('请输入角色描述'))
              callback()
            }
          }
        ]
      }
    }
  },
  async created() {
    await this.getRoleList({ page: 1, pagesize: 5 })
  },
  methods: {
    /**
     *
     * @param params 分页数据对象
     * ! 如果没传入对象 则默认传入空对象
     * * 如果传入了对象，则为其进行结构， 如果没传相关的属性，则用默认值
     */
    async getRoleList({ page = this.pagination.page, pagesize = this.pagination.pagesize } = {}) {
      this.isTableLoading = true
      const res = await getRoleList({ page, pagesize })
      this.pagination.total = res.total
      this.tableData = res.rows
      this.isTableLoading = false
    },
    async handlePageChange(page) {
      this.pagination.page = page
      await this.getRoleList({ page })
    },
    handleCloseDialog() {
      this.$refs.form.resetFields()
      this.isDialogVisible = false
    },
    async handleSubmitDialog() {
      try {
        await this.$refs.form.validate()
        await addRole(this.formData)
        this.$message({ type: 'success', message: '添加角色成功' })
        this.getRoleList()
        this.handleCloseDialog()
      } catch (err) {
        console.warn('添加新角色错误' + err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add-role-btn {
  margin-bottom: 10px;
}
</style>
