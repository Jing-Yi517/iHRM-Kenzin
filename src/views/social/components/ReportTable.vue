<template>
  <el-table
    :data="data"
    border
    style="width: 100%;"
  >

    <el-table-column label="序号" prop="userId" width="180" fixed="left" />
    <el-table-column label="姓名" prop="username" width="180" fixed="left" />
    <el-table-column label="手机号" prop="mobile" width="180" fixed="left" />
    <el-table-column label="入职时间" prop="timeOfEntry" width="180" />

    <el-table-column label="身份证号码" prop="idNumber" width="180" />
    <el-table-column label="学历" prop="theHighestDegreeOfEducation" width="180" />
    <el-table-column label="开户行" prop="openingBank" width="180" />

    <el-table-column label="一级部门" prop="firstLevelDepartment" width="180" />
    <el-table-column label="二级部门" prop="twoLevelDepartment" width="180" />

    <el-table-column label="工作城市" width="180">
      <template slot-scope="{ row }">{{ row.workingCity || '--' }}</template>
    </el-table-column>

    <el-table-column label="社保电脑号" width="180">
      <template slot-scope="{ row }">{{ row.socialSecurityComputerNumber || '--' }}</template>
    </el-table-column>

    <el-table-column label="公积金账号" width="180">
      <template slot-scope="{ row }">{{ row.providentFundAccount || '--' }}</template>
    </el-table-column>

    <el-table-column label="离职时间" width="180">
      <template slot-scope="{ row }">{{ row.leaveDate || '--' }}</template>
    </el-table-column>

    <el-table-column label="户籍类型" prop="householdRegistrationType" width="180" />

    <el-table-column label="参保城市" prop="participatingInTheCity" width="180" />
    <el-table-column label="社保月份" prop="socialSecurityMonth" width="180" />
    <el-table-column label="社保基数" prop="socialSecurityBase" width="180" />
    <el-table-column label="社保合计" prop="socialSecurity" width="180" />
    <el-table-column label="社保企业" prop="socialSecurityEnterprise" width="180" />
    <el-table-column label="社保个人" prop="socialSecurityIndividual" width="180" />

    <el-table-column label="公积金城市" prop="providentFundCity" width="180" />
    <el-table-column label="公积金月份" prop="providentFundMonth" width="180" />
    <el-table-column label="公积金基数" prop="providentFundBase" width="180" />
    <el-table-column label="公积金企业基数" prop="accumulationFundEnterpriseBase" width="180" />
    <el-table-column label="公积金企业比例" prop="proportionOfProvidentFundEnterprises" width="180" />
    <el-table-column label="公积金个人基数" prop="individualBaseOfProvidentFund" width="180" />
    <el-table-column label="公积金个人比例" prop="personalRatioOfProvidentFund" width="180" />
    <el-table-column label="公积金合计" prop="totalProvidentFund" width="180" />
    <el-table-column label="公积金企业" prop="providentFundEnterprises" width="180" />
    <el-table-column label="公积金个人" prop="providentFundIndividual" width="180" />

    <el-table-column label="养老企业基数" prop="pensionEnterpriseBase" width="180" />
    <el-table-column label="养老企业比例" prop="proportionOfPensionEnterprises" width="180" />
    <el-table-column label="养老企业" prop="pensionEnterprise" width="180" />
    <el-table-column label="养老个人基数" prop="personalPensionBase" width="180" />
    <el-table-column label="养老个人比例" prop="personalPensionRatio" width="180" />
    <el-table-column label="养老个人" prop="oldAgeIndividual" width="180" />

    <el-table-column label="失业企业基数" prop="unemploymentEnterpriseBase" width="180" />
    <el-table-column label="失业企业比例" prop="proportionOfUnemployedEnterprises" width="180" />
    <el-table-column label="失业企业" prop="unemployedEnterprise" width="180" />
    <el-table-column label="失业个人基数" prop="theNumberOfUnemployedIndividuals" width="180" />
    <el-table-column label="失业个人比例" prop="percentageOfUnemployedIndividuals" width="180" />
    <el-table-column label="失业个人" prop="unemployedIndividual" width="180" />

    <el-table-column label="医疗企业基数" prop="medicalEnterpriseBase" width="180" />
    <el-table-column label="医疗企业比例" prop="proportionOfMedicalEnterprises" width="180" />
    <el-table-column label="医疗企业" prop="medicalEnterprise" width="180" />
    <el-table-column label="医疗个人基数" prop="medicalPersonalBase" width="180" />
    <el-table-column label="医疗个人比例" prop="medicalPersonalRatio" width="180" />
    <el-table-column label="医疗个人" prop="medicalIndividual" width="180" />

    <el-table-column label="工伤企业基数" prop="baseOfIndustrialInjuryEnterprises" width="180" />
    <el-table-column label="工伤企业比例" prop="proportionOfIndustrialInjuryEnterprises" width="180" />
    <el-table-column label="工伤企业" prop="industrialInjuryEnterprise" width="180" />

    <el-table-column label="生育企业基数" prop="fertilityEnterpriseBase" width="180" />
    <el-table-column label="生育企业比例" prop="proportionOfFertilityEnterprises" width="180" />
    <el-table-column label="生育企业" prop="childbearingEnterprise" width="180" />

    <el-table-column label="大病企业基数" prop="baseOfSeriousIllness" width="180" />
    <el-table-column label="大病企业比例" prop="proportionOfSeriouslyIllEnterprises" width="180" />
    <el-table-column label="大病企业" prop="bigDiseaseEnterprise" width="180" />
    <el-table-column label="大病个人基数" prop="personalBaseOfSeriousIllness" width="180" />
    <el-table-column label="大病个人比例" prop="personalProportionOfSeriousIllness" width="180" />
    <el-table-column label="大病个人" prop="apersonOfGreatDisease" width="180" />

    <el-table-column label="公积金备注" prop="providentFundNotes" width="180" />
    <el-table-column label="社保备注" prop="socialSecurityNotes" width="180" />

  </el-table>
</template>

<script>
export default {
  name: 'ReportTable',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>
