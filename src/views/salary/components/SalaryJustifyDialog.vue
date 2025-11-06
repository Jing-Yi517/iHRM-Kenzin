<template>
  <el-dialog
    :title="isInitSalary ? '定薪' : '调薪'"
    :visible="isDialogVisible"
    width="700px"
    @close="handleDialogClose"
  >
    <!-- 调薪时显示员工信息 -->
    <div v-if="!isInitSalary" class="employee-info">
      <el-avatar :size="75" />
      <div class="default-avatar" />
      <div class="info">
        <p>部门：开发部门</p>
        <p>入职时间：2023-01-01</p>
      </div>
    </div>

    <el-divider v-if="!isInitSalary" />

    <!-- 调薪 form -->
    <el-form v-if="!isInitSalary" ref="justifyForm" :model="justifyForm" label-width="110px">
      <el-form-item label="调整基本工资">
        <el-input v-model.number="justifyForm.currentBasicSalary" class="justify-input" disabled />
        ---
        <el-input v-model.number="justifyForm.correctionBasicSalary" class="justify-input" />
      </el-form-item>

      <el-form-item label="调整岗位工资">
        <el-input v-model.number="justifyForm.currentPostWage" class="justify-input" disabled />
        ---
        <el-input v-model.number="justifyForm.correctionPostWage" class="justify-input" />
      </el-form-item>

      <el-form-item label="工资合计">
        <el-input disabled class="justify-input" :value="justifyCurrentSalaryTotal" />
        ---
        <el-input disabled class="justify-input" :value="justifyCorrectionSalaryTotal" />
      </el-form-item>

      <el-form-item label="调整幅度">
        <el-input disabled class="justify-input" :value="adjustRange" />
      </el-form-item>
    </el-form>

    <!-- 定薪 form -->
    <el-form
      v-else
      ref="initForm"
      :model="initForm"
      :rules="initRules"
      label-width="110px"
    >
      <el-form-item label="当前基本工资" prop="currentBasicSalary">
        <el-input v-model="initForm.currentBasicSalary" class="init-input" />
      </el-form-item>

      <el-form-item label="当前岗位工资" prop="currentPostWage">
        <el-input v-model="initForm.currentPostWage" class="init-input" />
      </el-form-item>

      <el-form-item label="当前工资合计">
        <el-input disabled :value="initCurrentSalaryTotal" class="init-input" />
      </el-form-item>

      <el-form-item label="转正基本工资" prop="correctionOfBasicWages">
        <el-input v-model="initForm.correctionOfBasicWages" class="init-input" />
      </el-form-item>

      <el-form-item label="转正岗位工资" prop="turnToPostWages">
        <el-input v-model="initForm.turnToPostWages" class="init-input" />
      </el-form-item>

      <el-form-item label="转正工资合计">
        <el-input disabled :value="initCorrectionSalaryTotal" class="init-input" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClose">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { initEmployeeSalary, modifyEmployeeSalary, getEmployeeSalary } from '@/api/salary'

export default {
  props: {
    isInitSalary: Boolean,
    isDialogVisible: Boolean,
    userId: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      /* 定薪 Form */
      initForm: {
        currentBasicSalary: '',
        currentPostWage: '',
        correctionOfBasicWages: '',
        turnToPostWages: ''
      },

      initRules: {
        currentBasicSalary: [{ required: true, message: '请输入基础工资', trigger: 'blur' }],
        currentPostWage: [{ required: true, message: '请输入岗位工资', trigger: 'blur' }],
        correctionOfBasicWages: [{ required: true, message: '请输入转正基础工资', trigger: 'blur' }],
        turnToPostWages: [{ required: true, message: '请输入转正岗位工资', trigger: 'blur' }]
      },

      /* 调薪 Form */
      justifyForm: {
        currentBasicSalary: 0,
        currentPostWage: 0,
        correctionBasicSalary: 0,
        correctionPostWage: 0
      }
    }
  },

  computed: {
    initCurrentSalaryTotal() {
      return (+this.initForm.currentBasicSalary) + (+this.initForm.currentPostWage)
    },
    initCorrectionSalaryTotal() {
      return (+this.initForm.correctionOfBasicWages) + (+this.initForm.turnToPostWages)
    },

    justifyCurrentSalaryTotal() {
      return (+this.justifyForm.currentBasicSalary) + (+this.justifyForm.currentPostWage)
    },
    justifyCorrectionSalaryTotal() {
      return (+this.justifyForm.correctionBasicSalary) + (+this.justifyForm.correctionPostWage)
    },

    adjustRange() {
      return (
        this.justifyCorrectionSalaryTotal - this.justifyCurrentSalaryTotal
      )
    }
  },

  watch: {
    // 当 dialog 打开 且是「调薪模式」时，请求接口填充数据
    isDialogVisible(val) {
      if (val && !this.isInitSalary) {
        this.loadEmployeeSalary()
      }
    }
  },

  methods: {
    handleDialogClose() {
      // 重置定薪 form
      this.$refs.initForm && this.$refs.initForm.resetFields()
      this.initForm = {
        currentBasicSalary: '',
        currentPostWage: '',
        correctionOfBasicWages: '',
        turnToPostWages: ''
      }

      // 重置调薪 form
      this.justifyForm = {
        currentBasicSalary: 0,
        currentPostWage: 0,
        correctionBasicSalary: 0,
        correctionPostWage: 0
      }

      this.$emit('dialogClose')
    },

    /** ✅ 提交按钮逻辑 */
    async submitForm() {
      if (this.isInitSalary) {
        this.$refs.initForm.validate(async(valid) => {
          if (!valid) return
          await initEmployeeSalary(this.userId, { ...this.initForm })
          this.handleSuccess()
        })
      } else {
        await this.submitModifySalary()
      }
    },

    async submitModifySalary() {
      await modifyEmployeeSalary(this.userId, {
        currentBasicSalary: this.justifyForm.correctionBasicSalary.toString(),
        currentPostWage: this.justifyForm.correctionPostWage.toString()
      })
      this.handleSuccess()
    },

    handleSuccess() {
      this.$message.success('修改成功')
      this.$emit('justifySuccess')
      this.handleDialogClose()
    },

    async loadEmployeeSalary() {
      const res = await getEmployeeSalary(this.userId)

      this.justifyForm.currentBasicSalary = Number(res.currentBasicSalary || 0)
      this.justifyForm.currentPostWage = Number(res.currentPostWage || 0)
      this.justifyForm.correctionBasicSalary = 0
      this.justifyForm.correctionPostWage = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-info {
  display: flex;
  .info {
    margin-left: 20px;
  }
}
.justify-input {
  width: 250px;
}
.init-input {
  width: 300px;
}
</style>
