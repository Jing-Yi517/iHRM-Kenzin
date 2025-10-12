<template>
  <el-dialog :title="type === 1 ? '添加权限' : '添加子权限' " :visible="isDialogVisible" width="500px" @close="handleCloseDialog">
    <el-form ref="form" :model="formData" style="padding-left:30px" :rules="rules">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" autocomplete="off" class="form-item" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" autocomplete="off" class="form-item" />
      </el-form-item>
      <el-form-item label="权限描述" prop="description">
        <el-input v-model="formData.description" autocomplete="off" class="form-item" type="textarea" resize="none" />
      </el-form-item>
      <el-form-item label="开启" prop="enVisible">
        <el-switch v-model="formData.enVisible" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCloseDialog">取 消</el-button>
      <el-button type="primary" @click="handleEditPermission">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getPermissionList, addPermissionNode, getPermissionNodeDetail, updatePermissionNode } from '@/api/permission'
const defaultFormData = {
  name: '', // 权限名称
  code: '', // 权限标识
  description: '', // 权限描述
  enVisible: false, // 是否开启
  pid: 0 // 父节点id
}
export default {
  props: {
    isDialogVisible: {
      required: true,
      type: Boolean,
      default: false
    },
    type: {
      required: true,
      type: Number
    },
    id: {
      required: true,
      type: Number
    },
    isEdit: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      form: null, // form ref
      formData: { ...defaultFormData },
      isSubmitting: false, // 是否正在提交编辑
      rules: {
        name: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('请输入权限名称'))
              callback()
            },
            trigger: 'blur'
          }
        ],
        code: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('请输入权限标识'))
              callback()
            },
            trigger: 'blur'
          }
        ],
        description: [],
        enVisible: []
      }
    }
  },
  watch: {
    async isDialogVisible(newVal) {
      // 每次弹窗打开时触发初始化逻辑
      if (newVal) {
        await this.$nextTick() // 确保DOM更新完成
        if (this.isEdit) {
          // 编辑模式 -> 获取详情
          const res = await getPermissionNodeDetail(this.id)
          this.formData = {
            name: res.name,
            code: res.code,
            description: res.description,
            enVisible: res.enVisible,
            pid: res.pid,
            id: this.id
          }
        } else {
          // 新增模式 -> 初始化表单
          this.formData = {
            ...defaultFormData,
            type: this.type,
            pid: this.id || 0
          }
        }
      }
    }
  },
  methods: {
    /**
     * ? 关闭Dialog逻辑
     * * emit父节点，处理visible变量
     * * 清空，重置表单状态
     */
    handleCloseDialog() {
      this.$emit('closeDialog')
      this.$refs.form && this.$refs.form.resetFields() // 清空校验状态
      this.formData = { ...defaultFormData }
    },

    /**
     * ? 自定义表单检验逻辑
     * * 全局权限标识不能重复
     * * 同一父节点下权限名称不能重复
     * ! 编辑模式下要跳过自己
     */
    async validateForm() {
      const res = await getPermissionList()

      for (const value of res) {
        // 编辑模式下跳过自己
        if (this.isEdit && value.id === this.formData.id) continue
        // code 必须唯一
        if (value.code === this.formData.code) {
          throw new Error(`权限标识 "${this.formData.code}" 已存在，请使用其他标识`)
        }
        // 同一父节点下 name 必须唯一
        if (value.pid === this.formData.pid && value.name === this.formData.name) {
          throw new Error(`同一节点下已存在权限 "${this.formData.name}"，请修改名称`)
        }
      }
      return true // 所有检查通过
    },

    /**
     * ? 提交添加/编辑逻辑
     * * 根据isEdit判断添加/编辑模式
     * * 防抖处理
     */
    async handleEditPermission() {
      // 防抖：如果正在提交，直接返回
      if (this.isSubmitting) {
        this.$message({ type: 'warning', message: '请勿重复点击' })
        return
      }

      this.isSubmitting = true
      try {
        await this.$refs.form.validate()
        await this.validateForm()

        if (this.isEdit === false) {
          await addPermissionNode({ ...this.formData })
          this.$message({ type: 'success', message: '添加权限点成功' })
        } else {
          await updatePermissionNode(this.formData)
          this.$message({ type: 'success', message: '修改权限点成功' })
        }

        this.handleCloseDialog()
        this.$emit('editSuccess')
      } catch (error) {
        this.$message({
          type: 'error',
          message: error.message || error
        })
      } finally {
        // 无论成功失败，都要重置提交状态
        this.isSubmitting = false
      }
    }

  }
}
</script>

<style scoped lang="scss">
.form-item{
  width: 300px;
}

</style>
