<template>
  <div class="container">
    <div class="app-container">
      <el-tree :data="dept" :props="treeSettings" :default-expand-all="true" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Department',
  data() {
    return {
      dept: [{
        deptName: 'xx公司',
        children: [
          { deptName: '总裁办' },
          { deptName: '行政部' },
          { deptName: '人事部', children: [{ deptName: '财务核算部' }, { deptName: '税务管理部' }, { deptName: '薪资管理部' }] },
          { deptName: '财务部' },
          { deptName: '技术部' },
          { deptName: '运营部' },
          { deptname: '市场部' }
        ]
      }],
      treeSettings: {
        label: 'deptName',
        children: 'children'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  padding:30px 140px;
  font-size: 14px;
}
</style>
