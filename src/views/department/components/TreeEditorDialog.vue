<template>
  <div>
    <el-dialog title="编辑部门" :visible="dialogFormVisible" @close="handleCloseDialog">
      <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
        <el-form-item prop="name" label="部门名称">
          <el-input v-model="formData.name" placeholder="2-10个字符" style="width: 80%" size="mini" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" placeholder="2-10个字符" style="width: 80%" size="mini" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="managerId">
          <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width: 80%" size="mini">
            <el-option v-for="(item) in departmentManagerList" :key="item.id" :label="item.username.startsWith('黑马') ? item.username.slice(2) : item.username" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="formData.introduce" placeholder="1-100个字符" type="textarea" size="mini" :rows="4" style="width: 80%" />
        </el-form-item>
        <el-form-item>
          <!-- 按钮 -->
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button size="mini" type="primary" @click="handleSubmitDialog">确定</el-button>
              <el-button size="mini" @click="handleCloseDialog">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartmentInfo, getDepartmentManagersList as apiGetDepartmentManagersList, addDepartment } from '@/api/department'

export default {
  name: 'TreeEditorDialog',
  props: {
    dialogFormVisible: {
      required: true,
      type: Boolean
    },
    currentNodeId: {
      type: [Number, null],
      default: null
    }
  },
  data() {
    return {
      departmentManagerList: [],
      formData: {
        name: '',
        code: '',
        managerId: '',
        introduce: '',
        pid: ''
      },
      rules: {
        name: [
          { min: 2, max: 10, message: '部门名长度为2-10个字符', trigger: 'blur' },
          {
            validator: async(rule, value, callback) => {
              if (!value) {
                return callback(new Error('请输入部门名称'))
              }
              const res = await getDepartmentInfo()
              if (res.some((item) => { return item.name === value })) {
                return callback(new Error('当前已经有相同名称的部门'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        code: [
          { min: 2, max: 10, message: '部门编码长度为2-10个字符', trigger: 'blur' },
          {
            validator: async(rule, value, callback) => {
              if (!value) {
                return callback(new Error('请输入部门编码'))
              }
              const res = await getDepartmentInfo()
              if (res.some((item) => { return item.code === value })) {
                return callback(new Error('当前已经有相同名称的部门编码'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        managerId: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('请选择部门负责人'))
              }
              callback()
            }
          }
        ],
        introduce: [
          { min: 1, max: 100, message: '部门介绍长度为1-100个字符', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('请输入部门介绍'))
              }
              callback()
            }
          }
        ]
      }
    }
  },
  async created() {
    this.getDepartmentManagersList()
  },
  methods: {
    handleCloseDialog() {
      this.$emit('update:dialogFormVisible', false)
      this.$refs.form.resetFields()
    },
    async handleSubmitDialog() {
      try {
        await this.$refs.form.validate() // 校验表单， 如果通过则继续
        await addDepartment({ ...this.formData, pid: this.currentNodeId })
        this.$emit('updateDepartment')
        // 提示消息
        this.$message.success(`新增部门成功`)
        this.handleCloseDialog()
      } catch (err) {
        console.error('提交部门时发生错误:', err)
      }
    },
    async getDepartmentManagersList() {
      const res = await apiGetDepartmentManagersList()
      this.departmentManagerList = res
    }
  }
}
</script>

<style scoped lang="scss"></style>
