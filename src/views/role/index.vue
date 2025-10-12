<template>
  <div class="container">
    <div class="app-container">
      <el-button type="primary" class="add-role-btn" @click="isDialogVisible = true">添加角色</el-button>
      <el-table
        v-loading="isTableLoading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="name" label="角色" width="200" align="center">
          <template v-slot="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.editData.name" size="mini" />
            <span v-else> {{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="启用" width="200" align="center">
          <template v-slot="scope">
            <el-switch v-if="scope.row.isEdit" v-model="scope.row.editData.state" size="mini" :active-value="1" :inactive-value="0" />
            <span v-else> {{ scope.row.state === 1 ? '已启用' : '未启用' }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" align="center">
          <template v-slot="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.editData.description" type="textarea" :row="2" resize="none" />
            <span v-else> {{ scope.row.description }} </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <template v-if="scope.row.isEdit">
              <el-button type="primary" size="small" @click="handleSubmitEdit(scope.row)">确认</el-button>
              <el-button size="small" @click="handleCancelEdit(scope.row)">取消</el-button>
            </template>
            <template v-else>
              <el-button type="text" size="small" @click="handleAssignPermission(scope.row)">分配权限</el-button>
              <el-button type="text" size="small" @click="scope.row.isEdit = true">编辑</el-button>
              <el-button type="text" size="small" @click="handleDeleteRole(scope.row)">删除</el-button>
            </template>
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
          <el-form-item label="启用" prop="state">
            <el-switch
              v-model="formData.state"
              :active-value="1"
              :inactive-value="0"
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
      <AssignPermissionDialog :is-dialog-visible.sync="isAssignDialogVisible" :current-row="currentRow" :current-role-details="currentRoleDetails" />
    </div>
  </div>
</template>

<script>
import { addRole, getRoleList, updateRole, deleteRole, getRoleDetails } from '@/api/role'
import AssignPermissionDialog from '@/views/role/components/AssignPermissionDialog.vue'
export default {
  name: 'Role',
  components: { AssignPermissionDialog },
  data() {
    return {
      pagination: {
        page: 1,
        pagesize: 5,
        total: 0
      },
      tableData: [],
      isTableLoading: false,
      isDialogVisible: false, // 角色编辑dialog
      isAssignDialogVisible: false,
      currentRow: {},
      currentRoleDetails: {},
      formData: {
        name: '',
        state: 0,
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
        state: [],
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
     * ? 分页数据获取逻辑
     * @param params 分页数据对象
     * ! 如果没传入对象 则默认传入空对象
     * * 如果传入了对象，则为其进行结构， 如果没传相关的属性，则用默认值
     */
    async getRoleList({ page = this.pagination.page, pagesize = this.pagination.pagesize } = {}) {
      this.isTableLoading = true

      const res = await getRoleList({ page, pagesize })
      res.rows.forEach((item) => { // 为其添加响应式数据，为了能侦测属性的变化后页面重新渲染
        this.$set(item, 'editData', {
          name: item.name,
          state: item.state,
          description: item.description
        }) // 先拷贝，防止拷贝上isEdit字段
        this.$set(item, 'isEdit', false)
      })

      this.pagination.total = res.total
      this.tableData = res.rows

      this.isTableLoading = false
    },
    /**
     * ? 页码改变后处理逻辑
     * @param page 当前页码
     * * 将变化后的页码传入 getRoleList 函数，获取最新的数据
     */
    async handlePageChange(page) {
      this.pagination.page = page
      await this.getRoleList({ page })
    },

    /**
     * ? 关闭新增角色对话框逻辑
     */
    handleCloseDialog() {
      this.$refs.form.resetFields()
      this.isDialogVisible = false
    },

    /**
     * ? 新增提交角色逻辑
     * * 调用新增接口，并获取最新数据
     */
    async handleSubmitDialog() {
      try {
        await this.$refs.form.validate()
        await addRole(this.formData)
        this.$message({ type: 'success', message: '添加角色成功' })
        await this.getRoleList()
        this.handleCloseDialog()
      } catch (err) {
        console.warn('添加新角色错误' + err)
      }
    },

    /**
     * ? 退出编辑模式逻辑
     * @param row 当前行数据
     * * 从row里面获取相应的数据，赋值给editData内，取消编辑的操作
     * * 退出Edit模式
     */
    handleCancelEdit(row) {
      const { name, state, description } = row
      row.editData = { name, state, description }
      row.isEdit = false
    },

    /**
     * ? 提交编辑逻辑
     * @param row 当前行数据
     * * 检验表单项是否填入，否则抛出错误
     * * 将 editData 里面的相应数据赋值给 row
     * ! 错误处理： 如果为空 / 其他错误 给出提示
     */
    async handleSubmitEdit(row) {
      try {
        if (row.editData.name && row.editData.description) {
          await updateRole({ ...row.editData, id: row.id })
          this.$message({ type: 'success', message: '修改角色成功' })
          const { name, description, state } = row.editData
          /* eslint-disable require-atomic-updates */
          row.name = name
          row.description = description
          row.state = state
          row.isEdit = false
          /* eslint-disable require-atomic-updates */
        } else throw new Error('Empty Form')
      } catch (err) {
        if (err.message === 'Empty Form') {
          this.$message.error('角色名称和描述为必填项')
        } else {
          this.$message.error(err.message || '修改角色失败')
        }
      }
    },
    /**
     * ? 删除角色逻辑
     * @param row 当前行数据
     * * 调用接口删除角色数据
     * * 判断当前分页的数据是否只有一条，且是不是位于第一页。 如果只有一条且不位于第一页，当前页码减一
     */
    handleDeleteRole(row) {
      this.$confirm(`此操作将永久删除 ${row.name} 角色, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await deleteRole({ id: row.id })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (this.tableData.length === 1 && this.pagination.page > 1) this.pagination.page--
          await this.getRoleList()
        } catch (error) {
          this.$message({ type: 'error', message: error.message })
        }
      }).catch(() => {})
    },

    async handleAssignPermission(row) {
      const res = await getRoleDetails(row.id)

      this.currentRoleDetails = res
      this.currentRow = row

      this.isAssignDialogVisible = true
    }

  }
}
</script>

<style lang="scss" scoped>
.add-role-btn {
  margin-bottom: 10px;
}
</style>
