<template>
  <div class="container">
    <div class="app-container">
      <!-- 默认展开全部节点 + 只有点击箭头的时候才收缩/打开 -->
      <el-tree :data="dept" :props="treeSettings" :default-expand-all="true" :expand-on-click-node="false">
        <template v-slot="{node, data}">
          <el-row style="width:100%" type="flex" align="middle" justify="space-between">
            <el-col>{{ data.name === '传智教育' ? 'xx公司':data.name }}</el-col>
            <el-col :span="4">
              <span class="dept-manager">{{ data.managerName.startsWith('黑马') ? data.managerName.slice(2) : data.managerName }}</span>
              <el-dropdown @command="handleDropdownCommand($event, data.id)">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="addDepartment">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="editDepartment">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="deleteDepartment">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <TreeEditorDialog ref="editDialog" :dialog-form-visible.sync="isDialogVisible" :current-node-id="currentNodeId" @closeDialog="handleCloseDialog" @updateDepartment="getDepartmentInfo" />
  </div>
</template>

<script>
import { getDepartmentInfo as apiGetDepartmentInfo } from '@/api/department'
import { list2Tree } from '@/utils'
import TreeEditorDialog from '@/views/department/components/TreeEditorDialog.vue'
export default {
  name: 'Department',
  components: {
    TreeEditorDialog
  },
  data() {
    return {
      dept: [],
      treeSettings: {
        label: 'name', // 设置显示的字段属性名
        children: 'children' // 设置子节点的属性名
      },
      currentNodeId: null,
      isDialogVisible: false,
      isEditDialog: false
    }
  },
  async created() {
    await this.getDepartmentInfo()
  },
  methods: {
    async getDepartmentInfo() {
      const res = await apiGetDepartmentInfo()
      const tree = list2Tree(res, 0)
      this.dept = tree
    },
    handleDropdownCommand(command, id) {
      if (command === 'addDepartment') {
        this.isDialogVisible = true
        this.currentNodeId = id
      }
      if (command === 'editDepartment') {
        this.isDialogVisible = true
        this.currentNodeId = id
        this.$refs.editDialog.getDepartmentDetail(id)
      }
    },
    handleCloseDialog() {
      this.isDialogVisible = false
    }

  }
}
</script>

<style lang="scss" scoped>
.app-container{
  padding:30px 140px;
  font-size: 14px;
}

.dept-manager{
  margin-right: 10px;

}
</style>
