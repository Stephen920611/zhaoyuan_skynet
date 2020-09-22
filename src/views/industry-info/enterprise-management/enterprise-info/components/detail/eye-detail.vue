<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <CommonSubtitle title="基本信息" :isBold="true" style="line-height: 10px"></CommonSubtitle>
                <div class="form-wrap">
                    <el-form label-position="right"  ref="ruleForm"  :rules="rules" :inline="true" label-width="150px" :model="ruleForm">
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
                            <el-select v-model="ruleForm.areaId" placeholder="请选择行政区划" @change="handleChangeArea" disabled>
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

                        <el-form-item label="地址:" prop="officeAddress">
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
            <div class="other-wrap">
                <el-tabs v-model="tabActive" type="border-card">
                    <el-tab-pane name="1" style="padding-right: 20px">
                        <span slot="label"> 运输资质管理</span>
                        <!--<span slot="label"><i class="el-icon-remove"></i> 运输资质管理</span>-->
                        <qualify-info :companyId="companyId" :companyName="companyName" :data="qualifyInfoData"></qualify-info>
                    </el-tab-pane>
                    <el-tab-pane label="车辆信息" name="2" style="padding-right: 20px">
                        <car-info :companyId="companyId" v-if="tabActive == 2"></car-info>
                    </el-tab-pane>
                    <el-tab-pane label="人员信息" name="3" style="padding-right: 20px">
                        <driver-info :companyId="companyId" v-if="tabActive == 3"></driver-info>
                    </el-tab-pane>
                    <el-tab-pane name="4" style="padding-right: 20px">
                        <span slot="label">卡口抓拍设备（{{deviceInfoData.length}}）</span>
                        <!--<span slot="label"><i class="el-icon-success"></i> 卡口抓拍设备（2）</span>-->
                        <device-info :companyId="companyId" :data="deviceInfoData"></device-info>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {getByCode,basicChemicalsList,companySaveOrUpdate,companyQuality,getCompanyDetailCamInfo} from '@/api/industry'
    import {queryAreaList} from '@/api/map'
    import elDragDialog from '@/directive/el-drag-dialog'
    import qualifyInfo from './qualify-info.vue'
    import deviceInfo from './device-info.vue'
    import carInfo from './car-info.vue'
    import driverInfo from './driver-info.vue'

    export default {
        name: 'EyeDetail',
        components: {CommonSubtitle,qualifyInfo,deviceInfo,carInfo,driverInfo},
        directives: {elDragDialog},
        props:['data','companyId','companyName'],
        data() {
            let validateNumber = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入联系人电话'));
                } else{
                    let regPone = null;
                    let mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; //最新16手机正则
                    let tel = /^(0[0-9]{2,3}\-)([2-9][0-9]{4,7})+(\-[0-9]{1,4})?$/; //座机
                    if (value.charAt(0) == 0) {    // charAt查找第一个字符方法，用来判断输入的是座机还是手机号
                        regPone = tel;
                    } else {
                        regPone = mobile;
                    }
                    if (!regPone.test(value) && regPone==tel) {
                        return callback(
                            new Error("格式错误(座机'区号-座机号码')")
                        );
                    }else if (!regPone.test(value) && regPone==mobile) {
                        return callback(
                            new Error("错误输入，请重新输入")
                        );
                    } else{
                        callback();
                    }
                }
            };
            return {
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
                    chemicalId:[],
                    otherInfo:'',
                },
                rules: {
                    companyName: [
                        { required: true, message: '请输入企业名称', trigger: 'blur' }
                    ],
                    companyType: [
                        { required: true, message: '请选择企业类型', trigger: 'change' },
                    ],
                    creditCode: [
                        { required: true, message: '请输入工商注册号', trigger: 'blur' },
                    ],
                    industry: [
                        { required: true, message: '请选择行业类别', trigger: 'change' },
                    ],
                    areaId: [
                        { required: true, message: '请输入行政区划', trigger: 'change' },
                    ],
                    businessStatus: [
                        { required: true, message: '请输入企业状态', trigger: 'change' },
                    ],
                    companyEconomicType: [
                        { required: true, message: '请输入经济类型', trigger: 'change' },
                    ],
                    /* officeAddress: [
                         { required: true, message: '请输入办公地址', trigger: 'blur' },
                     ],
                     produceAddress: [
                         { required: true, message: '请输入生产经营地址', trigger: 'blur' },
                     ],
                     enterpriseLegalPerson: [
                         { required: true, message: '请输入法定代表人', trigger: 'blur' },
                     ],
                     enterpriseLegalPersonTelephone: [
                         { required: true, validator:validateNumber, trigger: 'blur' },
                     ],*/
                    header: [
                        { required: true, message: '请输入主要责任人', trigger: 'blur' },
                    ],
                    headerPhone: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],
                    /*safetySupervisorName: [
                        { required: true, message: '请输入安全主管姓名', trigger: 'blur' },
                    ],
                    safetySupervisorTelephone: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],
                    faxNumber: [
                        { required: true, message: '请输入工作传真号码', trigger: 'change' },
                    ],*/
                    certificationDate: [
                        { required: true, message: '请选择注册发证日期', trigger: 'change' },
                    ],
                    chemicalId: [
                        { required: true, message: '请选择危险货物品名', trigger: 'change' },
                    ],
                },
                typeOptions:[],
                options:[],
                regions: [],  //行政区域,
                tabActive:'1',  //tab页的激活状态
                companyEconomicTypes:[],  //经济类型
                businessStatus:[],  //企业状态
                companyTypes:[],  //企业类型
                industrys:[],  //行业类型
                chemicals:[],  //危化品
//                companyId:null,  //保存企业基本信息时，产生的companyId
//                companyName:null,  //保存企业基本信息时，产生的companyName
                qualifyInfoData:[],  //运输资质列表数据
                deviceInfoData:[],  //设备摄像机列表数据
            };
        },
        created() {
            //传入的数据进行赋值
            this.updateData(this.data);
            this.getAllRegions();
            //获取字典表对应的字段
            this.dictionary();
            //获取危化品列表
            this.getChemicalList();
            //根据企业id，获取运输资质信息
            this.getQualifyInfo(this.companyId);
            //根据企业id，获取摄像机设备信息
            this.getDetailInfo(this.companyId);

        },
        watch:{
            'data':{
                handler(value){
                    this.updateData(value);
                }
            },
            'companyId':{
                handler(id){
                    //根据企业id，获取运输资质信息
                    this.getQualifyInfo(id);
                    //根据企业id，获取摄像机设备信息
                    this.getDetailInfo(id);
                }
            }
        },
        methods: {
            updateData(value){
                if(value && JSON.stringify(value) != "{}"){
                    const keys = Object.keys(this.ruleForm);
                    for(let key of keys){
                        if(value[key] == null){
                            value[key] = '';
                        }
                        this.ruleForm[key] = value[key];
                    }

                    this.ruleForm.industry =  this.ruleForm.industry + '';
                    this.ruleForm.businessStatus =  this.ruleForm.businessStatus + '';
                    this.ruleForm.companyEconomicType =  this.ruleForm.companyEconomicType + '';
                    this.ruleForm.chemicalId = [];
                    this.ruleForm.companyType = [];
                    value.companyChemicalList.map(item=>{
                        this.ruleForm.chemicalId.push(item.chemicalId + '')
                    });
                    value.companyTypeList.map(item=>{
                        this.ruleForm.companyType.push(item.companyType + '')
                    });
                }
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //获取烟台市的行政区域
            getAllRegions() {
                queryAreaList({parent:'370600'}).then(res=>{
                    this.regions = res.data;
                })
            },
            handleChangeArea(){
                this.regions.map(item=>{
                    if(this.ruleForm.areaId == item.id){
                        this.ruleForm.areaName = item.des;
                    }
                })
            },
            /*handleChangeCompanyType(){
              let companyNames = [];
              for(let i in this.ruleForm.companyType){
                  this.companyTypes.map(item=>{
                      if(item.value == this.ruleForm.companyType[i]){
                          companyNames.push(item.name);
                      }
                  })
              }
              this.ruleForm.companyTypeName = companyNames.join(',');
            },*/
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
            getQualifyInfo(id){
                this.qualifyInfoData=[];
                companyQuality({companyId:id}).then(res=>{
                    if(res.code == '1000'){
                        this.qualifyInfoData = res.data.list;
                    }
                });
            },

            //编辑：获取设备的详细信息
            getDetailInfo(id){
                this.deviceInfoData=[];
                getCompanyDetailCamInfo({companyId:id}).then(res=>{
                    if(res.code == '1000'){
                        this.deviceInfoData = res.data.list;
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>

    .form-wrap{
        padding: 10px;
    }

    /deep/ .el-select,.el-date-editor {
        display: inline-block;
        position: relative;
        width: 185px;
    }
    .text-area{
        width: 100%;
        /deep/ .el-form-item__content{
            width: calc(100% - 150px);
        }
        /deep/ .el-textarea,.el-select{
            width: 93.33%;
        }
    }

    .other-form-item{
        .label-item{
            width: 150px;
            padding-right: 12px;
            display: inline-block;
        }
        .inp-item{
            width: 185px;
            float: right;
            display: inline-block;
        }
    }
</style>
