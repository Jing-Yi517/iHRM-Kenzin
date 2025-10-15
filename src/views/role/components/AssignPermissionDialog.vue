<template>
  <el-dialog :visible="isDialogVisible" title="分配权限" @close="handleDialogClose">
    <el-tree
      ref="permTree"
      :data="enabledPermList"
      node-key="id"
      show-checkbox
      check-strictly
      default-expand-all
      highlight-current
      :props="{ label: 'name', children: 'children' }"
      :default-checked-keys="permIds"
    />

    <el-row type="flex" justify="center" style="margin-top: 20px;">
      <el-col :span="6">
        <el-button type="primary" @click="handleAssignPermission">分配</el-button>
        <el-button @click="handleDialogClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getPermissionList, assignPermisson } from '@/api/permission'
import { list2Tree } from '@/utils'

export default {
  props: {
    isDialogVisible: {
      required: true,
      type: Boolean
    },
    currentRow: {
      required: true,
      type: Object
    },
    currentRoleDetails: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      permIds: [], // 当前角色已有权限
      enabledPermList: [] // 树形权限数据
    }
  },
  watch: {
    isDialogVisible(newVal) {
      if (newVal) {
        this.permIds = this.currentRoleDetails.permIds
        // 弹窗打开后更新选中状态
        this.$nextTick(() => {
          this.$refs.permTree.setCheckedKeys(this.permIds)
        })
      }
    }
  },
  async created() {
    const res = await getPermissionList()
    this.enabledPermList = list2Tree(res) // 转换成树结构
  },
  methods: {
    handleDialogClose() {
      this.$emit('update:isDialogVisible', false)
    },
    async handleAssignPermission() {
      try {
        //  获取所有选中节点（包括半选中父节点）
        const checkedKeys = this.$refs.permTree.getCheckedKeys()
        const halfCheckedKeys = this.$refs.permTree.getHalfCheckedKeys()
        const allSelected = [...checkedKeys, ...halfCheckedKeys]

        await assignPermisson(this.currentRow.id, allSelected)
        this.$message({
          type: 'success',
          message: '分配权限成功'
        })
        this.handleDialogClose()
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
