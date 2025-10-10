<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="large" type="primary" @click="handleAddNode(null,1)">添加权限</el-button>
      <el-table v-loading="istableLoading" :data="tableList" default-expand-all row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column v-slot="scope" label="操作">
          <el-button v-if="scope.row.type === 1" size="mini" type="text" @click="handleAddNode(scope.row,2)">添加</el-button>
          <el-button size="mini" type="text" @click="handleEditPermission(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click="handleDeletePermission(scope.row)">删除</el-button>
        </el-table-column>
      </el-table>
    </div>
    <PermissionEditDialog :id="id" :is-dialog-visible="isDialogVisible" :type="type" :is-edit="isEdit" @closeDialog="handleCloseDialog" @editSuccess="getPermissionList" />
  </div>
</template>
<script>
import { getPermissionList as apiGetPermissionList, deletePermissionNode } from '@/api/permission'
import { list2Tree } from '@/utils'

import PermissionEditDialog from '@/views/permission/components/PermissionEditDialog.vue'

export default {
  name: 'Permission',
  components: { PermissionEditDialog },
  data() {
    return {
      tableList: [], // 表格数据
      isDialogVisible: false, // 是否打开编辑框
      istableLoading: false, // 是否正在加载表格
      type: 1, // 添加模式： 1： 根添加  2：节点添加  3：编辑模式
      id: 0, // 当前行id数据
      isEdit: false // 是否为编辑模式
    }
  },
  async created() {
    await this.getPermissionList()
  },
  methods: {
    /**
     * ? 获取权限点List数据，转化为tree结构
     */
    async getPermissionList() {
      this.istableLoading = true
      const res = await apiGetPermissionList()
      const list = list2Tree(res, 0)
      this.tableList = list
      this.istableLoading = false
    },

    /**
     * ? 添加权限点逻辑
     * @param row 行数据
     * @param type 添加类型
     */
    handleAddNode(row, type) {
      if (type === 1) {
        this.type = 1
        this.id = 0
      }
      if (type === 2) {
        this.type = 2
        this.id = row.id
      }
      this.isEdit = false
      this.isDialogVisible = true
    },
    /**
     * ? 关闭Dialog逻辑
     */
    handleCloseDialog() {
      this.isDialogVisible = false
    },
    /**
     * ? 删除特定权限点数据
     * @param row 行数据
     */
    handleDeletePermission(row) {
      this.$confirm(`此操作将永久删除 ${row.name} 权限点, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deletePermissionNode(row.id)
        await this.getPermissionList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {})
    },
    /**
     * ? 编辑权限点逻辑
     * @param row 行数据
     */
    handleEditPermission(row) {
      this.isEdit = true
      this.type = 3 // type === 3 编辑模式
      this.id = row.id
      this.isDialogVisible = true
    }
  }
}
</script>
<style>
.btn-add {
  margin: 10px;
}
</style>
