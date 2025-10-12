<template>
  <el-dialog :visible="isDialogVisible" title="分配角色" @close="handleDialogClose">
    <!-- 弹层内容 -->
    <!-- checkbox -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox
        v-for="item in enabledRoleList"
        :key="item.id"
        :label="item.id"
      >{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row type="flex" justify="center" style="margin-top: 20px;">
      <el-col :span="6">
        <el-button type="primary" @click="handleAssignRole">分配</el-button>
        <el-button @click="handleDialogClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getEnabledRoleList } from '@/api/role'
import { assignRole } from '@/api/role'
export default {
  props: {
    isDialogVisible: {
      required: true,
      type: Boolean
    },
    currentRoleIds: {
      required: true,
      type: Array
    },
    currentRow: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      enabledRoleList: [],
      roleIds: []
    }
  },
  watch: {
    isDialogVisible: function(newVal, oldVal) {
      if (newVal) { // 如果打开了Dialog，则将传入的currentRoleIds赋值给roleIds
        this.roleIds = this.currentRoleIds
        console.log(this.roleIds)
        console.log(this.currentRow)
      }
    }
  },
  async created() {
    const res = await getEnabledRoleList()
    this.enabledRoleList = res
  },
  methods: {
    handleDialogClose() {
      this.$emit('update:isDialogVisible', false)
    },
    async handleAssignRole() {
      try {
        await assignRole(this.currentRow.id, this.roleIds)
        this.$message({
          type: 'success',
          message: '分配角色成功'
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
