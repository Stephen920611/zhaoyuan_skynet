<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar >
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <div class="form-wrap">
                    <el-form label-position="right" ref="ruleForm" :inline="true" label-width="130px" :model="ruleForm">
                        <el-form-item label="企业名称:" prop="companyName">
                            <el-input v-model="ruleForm.companyName" disabled></el-input>
                        </el-form-item>
                        <el-form-item prop="creditCode" class="other-form-item">
                            <span slot="label">
                                <el-row style="float: right;line-height: 22px">
                                    <label>工商注册号：</label>
                                </el-row>
                                <el-row style="float: right;line-height: 12px">
                                    <label>(统一社会信用码)</label>
                                </el-row>
                            </span>
                            <el-input v-model="ruleForm.creditCode" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="行政区划:" prop="areaId">
                            <el-select v-model="ruleForm.areaId" placeholder="请选择行政区划"
                                       disabled>
                                <el-option
                                        v-for="item in regions"
                                        :label="item.des"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="行业类别:" prop="industry">
                            <el-select v-model="ruleForm.industry" placeholder="请选择行业类别" disabled>
                                <el-option
                                        v-for="item in industrys"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="企业类型:" prop="companyType">
                            <el-select multiple v-model="ruleForm.companyType" placeholder="请选择企业类型" disabled>
                                <el-option
                                        v-for="item in companyTypes"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="企业状态:" prop="businessStatus">
                            <el-select v-model="ruleForm.businessStatus" placeholder="请选择企业状态" disabled>
                                <el-option
                                        v-for="item in businessStatus"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="经济类型:" prop="companyEconomicType">
                            <el-select v-model="ruleForm.companyEconomicType" placeholder="请选择经济类型" disabled>
                                <el-option
                                        v-for="item in companyEconomicTypes"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="企业电话:" prop="companyPhone">
                            <el-input v-model="ruleForm.companyPhone" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="责任人姓名:" prop="header">
                            <el-input v-model="ruleForm.header" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="主要责任人电话:" prop="headerPhone">
                            <el-input v-model="ruleForm.headerPhone" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="安全主管:" prop="safetySupervisorName">
                            <el-input v-model="ruleForm.safetySupervisorName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="安全主管电话:" prop="safetySupervisorTelephone">
                            <el-input v-model="ruleForm.safetySupervisorTelephone" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="办公地址:" prop="officeAddress">
                            <el-input v-model="ruleForm.officeAddress" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="生产经营地址:" prop="produceAddress">
                            <el-input v-model="ruleForm.produceAddress" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="传真号码:" prop="faxNumber">
                            <el-input v-model="ruleForm.faxNumber" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="注册发证日期:" prop="certificationDate">
                            <el-date-picker
                                    :disabled="true"
                                    v-model="ruleForm.certificationDate"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="危险货物品名:" prop="chemicalId" class="text-area">
                            <el-select multiple v-model="ruleForm.chemicalId" placeholder="请选择危险货物品名" disabled>
                                <el-option
                                        v-for="item in chemicals"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注:" prop="otherInfo" class="text-area">
                            <el-input
                                    disabled
                                    type="textarea"
                                    v-model="ruleForm.otherInfo"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                            >
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {fetchBasicCompany} from '@/api/industryInfo/vehicleInfo'
    import {
        getByCode,
        basicChemicalsList,
        companySaveOrUpdate,
        companyQuality,
        getCompanyDetailCamInfo
    } from '@/api/industry'
    import {queryAreaList} from '@/api/map'
    import {mapGetters} from 'vuex'

    export default {
        name: "belong-company",
        props: ['companyData'],
        data() {
            return {
                ruleForm: {
                    companyName: '',
                    creditCode: '',
                    areaId: '',
                    areaName: '',
                    industry: '',
                    companyType: [],
                    businessStatus: '',
                    companyEconomicType: '',
                    companyPhone: '',
                    header: '',
                    headerPhone: '',
                    safetySupervisorName: '',
                    safetySupervisorTelephone: '',
                    officeAddress: '',
                    produceAddress: '',
                    faxNumber: '',
                    certificationDate: '',
                    chemicalId: [],
                    otherInfo: '',
                },
                isDisabled: true,
                companyEconomicTypes: [],  //经济类型
                businessStatus: [],  //企业状态
                companyTypes: [],  //企业类型
                industrys: [],  //行业类型
                chemicals: [],  //危化品
                regions:[],//区域
            }
        },
        computed: {
            ...mapGetters([
                'companyDetail',
                'carDetail',
            ])
        },
        watch: {
            companyData: {
                deep: true, //深度监听设置为 true
                handler: function (newV, oldV) {
                    this.initData();
                },
            },
        },
        mounted() {
            this.getAllRegions();
            //获取字典表对应的字段
            this.dictionary();
            //获取危化品列表
            this.getChemicalList();
            this.initData();
        },
        methods: {
            initData(){
                if (this.companyData && JSON.stringify(this.companyData) != "{}") {
                    const keys = Object.keys(this.ruleForm);
                    for (let key of keys) {
                        if(this.companyData[key] == null){
                            this.companyData[key] = '';
                        }
                        this.ruleForm[key] = this.companyData[key];
                    }
                    //行业类别
                    this.ruleForm.industry = this.companyData.industry + '';
                    //企业状态
                    this.ruleForm.businessStatus = this.companyData.businessStatus + '';
                    //经济类型
                    this.ruleForm.companyEconomicType = this.companyData.companyEconomicType + '';

                    //危险货物名称
                    this.ruleForm.chemicalId = [];
                    this.companyData.companyChemicalList.map((item) => {
                        this.ruleForm.chemicalId.push(item.chemicalId);
                    });
//                    console.log('this.ruleForm.chemicalId',this.ruleForm.chemicalId);

                    //企业类型
                    this.ruleForm.companyType = [];
                    this.companyData.companyTypeList.map(item => {
                        this.ruleForm.companyType.push(item.companyType + '')
                    });
                }
            },
            //获取字典表对应的字段
            dictionary() {
                //经济类型
                getByCode({code: 'COMPANY_ECONOMIC_TYPE', enable: 1}).then(res => {
                    this.companyEconomicTypes = [];
                    res.data.list.map(item => {
                        this.companyEconomicTypes.push(item);
                    })
                });
                //企业状态
                getByCode({code: 'COMPANY_BUSINESS_STATUS', enable: 1}).then(res => {
                    this.businessStatus = [];
                    res.data.list.map(item => {
                        this.businessStatus.push(item);
                    })
                });
                //企业类型
                getByCode({code: 'COMPANY_TYPE', enable: 1}).then(res => {
                    this.companyTypes = [];
                    res.data.list.map(item => {
                        this.companyTypes.push(item);
                    })
                });
                //行业类型
                getByCode({code: 'INDUSTRY', enable: 1}).then(res => {
                    this.industrys = [];
                    res.data.list.map(item => {
                        this.industrys.push(item);
                    })
                })
            },
            //获取危化品列表项
            getChemicalList() {
                basicChemicalsList({}).then(res => {
                    res.data.map(item => {
                        this.chemicals.push({
                            name: item.name,
                            value: item.id
                        })
                    })
                })
            },
            //获取烟台市的行政区域
            getAllRegions() {
                queryAreaList({parent:'370600'}).then(res => {
                    this.regions = res.data;
                })
            },

        }

    }
</script>

<style lang="scss" scoped type="text/scss">
    /deep/ .el-form-item {
        width: calc(25% - 20px) !important;
        /deep/ .el-form-item__content {
            width: calc(100% - 130px) !important;
        }
    }

    .other-form-item {
        /deep/ .el-form-item__content {
            /*width: 100% !important;*/
        }

        .label-item {
            width: 130px;
            padding-right: 12px;
            display: inline-block;
        }

        .inp-item {
            width: calc(100% - 130px);
            float: right;
            display: inline-block;
        }
    }

    .text-area {
        width: 100% !important;
        /deep/ .el-form-item__content {
            width: calc(100% - 130px);
        }
        /deep/ .el-textarea, .el-select {
            width: 96%;
        }
    }

    .form-wrap {
        padding: 10px;
    }

    /deep/ .el-select, .el-date-editor {
        display: inline-block;
        position: relative;
        width: 100%;
    }
</style>
