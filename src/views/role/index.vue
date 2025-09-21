<template>
  <div class="container">
    <div class="app-container">
      <el-button type="primary" class="add-role-btn">添加角色</el-button>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          prop="role"
          label="角色"
          width="200"
          align="center"
        />
        <el-table-column
          prop="state"
          label="启用"
          width="200"
          align="center"
        />
        <el-table-column
          prop="description"
          label="描述"
          align="center"
        />
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 放置分页组件 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <!-- 放置分页组件 -->
        <el-pagination layout="prev, pager, next" />
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Role'
}
</script>

<style lang="scss" scoped>
.add-role-btn {
  margin-bottom: 10px;
}
</style>
