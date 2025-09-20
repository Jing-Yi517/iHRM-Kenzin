<template>
  <div class="container">
    <div class="app-container">
      <el-tree :data="dept" :props="treeSettings" :default-expand-all="true">
        <template v-slot="{node, data}">
          <el-row style="width:100%" type="flex" align="middle" justify="space-between">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="dept-manager">{{ data.managerName.startsWith('黑马') ? data.managerName.slice(2) : data.managerName }}</span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>添加子部门</el-dropdown-item>
                  <el-dropdown-item>编辑部门</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { getDepartmentInfo as apiGetDepartmentInfo } from '@/api/department'
export default {
  name: 'Department',
  data() {
    return {
      dept: [],
      treeSettings: {
        label: 'name', // 设置显示的字段属性名
        children: 'children' // 设置子节点的属性名
      }
    }
  },
  async created() {
    await this.getDepartmentInfo()
  },
  methods: {
    async getDepartmentInfo() {
      const res = await apiGetDepartmentInfo()
      this.dept = res
      console.log(this.dept)
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
