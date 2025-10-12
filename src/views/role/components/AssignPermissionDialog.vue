<template>
  <el-dialog :visible="isDialogVisible" title="分配权限" @close="handleDialogClose">
    <!-- 弹层内容 -->
    <!-- checkbox -->
    <el-checkbox-group v-model="permIds">
      <el-checkbox
        v-for="item in enabledPermList"
        :key="item.id"
        :label="item.id"
      >{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row type="flex" justify="center" style="margin-top: 20px;">
      <el-col :span="6">
        <el-button type="primary" @click="handleAssignPermission">分配</el-button>
        <el-button @click="handleDialogClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { assignPermisson } from '@/api/permission'
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
      permIds: [],
      enabledPermList: []
    }
  },
  watch: {
    isDialogVisible: function(newVal, oldVal) {
      if (newVal) {
        this.permIds = this.currentRoleDetails.permIds
      }
    }
  },
  async created() {
    const res = await getPermissionList()
    this.enabledPermList = res
  },
  methods: {
    handleDialogClose() {
      this.$emit('update:isDialogVisible', false)
    },
    async handleAssignPermission() {
      try {
        await assignPermisson(this.currentRow.id, this.permIds)
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

<style></style>
