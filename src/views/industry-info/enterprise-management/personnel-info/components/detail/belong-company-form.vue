<template>
    <div>
        <div class="form-container padding-t-20">
            <el-form label-position="right"  ref="ruleForm"  :inline="true" label-width="130px" :model="ruleForm">
                <el-form-item label="企业名称:" prop="companyName">
                    <el-input v-model="ruleForm.companyName" disabled></el-input>
                </el-form-item>
                <el-form-item  prop="creditCode" class="other-form-item">
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
                    <el-select v-model="ruleForm.areaId" disabled>
                        <el-option
                            v-for="item in regions"
                            :label="item.des"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="行业类别:" prop="industry">
                    <el-select v-model="ruleForm.industry" disabled>
                        <el-option
                            v-for="item in industrys"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="企业类型:" prop="companyType">
                    <el-select multiple v-model="ruleForm.companyType"  disabled>
                        <el-option
                            v-for="item in companyTypes"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="企业状态:" prop="businessStatus">
                    <el-select v-model="ruleForm.businessStatus"  disabled>
                        <el-option
                            v-for="item in businessStatus"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="经济类型:" prop="companyEconomicType">
                    <el-select v-model="ruleForm.companyEconomicType" disabled>
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
                    <el-select multiple v-model="ruleForm.chemicalId" disabled>
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
</template>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import UploadImage from '../upload-image.vue';
    import passParam from '@/utils/ext.passParam'
    import {queryAreaList} from '@/api/map'
    import {getByCode,basicChemicalsList} from '@/api/industry'
    export default {
        name: "qualifyInfoForm",
        props:['data'],
        components: { ElImageViewer,UploadImage },
        data(){
            return{
                ruleForm: {
                    companyName: '',
                    creditCode:'',
                    areaId:'',
                    areaName:'',
                    industry:'',
                    companyType: [],
                    businessStatus: '',
                    companyEconomicType: '',
                    companyPhone:'',
                    header:'',
                    headerPhone:'',
                    safetySupervisorName:'',
                    safetySupervisorTelephone:'',
                    officeAddress:'',
                    produceAddress:'',
                    faxNumber:'',
                    certificationDate:'',
                    chemicalId:null,
                    otherInfo:'',
                },
                isDisabled:true,
                regions: [],  //行政区域,
                industrys:[],  //行业类型
                companyEconomicTypes:[],  //经济类型
                businessStatus:[],  //企业状态
                companyTypes:[],  //企业类型
                chemicals:[],  //危化品
            }
        },
        watch:{
            'data':{
                handler(value){
                   this.updateData(value)
                }
            }
        },
        created() {
            this.updateData(this.data);
            this.getAllRegions();
            //获取字典表对应的字段
            this.dictionary();
            //获取危化品列表
            this.getChemicalList()
        },
        methods: {
            //获取危化品列表项
            getChemicalList(){
                basicChemicalsList({}).then(res=>{
                    res.data.map(item=>{
                        this.chemicals.push({
                            name:item.name,
                            value:item.id+''
                        })
                    })
                })
            },
            updateData(value){
                if(value && JSON.stringify(value) != "{}"){
                    const keys = Object.keys(this.ruleForm);
                    for(let key of keys){
                        this.ruleForm[key] = value[key];
                    }
                    this.ruleForm.industry =  this.ruleForm.industry+'';
                    this.ruleForm.businessStatus =  this.ruleForm.businessStatus+'';
                    if(this.ruleForm.companyEconomicType===null){
                        this.ruleForm.companyEconomicType="";
                    }
                    this.ruleForm.companyEconomicType =  this.ruleForm.companyEconomicType+'';
                    this.ruleForm.chemicalId = [];
                    this.ruleForm.companyType = [];
                    console.log(value.companyChemicalList,"value.companyChemicalList");
                    value.companyChemicalList.map(item=>{
                        this.ruleForm.chemicalId.push(item.chemicalId+'')
                    });
                    value.companyTypeList.map(item=>{
                        this.ruleForm.companyType.push(item.companyType+'')
                    });
                }

            },
            //获取字典表对应的字段
            dictionary(){
                //经济类型
                getByCode({code: 'COMPANY_ECONOMIC_TYPE', enable: 1}).then(res=>{
                    this.companyEconomicTypes = [];
                    res.data.list.map(item=>{
                        this.companyEconomicTypes.push(item);
                    })
                });
                //企业状态
                getByCode({code: 'COMPANY_BUSINESS_STATUS', enable: 1}).then(res=>{
                    this.businessStatus = [];
                    res.data.list.map(item=>{
                        this.businessStatus.push(item);
                    })
                });
                //企业类型
                getByCode({code: 'COMPANY_TYPE', enable: 1}).then(res=>{
                    this.companyTypes = [];
                    res.data.list.map(item=>{
                        this.companyTypes.push(item);
                    })
                });
                //行业类型
                getByCode({code: 'INDUSTRY', enable: 1}).then(res=>{
                    this.industrys = [];
                    res.data.list.map(item=>{
                        this.industrys.push(item);
                    })
                })
            },
            //获取烟台市的行政区域
            getAllRegions() {
                queryAreaList({parent:'370600'}).then(res=>{
                    this.regions = res.data;
                })
            },
            onPreview() {
                this.showViewer = true
            },
            // 关闭查看器
            closeViewer() {
                this.showViewer = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container{
        padding: 10px;
        position: relative;
        .qualify-item{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .tag-wrap{
            position: absolute;
            top:0;
            right: 0;
        }
        /deep/ .el-select,.el-date-editor {
            display: inline-block;
            position: relative;
            width: 185px;
        }
        /deep/ .el-textarea{
            width: 97%;
        }
        .file-item{
            display: inline-block;
            float: left;
            margin-right: 15px;
        }
        /*上传附件的样式*/
        .upload-item{
            width: 98%;
        }
    }
    /deep/ .el-textarea,.el-select,.el-date-editor{
        width: 100% !important;
    }
    /deep/ .el-form-item--medium .el-form-item__content {
        width: calc(100% - 130px)!important;
    }
    .other-form-item{
        /deep/ .el-form-item__content {
            width: calc(100% - 130px)!important;
        }
    }
    .text-area{
        width: 100%!important;
        /deep/ .el-form-item__content{
            width: calc(100% - 175px)!important;
        }
        /deep/ .el-textarea,.el-select{
            width: 100% !important;
        }
    }
</style>
