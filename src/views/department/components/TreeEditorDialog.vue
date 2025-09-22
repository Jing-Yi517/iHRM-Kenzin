<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="handleCloseDialog">
      <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
        <el-form-item prop="name" label="部门名称">
          <el-input v-model="formData.name" placeholder="2-10个字符" style="width: 80%" size="mini" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" placeholder="2-10个字符" style="width: 80%" size="mini" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="managerId">
          <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width: 80%" size="mini">
            <el-option
              v-for="item in departmentManagerList"
              :key="item.id"
              :label="(item.username && typeof item.username === 'string' && item.username.startsWith('黑马'))
                ? item.username.slice(2)
                : item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="formData.introduce"
            placeholder="1-100个字符"
            type="textarea"
            size="mini"
            :rows="4"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item>
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
import {
  getDepartmentInfo,
  getDepartmentManagersList as apiGetDepartmentManagersList,
  addDepartment,
  getDepartmentDetail,
  updateDepartmentDetail
} from '@/api/department'
// 默认表单结构
const DEFAULT_FORM = {
  code: '',
  introduce: '',
  managerId: '',
  name: ''
}

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
      departmentManagerList: [], // 管理员列表
      formData: { ...DEFAULT_FORM }, // 表单数据
      rules: {
        name: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('请输入部门名称'))
              if (value.length < 2 || value.length > 10) {
                return callback(new Error('部门名长度为2-10个字符'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        code: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('请输入部门编码'))
              if (value.length < 2 || value.length > 10) {
                return callback(new Error('部门编码长度为2-10个字符'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        managerId: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('请选择部门负责人'))
              callback()
            },
            trigger: 'change'
          }
        ],
        introduce: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('请输入部门介绍'))
              if (value.length < 1 || value.length > 100) {
                return callback(new Error('部门介绍长度为1-100个字符'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  created() {
    this.getDepartmentManagersList()
  },
  methods: {
    /**
     * Dialog 关闭的时候的逻辑
     * 重置表单： 防止表单校验错误的样式还存在
     * 重置表单数据
     */
    handleCloseDialog() {
      this.$emit('update:dialogFormVisible', false)
      this.$refs.form && this.$refs.form.resetFields()
      this.formData = { ...DEFAULT_FORM }
    },
    /**
     * 新增/编辑部门 逻辑
     * 在这里进行了数据唯一性的检验
     */
    async handleSubmitDialog() {
      try {
        await this.$refs.form.validate()

        // 提交前做一次实时唯一性校验
        let res = await getDepartmentInfo()
        if (this.formData.id) {
          res = res.filter((item) => item.id !== this.formData.id)
        }
        if (res.some((item) => item.name === this.formData.name)) {
          this.$message.error('当前已经有相同名称的部门')

          return
        }
        if (res.some((item) => item.code === this.formData.code)) {
          this.$message.error('当前已经有相同的部门编码')

          return
        }

        if (!this.formData.id) {
          await addDepartment({ ...this.formData, pid: this.currentNodeId })
          this.$emit('updateDepartment')
          this.$message.success('新增部门成功')
        } else {
          await updateDepartmentDetail(this.formData)
          this.$emit('updateDepartment')
          this.$message.success('修改部门成功')
        }
        this.handleCloseDialog()
      } catch (err) {
        console.error('提交部门时发生错误:', err)
      }
    },
    /**
     * 获取管理员列表
    */
    async getDepartmentManagersList() {
      const res = await apiGetDepartmentManagersList()
      this.departmentManagerList = res
    },
    /**
     * 获取表单具体数据
    */
    async getDepartmentDetail(id) {
      try {
        const res = await getDepartmentDetail(id)
        this.formData = res
      } catch (err) {
        this.$message({ type: 'error', message: '获取部门详细信息失败' })
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
