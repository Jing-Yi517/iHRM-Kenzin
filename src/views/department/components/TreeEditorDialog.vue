<template>
  <div>
    <el-dialog :title="title" :visible="dialogFormVisible" @close="handleCloseDialog">
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
import { getDepartmentInfo, getDepartmentManagersList as apiGetDepartmentManagersList, addDepartment, getDepartmentDetail, updateDepartmentDetail } from '@/api/department'
// 默认表单结构，用于重置和初始化
const DEFUALT_FORM = {
  code: '', // 部门编码
  introduce: '', // 部门介绍
  managerId: '', // 部门负责人id
  name: '', // 部门名称
  pid: '' // 父级部门的id
}
export default {
  name: 'TreeEditorDialog',
  props: {
    // 当前Dialog是否可见
    dialogFormVisible: {
      required: true,
      type: Boolean
    },
    // 当前操作的树状结构的节点id
    currentNodeId: {
      type: [Number, null],
      default: null
    }
  },
  data() {
    return {
      departmentManagerList: [], // 部门管理人列表
      formData: { ...DEFUALT_FORM },
      rules: { // 表单校验规则
        name: [
          { min: 2, max: 10, message: '部门名长度为2-10个字符', trigger: 'blur' },
          {
            validator: async(rule, value, callback) => {
              if (!value) {
                return callback(new Error('请输入部门名称'))
              }
              let res = await getDepartmentInfo()
              // 只有在编辑模式下， formData才会出现id字段，以此作为判断方法
              if (this.formData.id) {
                // 排除自身， 防止在编辑模式下被检验规则拦住
                res = res.filter((item) => item.id !== this.formData.id)
              }
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
              let res = await getDepartmentInfo()
              if (this.formData.id) {
                // 排除自身， 防止在编辑模式下被检验规则拦住
                res = res.filter((item) => item.id !== this.formData.id)
              }
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
  computed: {
    title: function() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  async created() {
    this.getDepartmentManagersList()
  },
  methods: {
    handleCloseDialog() {
      this.$emit('update:dialogFormVisible', false)
      this.$refs.form.resetFields()
      this.formData = { ...DEFUALT_FORM }
    },
    async handleSubmitDialog() {
      try {
        await this.$refs.form.validate() // 校验表单， 如果通过则继续
        if (!this.formData.id) {
          await addDepartment({ ...this.formData, pid: this.currentNodeId })
          this.$emit('updateDepartment')
          this.$message.success(`新增部门成功`)
        } else {
          await updateDepartmentDetail(this.formData)
          this.$emit('updateDepartment')
          this.$message.success(`修改部门成功`)
        }
        this.handleCloseDialog()
      } catch (err) {
        console.error('提交部门时发生错误:', err)
      }
    },
    async getDepartmentManagersList() {
      const res = await apiGetDepartmentManagersList()
      this.departmentManagerList = res
    },
    async getDepartmentDetail(id) {
      try {
        const res = await getDepartmentDetail(id)
        this.formData = res // 如果是编辑模式，这里的formData内会有id字段值
      } catch (err) {
        this.$message({ type: 'error', message: '获取部门详细信息失败' })
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
