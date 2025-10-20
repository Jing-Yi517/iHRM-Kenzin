<template>
  <div class="container">
    <div class="app-container">
      <!-- 员工信息 -->
      <el-card class="detail">
        <el-row>
          <el-col :span="2">
            <img
              v-if="securityDetail.user.staffPhoto"
              :src="securityDetail.user.staffPhoto"
              class="staff-photo"
            >
            <div v-else class="default-staff-photo">
              {{ securityDetail.user.username?.slice(0, 1) }}
            </div>
          </el-col>

          <el-col :span="8">
            <el-row>
              <h3>{{ securityDetail.user.username }}</h3>
              <el-tag
                v-if="securityDetail.user.enableState === 1"
                size="mini"
                effect="dark"
                type="success"
              >在职</el-tag>
            </el-row>

            <el-row class="info-row">
              <el-col :span="8">最新工资基数：{{ securityDetail.user.salaryBase }}</el-col>
              <el-col :span="8">入职时间：{{ securityDetail.user.timeOfEntry }}</el-col>
              <el-col :span="8">联系电话：{{ securityDetail.user.mobile }}</el-col>
            </el-row>

            <el-row>
              <el-form inline :model="formData">
                <el-form-item>
                  <el-switch
                    v-model="formData.enterprisesPaySocialSecurityThisMonth"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    inactive-text="本月不缴纳社保"
                  />
                </el-form-item>
                <el-form-item>
                  <el-switch
                    v-model="formData.enterprisesPayTheProvidentFundThisMonth"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    inactive-text="本月不缴纳公积金"
                  />
                </el-form-item>
              </el-form>
            </el-row>
          </el-col>
        </el-row>
      </el-card>

      <!-- 表单区域 -->
      <el-card class="form-container">
        <el-form :model="formData" label-width="120px" label-position="right" class="main-form">

          <!-- 社保信息 -->
          <el-form-item label="参保城市">
            <el-select v-model="formData.participatingInTheCityId" size="mini" placeholder="请选择参保城市">
              <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="参保类型">
            <el-select v-model="formData.socialSecurityType" size="mini" placeholder="请选择参保类型">
              <el-option label="首次开户" :value="1" />
              <el-option label="非首次开户" :value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="户籍类型">
            <el-select v-model="formData.householdRegistrationType" size="mini" placeholder="请选择户籍类型">
              <el-option label="本市城镇" :value="1" />
              <el-option label="本市农村" :value="2" />
              <el-option label="外埠城镇" :value="3" />
              <el-option label="外埠农村" :value="4" />
            </el-select>
          </el-form-item>

          <el-form-item label="社保基数">
            <el-input v-model.number="formData.socialSecurityBase" size="mini" placeholder="请输入社保基数" />
          </el-form-item>

          <el-form-item label="工伤比例">
            <el-input v-model.number="formData.industrialInjuryRatio" size="mini" placeholder="请输入工伤比例" />
          </el-form-item>

          <!-- 社保缴纳 -->
          <el-form-item label="社保缴纳">
            <el-row>
              <el-col :span="6">
                <el-form-item label="个人" label-width="50px">
                  <el-input
                    v-model.number="formData.personalSocialSecurityPayment"
                    size="mini"
                    placeholder="个人缴纳"
                    class="short-input"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公司" label-width="50px">
                  <el-input
                    v-model.number="formData.enterpriseSocialSecurityPayment"
                    size="mini"
                    placeholder="公司缴纳"
                    class="short-input"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-table :data="insuranceTable" border class="insurance-table" style="margin-top: 10px">
              <el-table-column prop="type" label="缴费项目" align="center" />
              <el-table-column prop="companyBase" label="企业基数 (元)" align="center" />
              <el-table-column prop="companyRate" label="企业比例 (%)" align="center" />
              <el-table-column prop="companyPay" label="企业缴纳 (元)" align="center" />
              <el-table-column prop="personalRate" label="个人比例 (%)" align="center" />
              <el-table-column prop="personalPay" label="个人缴纳 (元)" align="center" />
            </el-table>
          </el-form-item>

          <el-form-item label="社保备注">
            <el-input v-model="formData.socialSecurityNotes" type="textarea" placeholder="请输入备注" />
          </el-form-item>

          <el-divider />

          <!-- 公积金部分 -->
          <el-form-item label="公积金城市">
            <el-select v-model="formData.providentFundCityId" size="mini" placeholder="请选择城市">
              <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="公积金基数">
            <el-input v-model.number="formData.providentFundBase" size="mini" placeholder="请输入基数" />
          </el-form-item>

          <el-form-item label="企业比例">
            <el-input v-model.number="formData.enterpriseProportion" size="mini" placeholder="请输入企业比例" />
          </el-form-item>

          <el-form-item label="个人比例">
            <el-input v-model.number="formData.personalProportion" size="mini" placeholder="请输入个人比例" />
          </el-form-item>

          <!-- 公积金缴纳 -->
          <el-form-item label="公积金缴纳">
            <el-row>
              <el-col :span="6">
                <el-form-item label="个人" label-width="50px">
                  <el-input
                    v-model.number="formData.personalProvidentFundPayment"
                    size="mini"
                    placeholder="个人缴纳"
                    class="short-input"
                    @input="handlePersonalProvidentFundInput"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="公司" label-width="50px">
                  <el-input
                    v-model.number="formData.enterpriseProvidentFundPayment"
                    size="mini"
                    placeholder="公司缴纳"
                    class="short-input"
                    @input="handleEnterpriseProvidentFundInput"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="公积金备注">
            <el-input v-model="formData.providentFundNotes" type="textarea" placeholder="请输入备注" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit">确认</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getSocialSecurityDetail, getCityList } from '@/api/social'

export default {
  data() {
    return {
      securityDetail: { user: {}, userSocialSecurity: {}},
      // 社保险种配置
      insuranceConfig: [
        { type: '养老保险', companyRate: 16, personalRate: 8 },
        { type: '医疗保险', companyRate: 10, personalRate: 5 },
        { type: '失业保险', companyRate: 1, personalRate: 1 },
        { type: '工伤保险', companyRate: null, personalRate: 0 }, // 公司比例从表单获取
        { type: '生育保险', companyRate: 1, personalRate: 0 },
        { type: '大病保险', companyRate: 12, personalRate: 6 }
      ],
      formData: {
        enterprisesPaySocialSecurityThisMonth: 0, // 企业应交社保
        enterprisesPayTheProvidentFundThisMonth: 0, // 本月是否缴纳公积金
        providentFundBase: 0, // 公积金基数
        personalProportion: 0, // 个人比例（公积金）
        enterpriseProportion: 0, // 公司比例（公积金）
        personalProvidentFundPayment: undefined, // 个人应交公积金
        enterpriseProvidentFundPayment: undefined, // 企业应交公积金
        socialSecurityType: undefined, // 参保类型 1 为首次开户 2 为非首次
        householdRegistrationType: undefined, // 户籍类型 1为本市城镇 2为本市农村 3为外埠城镇 4为外埠农村
        participatingInTheCityId: undefined, // 参保城市 id
        providentFundCityId: undefined, // 公积金城市 id
        socialSecurityNotes: '', // 社保备注
        providentFundNotes: '', // 公积金备注
        socialSecurityBase: 0, // 社保基数
        industrialInjuryRatio: 0, // 工伤比例
        personalSocialSecurityPayment: 0, // 个人应交社保
        enterpriseSocialSecurityPayment: 0 // 企业应交社保
      },
      cityList: [],
      // 标记是否手动输入了公积金缴纳金额

      isManualProvidentFundInput: {
        personal: false,
        enterprise: false
      },
      // 记录手动输入前的比例值，用于判断是否应该重置手动输入标记
      lastProportions: {
        enterprise: 0,
        personal: 0
      }
    }
  },
  computed: {
    // 社保表格数据
    insuranceTable() {
      const base = Number(this.formData.socialSecurityBase) || 0
      const industrialInjuryRate = Number(this.formData.industrialInjuryRatio) || 0

      return this.insuranceConfig.map(item => {
        // 确定公司比例：如果是工伤保险则使用表单中的比例，否则使用预设比例
        const companyRate = item.type === '工伤保险' ? industrialInjuryRate : item.companyRate

        // 计算缴纳金额
        const companyPay = Number((base * companyRate / 100).toFixed(2))
        const personalPay = Number((base * item.personalRate / 100).toFixed(2))

        return {
          type: item.type,
          companyBase: base,
          companyRate: companyRate,
          companyPay: companyPay,
          personalRate: item.personalRate,
          personalPay: personalPay
        }
      })
    },

    // 个人社保缴纳总额（表格中个人缴纳列的总和）
    totalPersonalSocialSecurity() {
      return this.insuranceTable.reduce((sum, item) => sum + item.personalPay, 0)
    },

    // 企业社保缴纳总额（表格中企业缴纳列的总和）
    totalEnterpriseSocialSecurity() {
      return this.insuranceTable.reduce((sum, item) => sum + item.companyPay, 0)
    }
  },
  watch: {
    // 监听社保基数变化，自动更新社保缴纳总额
    totalPersonalSocialSecurity: {
      handler(newVal) {
        this.formData.personalSocialSecurityPayment = Number(newVal.toFixed(2))
      },
      immediate: true
    },
    // 监听社保基数和工伤比例变化，自动更新社保缴纳总额
    totalEnterpriseSocialSecurity: {
      handler(newVal) {
        this.formData.enterpriseSocialSecurityPayment = Number(newVal.toFixed(2))
      },
      immediate: true
    },

    // 监听公积金基数和比例变化，自动计算公积金缴纳金额
    'formData.providentFundBase': {
      handler() {
        this.calculateProvidentFundPayment()
      },
      immediate: true
    },
    'formData.enterpriseProportion': {
      handler(newVal, oldVal) {
        // 记录比例变化
        this.lastProportions.enterprise = oldVal

        // 如果比例发生变化，重置手动输入标记，重新启用自动计算
        if (newVal !== oldVal) {
          this.isManualProvidentFundInput.enterprise = false
        }
        this.calculateProvidentFundPayment()
      },
      immediate: true
    },
    'formData.personalProportion': {
      handler(newVal, oldVal) {
        // 记录比例变化
        this.lastProportions.personal = oldVal

        // 如果比例发生变化，重置手动输入标记，重新启用自动计算
        if (newVal !== oldVal) {
          this.isManualProvidentFundInput.personal = false
        }
        this.calculateProvidentFundPayment()
      },
      immediate: true
    },

    formData: {
      handler(newVal) {
        console.log('表单数据变化:', JSON.parse(JSON.stringify(newVal)))
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    // 获取接口数据
    const res = await getSocialSecurityDetail(this.$route.params.id)
    this.securityDetail = res
    console.log('API返回完整数据:', res)

    // 确保响应式初始化
    const ss = res.userSocialSecurity || {}
    console.log('社保详情数据:', ss)

    // 初始化比例记录
    this.lastProportions.enterprise = Number(ss.enterpriseProportion) || 0
    this.lastProportions.personal = Number(ss.personalProportion) || 0

    // 使用深度合并确保所有字段都被正确设置
    Object.assign(this.formData, {
      enterprisesPaySocialSecurityThisMonth: ss.enterprisesPaySocialSecurityThisMonth ?? 0,
      enterprisesPayTheProvidentFundThisMonth: ss.enterprisesPayTheProvidentFundThisMonth ?? 0,
      providentFundBase: ss.providentFundBase ?? 0,
      // 确保数值类型正确转换
      personalProportion: Number(ss.personalProportion) || 0,
      enterpriseProportion: Number(ss.enterpriseProportion) || 0,
      personalProvidentFundPayment: ss.personalProvidentFundPayment,
      enterpriseProvidentFundPayment: ss.enterpriseProvidentFundPayment,
      socialSecurityType: ss.socialSecurityType,
      householdRegistrationType: ss.householdRegistrationType,
      participatingInTheCityId: ss.participatingInTheCityId,
      providentFundCityId: ss.providentFundCityId,
      socialSecurityNotes: ss.socialSecurityNotes || '',
      providentFundNotes: ss.providentFundNotes || '',
      // 新增缺失的字段
      socialSecurityBase: ss.socialSecurityBase || 0,
      industrialInjuryRatio: ss.industrialInjuryRatio || 0,
      personalSocialSecurityPayment: ss.personalSocialSecurityPayment || 0,
      enterpriseSocialSecurityPayment: ss.enterpriseSocialSecurityPayment || 0
    })

    console.log('合并后的formData:', this.formData)

    this.cityList = await getCityList()
    console.log('城市列表:', this.cityList)
  },
  methods: {
    // 计算公积金缴纳金额
    calculateProvidentFundPayment() {
      const base = Number(this.formData.providentFundBase) || 0
      const enterpriseRate = Number(this.formData.enterpriseProportion) || 0
      const personalRate = Number(this.formData.personalProportion) || 0

      // 只有当没有手动输入时才自动计算
      if (!this.isManualProvidentFundInput.enterprise) {
        this.formData.enterpriseProvidentFundPayment = Number((base * enterpriseRate / 100).toFixed(2))
      }
      if (!this.isManualProvidentFundInput.personal) {
        this.formData.personalProvidentFundPayment = Number((base * personalRate / 100).toFixed(2))
      }
    },

    // 处理个人公积金缴纳输入
    handlePersonalProvidentFundInput(value) {
      this.isManualProvidentFundInput.personal = true
      this.formData.personalProvidentFundPayment = Number(value) || 0
    },

    // 处理企业公积金缴纳输入
    handleEnterpriseProvidentFundInput(value) {
      this.isManualProvidentFundInput.enterprise = true
      this.formData.enterpriseProvidentFundPayment = Number(value) || 0
    },

    handleSubmit() {
      console.log('提交数据:', this.formData)
      console.log('社保表格数据:', this.insuranceTable)
      // 这里添加提交逻辑
    },
    handleCancel() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;

  .detail {
    margin-bottom: 20px;
    .default-staff-photo {
      width: 80px;
      height: 80px;
      border-radius: 40px;
      text-align: center;
      line-height: 80px;
      font-size: 22px;
      background: #04c9be;
    }
    .staff-photo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }
    .info-row {
      font-size: 17px;
      color: #666;
      margin-top: 5px;
    }
  }

  .form-container {
    padding: 20px;

    .main-form {
      .el-form-item {
        margin-bottom: 16px;
      }

      .el-input:not(.short-input) {
        width: 300px;
      }

      .el-select {
        width: 200px;
      }

      .el-textarea {
        width: 500px;
      }

      .short-input {
        width: 200px !important;
      }

      .el-row {
        align-items: center;
      }
    }

    .insurance-table {
      margin-top: 8px;
      border-radius: 6px;
    }
  }
}
</style>
