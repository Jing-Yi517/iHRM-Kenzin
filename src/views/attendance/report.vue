<template>
  <div class="container">
    <div class="app-container">
      <el-button @click="handleArchive">归档202301</el-button>
    </div>
  </div>
</template>

<script>
import { archiveReport } from '@/api/attendance'
export default {
  data() {
    return {

    }
  },
  methods: {
    async handleArchive() {
      await archiveReport('202301')
      this.$message.success('归档成功')
      this.$router.push('/attendance')
    }
  }
}
</script>
