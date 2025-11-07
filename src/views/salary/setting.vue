<template>
  <div class="container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeTab">

          <!-- ====================== 计薪设置 ====================== -->
          <el-tab-pane label="计薪设置" name="salaryCount">
            <el-form label-width="140px" :model="form">

              <el-form-item label="对应社保自然月">
                <el-select v-model="form.socialSecurityType" class="salary-count-setting-input">
                  <el-option :value="1" label="当月" />
                  <el-option :value="2" label="次月" />
                </el-select>
              </el-form-item>

              <el-form-item label="社保数据来源">
                <el-input :value="'社保模块'" disabled class="salary-count-setting-input" />
              </el-form-item>

              <el-form-item label="考勤数据来源">
                <el-input :value="'考勤模块'" disabled class="salary-count-setting-input" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- ====================== 津贴设置 ====================== -->
          <el-tab-pane label="津贴设置" name="subsidy">
            <el-form label-width="100px" :model="form">

              <el-form-item label="通用方案">
                <el-input v-model="form.subsidyName" class="subsidy-setting-long-input" />
              </el-form-item>

              <el-form-item label="备注">
                <el-input v-model="form.subsidyRemark" class="subsidy-setting-long-input" />
              </el-form-item>

              <el-form-item label="津贴名称">

                <!-- 交通补贴 -->
                <el-form-item>
                  <el-input class="subsidy-setting-short-input" disabled :value="'交通补贴'" />
                  <el-select v-model="form.transportationSubsidyScheme">
                    <el-option :value="1" label="每出勤日" />
                    <el-option :value="3" label="每月固定" />
                  </el-select>
                  <el-input v-model="form.transportationSubsidyAmount" class="subsidy-setting-short-input" />
                </el-form-item>

                <!-- 通讯补贴 -->
                <el-form-item>
                  <el-input class="subsidy-setting-short-input" disabled :value="'通讯补贴'" />
                  <el-select v-model="form.communicationSubsidyScheme">
                    <el-option :value="1" label="每出勤日" />
                    <el-option :value="3" label="每月固定" />
                  </el-select>
                  <el-input v-model="form.communicationSubsidyAmount" class="subsidy-setting-short-input" />
                </el-form-item>

                <!-- 午餐补贴 -->
                <el-form-item>
                  <el-input class="subsidy-setting-short-input" disabled :value="'午餐补贴'" />
                  <el-select v-model="form.lunchAllowanceScheme">
                    <el-option :value="1" label="每出勤日" />
                    <el-option :value="3" label="每月固定" />
                  </el-select>
                  <el-input v-model="form.lunchAllowanceAmount" class="subsidy-setting-short-input" />
                </el-form-item>

                <!-- 住房补助 -->
                <el-form-item>
                  <el-input class="subsidy-setting-short-input" disabled :value="'住房补助'" />
                  <el-select v-model="form.housingSubsidyScheme">
                    <el-option :value="1" label="每出勤日" />
                    <el-option :value="3" label="每月固定" />
                  </el-select>
                  <el-input v-model="form.housingSubsidyAmount" class="subsidy-setting-short-input" />
                </el-form-item>

              </el-form-item>

              <el-form-item label="计税方式">
                <el-radio v-model="form.taxCalculationType" label="1">税前</el-radio>
                <el-radio v-model="form.taxCalculationType" label="2">税后</el-radio>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleUpdateSetting">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-form-item>

            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getSalarySetting, updateSalarySetting } from '@/api/salary'

export default {
  data() {
    return {
      activeTab: 'salaryCount',
      form: {
        // tab1
        socialSecurityType: '',

        // tab2
        subsidyName: '',
        subsidyRemark: '',

        transportationSubsidyScheme: null,
        transportationSubsidyAmount: null,

        communicationSubsidyScheme: null,
        communicationSubsidyAmount: null,

        lunchAllowanceScheme: null,
        lunchAllowanceAmount: null,

        housingSubsidyScheme: null,
        housingSubsidyAmount: null,

        taxCalculationType: '1'
      },
      defaultForm: {}
    }
  },

  async created() {
    await this.getSetting()
  },
  methods: {
    async getSetting() {
      const res = await getSalarySetting()
      Object.assign(this.form, res)
      this.defaultForm = JSON.parse(JSON.stringify(res))
    },
    resetForm() {
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
    },
    async handleUpdateSetting() {
      try {
        await updateSalarySetting({ ...this.form })
        const loading = this.$loading({
          lock: true,
          text: '获取新数据中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.$message({
          type: 'success',
          message: '修改计薪与补贴方式成功'
        })
        await this.getSetting()
        loading.close()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.salary-count-setting-input {
  width: 280px;
}

.subsidy-setting-long-input {
  width: 400px;
}

.subsidy-setting-short-input {
  width: 200px;
}
</style>
