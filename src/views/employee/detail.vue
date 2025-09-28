<template>
  <div class="container">
    <div class="app-container">
      <el-form ref="form" label-width="220px" :model="formModel" :rules="rules">

        <el-row>
          <el-col :span="12" :offset="2">
            <el-form-item label="姓名" prop="username">
              <el-input v-model="formModel.username" style="width: 350px;" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" :offset="2">
            <el-form-item label="工号">
              <el-input v-model="formModel.workNumber" disabled style="width: 350px;" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" :offset="2">
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="formModel.mobile" style="width: 350px;" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" :offset="2">
            <el-form-item label="部门" prop="departmentId">
              <DepartmenCascader v-model="formModel.departmentId" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" :offset="2">
            <el-form-item label="聘用形式" prop="formOfEmployment">
              <el-select v-model="formModel.formOfEmployment" style="width: 350px;">
                <el-option label="正式" :value="1" />
                <el-option label="非正式" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" :offset="2">
            <el-form-item label="入职时间" prop="timeOfEntry">
              <el-date-picker
                v-model="formModel.timeOfEntry"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期时间"
                style="width: 350px;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" :offset="2">
            <el-form-item label="转正时间" prop="correctionTime">
              <el-date-picker
                v-model="formModel.correctionTime"
                type="date"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
                style="width: 350px;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" :offset="2">
            <el-form-item label="员工头像" />
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" :offset="2">
            <el-form-item>
              <el-button type="primary" @click="handleSaveEmployee">保存员工信息</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
  </div>
</template>

<script>
import DepartmenCascader from '@/views/employee/components/DepartmenCascader.vue'
import { addEmployee } from '@/api/employee'
export default {
  name: 'EmployeeDetail',
  components: { DepartmenCascader },
  data() {
    return {
      formModel: {
        username: '',
        mobile: '',
        departmentId: 2,
        workNumber: '',
        correctionTime: '',
        formOfEmployment: '',
        timeOfEntry: ''
      },
      rules: {
        username: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('请输入姓名'))
              if (value.length > 4) return callback(new Error('姓名为2-4个字符'))
              callback()
            },
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号码格式',
            trigger: 'blur'
          }
        ],
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '请选择聘用方式', trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ],
        correctionTime: [
          {
            required: true,
            message: '请选择转正时间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    validateCorrectionTime() {
      if (this.formModel.timeOfEntry && this.formModel.correctionTime) {
        if (new Date(this.formModel.timeOfEntry) > new Date(this.formModel.correctionTime)) {
          this.$message.error('转正时间不能小于入职时间')
          return false
        }
      }
      return true
    },

    async handleSaveEmployee() {
      console.log('点击开始')

      try {
        if (!this.validateCorrectionTime()) {
          return
        }

        const valid = await this.$refs.form.validate()

        if (!valid) {
          return
        }
        await addEmployee({ ...this.formModel })
        // 添加成功提示
        this.$message.success('员工添加成功')
      } catch (error) {
        this.$message.error('操作失败：' + (error.message || '未知错误'))
      }
    }
  }
}
</script>

<style scoped lang="scss">
.app-container{
 padding-top: 50px;
}

</style>
