<template>
  <el-dialog
    title="员工导入"
    :visible="isDialogVisible"
    width="700px"
    @close="handleCloseDialog"
  >
    <el-upload
      ref="upload"
      class="upload"
      action=""
      drag
      :multiple="false"
      :auto-upload="false"
      :on-change="handleFileChange"
      :limit="1"
      accept=".xlsx,.xls"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text" style="margin-bottom: 5px;" @click.stop="handleDownloadTemplate">
        <em>点击下载上传模板</em>
      </div>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCloseDialog">取 消</el-button>
      <el-button type="primary" @click="uploadFile">上 传</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getImportExcelTemplate, uploadImportExcelTemplate } from '@/api/employee'
import FileSaver from 'file-saver'

export default {
  name: 'ExcelImportDialog',
  props: {
    isDialogVisible: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      fileList: [] // 存放 el-upload 的文件列表
    }
  },
  methods: {
    handleCloseDialog() {
      // 通知父组件关闭
      this.$emit('update:isDialogVisible', false)
      this.$refs.upload.clearFiles()
    },

    async handleDownloadTemplate() {
      try {
        const res = await getImportExcelTemplate()
        // 兼容后端直接返回 Blob 或 axios 返回的 { data: Blob }
        const data = res && res.data ? res.data : res
        const blob = data instanceof Blob ? data : new Blob([data])
        FileSaver.saveAs(blob, '员工导入模板.xlsx')
        this.$message.success('下载成功')
      } catch (err) {
        const msg = err && err.message ? err.message : err
        this.$message.error('获取模板失败: ' + msg)
      }
    },

    // el-upload 的 on-change 会传 (file, fileList)
    handleFileChange(file, fileList) {
      this.fileList = fileList
      console.log(fileList)
    },

    async uploadFile() {
      if (!this.fileList || this.fileList.length === 0) {
        this.$message.warning('请先选择文件')
        return
      }

      try {
        const formData = new FormData()
        // 必须拿 .raw
        formData.append('file', this.fileList[0].raw)

        const res = await uploadImportExcelTemplate(formData)

        // 检查响应是否成功
        if (res && (res.success || res.code === 200 || res.status === 200)) {
          this.$message.success(res.message || '批量导入成功')
          this.$emit('update:isDialogVisible', false)
          this.$refs.upload.clearFiles()
          this.fileList = []
          // 通知父组件需要刷新数据
          this.$emit('upload-success')
        } else {
          // 后端返回了响应但表示失败
          this.$message.error(res.message || '上传失败，请检查文件格式')
        }
      } catch (error) {
        // 网络错误或后端异常
        const errorMsg = error.response?.data?.message || error.message || '上传失败'
        this.$message.error('上传失败: ' + errorMsg)
        console.error('上传错误:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload{
  display: flex;
  justify-content: center;
  align-self: center;
}
</style>
