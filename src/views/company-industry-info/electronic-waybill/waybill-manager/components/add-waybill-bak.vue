<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">

                <el-form label-position="right" :rules="rules" ref="ruleForm" :inline="true" label-width="125px" :model="ruleForm">
                    <!-------------------------运单发起----------------------------------->
                    <CommonSubtitle title="基本信息" :isBold="true"></CommonSubtitle>
                    <el-form-item label="托运方单位名称:" prop="consignorCompanyName" style="margin-right: 20px">
                        <el-select v-model="ruleForm.consignorCompanyName" filterable placeholder="请选择" @change="changeConsignorCompany">
                            <el-option
                                v-for="item in options"
                                :label="item.companyName"
                                :value="item.companyName">
                            </el-option>
                        </el-select>
                       <!-- <el-input v-model="ruleForm.consignorCompanyName"></el-input>-->
                    </el-form-item>
                    <el-form-item label="装货方单位名称:" prop="loadCompanyName" style="margin-right: 20px">
                        <el-select v-model="ruleForm.loadCompanyName" filterable placeholder="请选择" @change="changeLoadCompany">
                            <el-option
                                    v-for="item in options"
                                    :label="item.companyName"
                                    :value="item.companyName">
                            </el-option>
                        </el-select>
                        <!-- <el-input v-model="ruleForm.loadCompanyName"></el-input>-->
                    </el-form-item>
                    <el-form-item label="收货方单位名称:" prop="receiverCompanyName" style="margin-right: 20px">
                        <el-select v-model="ruleForm.receiverCompanyName" filterable placeholder="请选择" @change="changeReceiverCompany">
                            <el-option
                                v-for="item in options"
                                :label="item.companyName"
                                :value="item.companyName">
                            </el-option>
                        </el-select>
                       <!-- <el-input v-model="ruleForm.receiverCompanyName"></el-input>-->
                    </el-form-item>
                    <el-form-item label="危险货物名称:" prop="cargoId" style="margin-right: 20px">
                        <!--<el-input v-model="ruleForm.cargoName"></el-input>-->
                        <el-select v-model="ruleForm.cargoId" filterable placeholder="请选择" @change="changeCargos">
                            <el-option
                                    v-for="item in cargos"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="托运方联系电话:" prop="consignorTelephone" style="margin-right: 20px">
                        <el-input v-model="ruleForm.consignorTelephone"></el-input>
                    </el-form-item>
                    <el-form-item label="装货方联系电话:" prop="loadTelephone" style="margin-right: 20px">
                        <el-input v-model="ruleForm.loadTelephone"></el-input>
                    </el-form-item>
                    <el-form-item label="收货方联系电话:" prop="receiverTelephone" style="margin-right: 20px">
                        <el-input v-model="ruleForm.receiverTelephone"></el-input>
                    </el-form-item>
                    <el-form-item label="数量(吨/立方):" prop="cargoNum" style="margin-right: 20px">
                        <!--<el-input v-model="ruleForm.cargoNum" @input="handleInput"></el-input>-->
                        <el-input v-model="ruleForm.cargoNum" type="number" ></el-input>
                    </el-form-item>

                    <!-------------------------运输信息----------------------------------->
                    <CommonSubtitle title="运输信息" :isBold="true"></CommonSubtitle>
                    <el-form-item label="承运方单位名称:" prop="carrierCompanyName" style="margin-right: 20px">
                        <!--<el-select v-model="ruleForm.carrierCompanyName" filterable placeholder="请选择" @change="changeCarrierCompany">
                            <el-option
                                v-for="item in options"
                                :label="item.companyName"
                                :value="item.companyName">
                            </el-option>
                        </el-select>-->
                        <el-input v-model="ruleForm.carrierCompanyName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="经营许可证号:" prop="carrierCompanyLicenseNo" style="margin-right: 20px">
                        <el-input v-model="ruleForm.carrierCompanyLicenseNo" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话:" prop="carrierCompanyTelephone" style="margin-right: 20px">
                        <el-input v-model="ruleForm.carrierCompanyTelephone" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="应急联系方式:" prop="emergencyTelephone" style="margin-right: 20px">
                        <el-input v-model="ruleForm.emergencyTelephone"></el-input>
                    </el-form-item>
                    <el-form-item label="拖车车牌号码:" prop="carNo" style="margin-right: 20px">
                        <el-select v-model="ruleForm.carId" filterable placeholder="请选择拖车车牌" @change="handleSelectCar">
                            <el-option
                                    v-for="item in carNoArray"
                                    :key="item.id"
                                    :label="item.value"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <!--<el-input v-model="ruleForm.carNo"></el-input>-->
                    </el-form-item>
                    <el-form-item label="道路运输证号:" prop="carTransportLicenseNo" style="margin-right: 20px">
                        <el-input v-model="ruleForm.carTransportLicenseNo" disabled></el-input>
                    </el-form-item>
                    <template v-if="ifHasTrailer==true">
                        <el-form-item label="挂车车牌号码:" prop="trailerNo" style="margin-right: 20px">
                            <!--<el-input v-model="ruleForm.trailerNo"></el-input>-->
                            <el-select v-model="ruleForm.trailerId" filterable placeholder="请选择挂车车牌" @change="handleTrailerCar">
                                <el-option
                                        v-for="item in trailerNoArray"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="道路运输证号:" prop="trailerTransportLicenseNo" style="margin-right: 20px">
                            <el-input v-model="ruleForm.trailerTransportLicenseNo" disabled></el-input>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <el-form-item label="挂车车牌号码:"  style="margin-right: 20px">
                            <!--<el-input v-model="ruleForm.trailerNo"></el-input>-->
                            <el-select v-model="ruleForm.trailerId" filterable placeholder="请选择挂车车牌" @change="handleTrailerCar" disabled>
                                <el-option
                                        v-for="item in trailerNoArray"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="道路运输证号:" style="margin-right: 20px">
                            <el-input v-model="ruleForm.trailerTransportLicenseNo" disabled></el-input>
                        </el-form-item>
                    </template>

                   <el-form-item label="装货日期:" prop="loadDate" style="margin-right: 20px">
                       <el-date-picker
                           v-model="ruleForm.loadDate"
                           type="date"
                           placeholder="选择日期"
                           value-format="yyyy-MM-dd"
                           :picker-options="timeForm.pickerTimeBeg"
                       >
                       </el-date-picker>
                   </el-form-item>
                   <el-form-item label="预计到达日期:" prop="expectedArrivalDate" style="margin-right: 20px">
                       <el-date-picker
                           v-model="ruleForm.expectedArrivalDate"
                           type="date"
                           placeholder="选择日期"
                           value-format="yyyy-MM-dd"
                           :picker-options="timeForm.pickerTimeEnd"
                       >
                       </el-date-picker>
                   </el-form-item>

                    <!-------------------------人员信息----------------------------------->
                    <CommonSubtitle title="人员信息" :isBold="true"></CommonSubtitle>
                    <template v-for="(item, index) in driver">
                        <create-driver
                            ref="driver"
                            :driverArray="driverArray"
                            :driverData="item"
                            :indexNum="index"
                            @delDriver="delDriver"
                            @addDriver="addDriver">
                        </create-driver>
                    </template>

                    <el-form-item label="押运员姓名:" prop="escortName" style="margin-right: 20px">
                        <!--<el-input v-model="ruleForm.escortName"></el-input>-->
                        <el-select v-model="ruleForm.escortId" filterable placeholder="请选择押运员" @change="handleEscort">
                            <el-option
                                    v-for="item in escortArray"
                                    :key="item.id"
                                    :label="item.value"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="押运员身份证号:" prop="escoridCardNo" style="margin-right: 20px">
                        <el-input v-model="ruleForm.escoridCardNo" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="押运证:" prop="escorLicenseNo" style="margin-right: 20px">
                        <el-input v-model="ruleForm.escorLicenseNo" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="押运员联系电话:" prop="escorTelephone" style="margin-right: 20px">
                        <el-input v-model="ruleForm.escorTelephone" disabled></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button  @click="resetForm('ruleForm')">重 置</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">添 加</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {saveOrUpdate,getBasicCompanyList,getFreeCar,getCar,getWorker,getFreeWorker,getCargos} from '@/api/industry'
    import dateTime from '@/utils/ext.dateTime'
    import CreateDriver from "./createDriver";
    export default {
        components: {CreateDriver, CommonSubtitle},
        name: 'add-waybill',
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
            let validateTime = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请选择预计到达日期'));
                } else if(value<this.ruleForm.loadDate){
                    callback(new Error('抵达时期必须大于装货日期'));
                }else{
                    callback();
                }
            };
            return {
                ruleForm: {
                    /*基本信息*/
                    consignorCompanyName: '',
                    receiverCompanyName: '',
                    loadCompanyName: '',
                    consignorTelephone: '',
                    receiverTelephone: '',
                    loadTelephone: '',
                    cargoId: null,   //危险货物id
                    cargoName: '',  //危险货物名称
                    cargoNum: '',  //货物数量

                    /*运输信息*/
                    carrierCompanyName: '',
                    carrierCompanyLicenseNo: '',
                    carrierCompanyTelephone: '',
                    emergencyTelephone: '',
                    carrierCompanyId:null,
                    consignorCompanyId:null,
                    loadCompanyId:null,
                    receiverCompanyId:null,
                    carId:null, //拖车id
                    carNo: '',
                    carTransportLicenseNo: '',
                    trailerId:null,   //挂车id
                    trailerNo: '',
                    trailerTransportLicenseNo: '',
//                    driverId:null, //驾驶员id
                    escortId:null, //押运员id
                    escortName: '',  //押运员
                    escoridCardNo: '',
                    escorLicenseNo: '',
                    escorTelephone: '',
                    loadDate: '', //装货日期
                    expectedArrivalDate: '',  //预计到达日期
                },
                driver: [{
                    driverName: '',//驾驶员
                    driveridCardNo: '',
                    driverLicenseNo: '',
                    driverTelephone: ''
                }],
                timeForm: {
                    pickerTimeBeg: { //限制装货日期
                        disabledDate: (time) => {
                            if (this.ruleForm.expectedArrivalDate != '' && this.ruleForm.expectedArrivalDate) {
                                let timeStr = new Date(this.ruleForm.expectedArrivalDate.replace(/-/g, '/'));
                                return time.getTime() > timeStr || time.getTime() < Date.now() - 8.64e7;
                            } else {
                                return time.getTime() < Date.now() - 8.64e7;
                            }
                        }
                    },
                    pickerTimeEnd: { //限制结束时间
                        disabledDate: (time) => {
                            if (this.ruleForm.loadDate != '' && this.ruleForm.loadDate) {
                                let timeStr = new Date(this.ruleForm.loadDate.replace(/-/g, '/'));
                                return time.getTime() < timeStr;
                            } else {
                                return time.getTime() < Date.now() - 8.64e7;
                            }
                        }
                    }
                },
                cargos:[],  //危险货物名称
                carNoArray:[],  //承运企业下的所属拖车车辆
                trailerNoArray:[],  //承运企业下的所属挂车车辆
                escortArray:[],  //承运企业下的所属押运员
                driverArray:[],  //承运企业下的所属驾驶员
                ifHasTrailer: true,  //是否有挂车车牌

                rules: {
                    consignorCompanyName: [
                        { required: true, message: '请输入托运方单位名称', trigger: 'change' }
                    ],
                    receiverCompanyName: [
                        { required: true, message: '请输入收货方单位名称', trigger: 'change' },
                    ],
                    consignorTelephone: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],
                    receiverTelephone: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],
                    loadTelephone: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],
                    loadCompanyName: [
                        { required: true, message: '请输入装货方单位名称', trigger: 'change' },
                    ],
                    transportDestination: [
                        { required: true, message: '请输入运输目的地', trigger: 'change' },
                    ],
                    loadDate: [
                        { required: true, message: '请选择装货日期', trigger: 'change' },
                    ],
                    expectedArrivalDate: [
                        { required: true, validator:validateTime, trigger: 'blur' },
                    ],
                    carrierCompanyName: [
                        { required: true, message: '请输入承运方单位名称', trigger: 'change' },
                    ],
                    carrierCompanyLicenseNo: [
                        { required: true, message: '请输入经营许可证号', trigger: 'change' },
                    ],
                    carrierCompanyTelephone: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],
                    emergencyTelephone: [
                        { required: true, validator:validateNumber, trigger: 'blur' },
                    ],
                    carNo: [
                        { required: true, message: '请输入车牌号码', trigger: 'change' },
                    ],
                    carTransportLicenseNo: [
                        { required: true, message: '请输入道路运输证号', trigger: 'blur' },
                    ],
                    trailerNo: [
                        { required: true, message: '请输入挂车车牌号码', trigger: 'change' },
                    ],
                    trailerTransportLicenseNo: [
                        { required: true, message: '请输入道路运输证号', trigger: 'blur' },
                    ],
                    escortName: [
                        { required: true, message: '请输入押运员姓名', trigger: 'change' },
                    ],
                    escoridCardNo: [
                        { required: true, message: '请输入身份证号', trigger: 'blur' },
                    ],
                    escorLicenseNo: [
                        { required: true, message: '请输入押运证', trigger: 'blur' },
                    ],
                    escorTelephone: [
                        { required: true, validator:validateNumber, trigger:'blur' },
                    ],

                    loadToPortDate: [
                        { required: true, message: '请选择进厂时间', trigger: 'blur'},
                    ],
                    loadToPortWeight: [
                        { required: true, message: '请输入进厂称重', trigger: 'blur'},
                    ],
                    cargoUniCode: [
                        { required: true, message: '请输入联合国编码', trigger: 'blur'},
                    ],
                    cargoId: [
                        { required: true, message: '请输入危险货物名称', trigger: 'blur'},
                    ],
                    cargoType: [
                        { required: true, message: '请输入类/项别', trigger: 'blur'},
                    ],
                    cargoPackingType: [
                        { required: true, message: '请输入包装类别', trigger: 'blur'},
                    ],
                    cargoSpecs: [
                        { required: true, message: '请输入规格', trigger: 'blur'},
                    ],
                    cargoNum: [
                        { required: true, message: '请输入数量(吨/立方)', trigger: 'blur'},
                    ],
                    dangerFeatures: [
                        { required: false, message: '请输入危险货物特征', trigger: 'blur'},
                    ],
                    aidMeasures: [
                        { required: true, message: '请输入急救措施', trigger: 'blur'},
                    ],
                    fireFightingMeasures: [
                        { required: false, message: '请输入消防措施', trigger: 'blur'},
                    ],
                    leakageMeasures: [
                        { required: false, message: '请输入泄露应急措施', trigger: 'blur'},
                    ],
                    pollutionMeasures: [
                        { required: false, message: '请输入次生环境污染措施', trigger: 'blur'},
                    ],
                    transportPrecautions: [
                        { required: false, message: '请输入运输注意事项', trigger: 'blur'},
                    ],
                    loadDepartPortDate: [
                        { required: true, message: '请选择出产时间', trigger: 'blur'},
                    ],
                    loadDepartPortWeight: [
                        { required: true, message: '请输入出厂称重', trigger: 'blur'},
                    ],
                },
                options:[],
                userInfo:null,  //登录用户的信息
                driverData:null,//单个驾驶员信息
            };
        },
        created(){
            //获取用户信息
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            this.fillInFormByUser();
            this.getCompanyData();
        },
        methods: {
            //限制数量为数字
            handleInput(e){
                this.ruleForm.cargoNum=e.replace(/[^\d]/g,'');
            },
            //点击删除驾驶员信息
            delDriver(index) {
                this.driver.splice(index, 1);
            },
            //点击添加驾驶员信息
            addDriver(){
                this.driver.push({
                    driverId: null,
                    driverName: '',
                    driveridCardNo: '',
                    driverLicenseNo: '',
                    driverTelephone: ''
                });
            },
            //根据登录用户，查询单位信息，填充表单
            fillInFormByUser(){
                getBasicCompanyList({companyId:this.userInfo.companyId}).then(res=>{
                    if(res.data.list[0]){
                        this.ruleForm.carrierCompanyId = res.data.list[0].id;
                        this.ruleForm.carrierCompanyName = res.data.list[0].companyName;
                        this.ruleForm.carrierCompanyLicenseNo = res.data.list[0].licenceCode;
                        this.ruleForm.carrierCompanyTelephone = res.data.list[0].headerPhone;
                        //获取危险品货物列表
                        getCargos({companyId:res.data.list[0].id}).then(res=>{
                            this.cargos = [];
                            res.data.map(item=>{
                                this.cargos.push({name:item.name,id:item.id})
                            });
                        })
                    }
                });
                //获取承运企业下的所属拖车车辆
                getFreeCar({companyId:this.userInfo.companyId,carType:'1,2'}).then(res=>{
                    this.carNoArray = [];
                    res.data.map(item=>{
                        this.carNoArray.push({value:item.carNum,id:item.id});
                    })
                });
                //获取承运企业下的所属挂车车辆
                getFreeCar({companyId:this.userInfo.companyId,carType:'3'}).then(res=>{
                    this.trailerNoArray = [];
                    res.data.map(item=>{
                        this.trailerNoArray.push({value:item.carNum,id:item.id});
                    })
                });
                //获取押运员列表
                getFreeWorker({companyId:this.userInfo.companyId,type:'2'}).then(res=>{
                    this.escortArray = [];
                    res.data.list.map(item=>{
                        this.escortArray.push({value:item.name,id:item.id,personNum:item.personNum});
                    })
                });
                //获取驾驶员列表
                getFreeWorker({companyId: this.userInfo.companyId, type: '1'}).then(res => {
                    this.driverArray = [];
                    res.data.list.map(item => {
                        this.driverArray.push({name: item.name, id: item.id, personNum: item.personNum});
                    })
                });
            },

            //根据选择的拖车车辆号码，获取拖车的车辆信息
            handleSelectCar(id){
                this.ruleForm.carTransportLicenseNo = '';
                const selectCar = this.carNoArray.filter(t=>t.id==id);
                this.ruleForm.carNo = selectCar[0].value;
                getCar({carId:id}).then(res=>{
                    if(res.data.list.length>0){
                        this.ruleForm.carTransportLicenseNo = res.data.list[0].licenceCode;
                        //若是选择罐车，则挂车车牌号不用填写，若是选择甩挂车，则需要填写挂车车牌
                        this.ifHasTrailer = (res.data.list[0].carType == 1)?false:true;
                    }
                })
            },
            //根据选择的拖车车辆号码，获取挂车的车辆信息
            handleTrailerCar(id){
                this.ruleForm.trailerTransportLicenseNo = '';
                const selectTrailer = this.trailerNoArray.filter(t=>t.id==id);
                this.ruleForm.trailerNo = selectTrailer[0].value;
                getCar({carId:id}).then(res=>{
                    if(res.data.list.length>0){
                        this.ruleForm.trailerTransportLicenseNo = res.data.list[0].licenceCode
                    }
                })
            },
            //根据选择的押运员名称，获取信息
            handleEscort(id){
                const selectEscort = this.escortArray.filter(t=>t.id==id);
                this.ruleForm.escortName = selectEscort[0].value;
                getWorker({workerId:id}).then(res=>{
                    if(res.data.list.length>0){
                        this.ruleForm.escoridCardNo = res.data.list[0].personNum;  //身份证号
                        this.ruleForm.escorTelephone = res.data.list[0].phoneNum;  //联系电话
                        this.ruleForm.escorLicenseNo = res.data.list[0].workerQualificatLicenseDTO[0]?res.data.list[0].workerQualificatLicenseDTO[0].licenceCode:'';  //押运证
                        if(!res.data.list[0].workerQualificatLicenseDTO[0]){
                            //证件已过期，给出提示
                            this.$message({message:'该人员的证件已过期!',type:'warning'})
                        }
                    }
                })
            },
            //根据选择的危化品，获取信息
            changeCargos(id){
                this.cargos.map(item=>{
                    if(item.id == id){
                        this.ruleForm.cargoName = item.name
                    }
                })
            },
            submitForm(formName) {
                let self=this;
                this.$refs[formName].validate((valid) => {
                    //验证驾驶员数据的有效性
                    const isValids = [];
                    this.$refs.driver.map(item=>{
                        item.submitForm();
                        isValids.push(item.isValid);
                    });
                    if (valid && isValids.findIndex(isValid=>isValid===false)==-1) {
                        this.ruleForm.wayBillStatus=1;
                        let eleWaybillDrivers = [];
                        this.driver.map(item=>{
                            eleWaybillDrivers.push({driverId:item.driverId})
                        });
                        const params = Object.assign(this.ruleForm,{eleWaybillDriver:eleWaybillDrivers})
                        saveOrUpdate(params).then(res => {
                            this.$message({
                                showClose: true,
                                message: '新增成功！',
                                type: 'success'
                            });
                            self.$emit('showHiddenAdd', false, true);
                            this.$refs[formName].resetFields();
                        }).catch((err) => {
                            // 公共方法有，所以不需要加提示了
                            // this.$message.error(err.msg)
                        })
                    } else {
                        return false;
                    }
                });
            },
            getCompanyData() {
                let self = this;
                getBasicCompanyList({}).then(res => {
                    self.options=res.data.list
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.ruleForm.carId = null;
                this.ruleForm.escortId = null;
                this.ruleForm.trailerId = null;
                this.ruleForm.cargoId = null;
                //重置驾驶员信息
                this.driver = [{driverId: null,driverName :'',driveridCardNo:'',driverLicenseNo:'',driverTelephone:''}];
                //清除驾驶员组件中的表单数据
                this.$refs.driver.map(item=>{
                    item.resetForm();
                });
                getBasicCompanyList({companyId:this.userInfo.companyId}).then(res=>{
                    if(res.data.list[0]){
                        this.ruleForm.carrierCompanyId = res.data.list[0].id;
                        this.ruleForm.carrierCompanyName = res.data.list[0].companyName;
                        this.ruleForm.carrierCompanyLicenseNo = res.data.list[0].licenceCode;
                        this.ruleForm.carrierCompanyTelephone = res.data.list[0].headerPhone;
                    }
                });

            },

            //选择托运、承运、装货、收货公司的名称后，获取公司对应的id
            changeConsignorCompany(value){
                this.options.map(item=>{
                    if(item.companyName == value){
                        this.ruleForm.consignorCompanyId = item.id
                    }
                })
            },
            changeCarrierCompany(value){
                this.options.map(item=>{
                    if(item.companyName == value){
                        this.ruleForm.carrierCompanyId = item.id
                    }
                })
            },
            changeLoadCompany(value){
                this.options.map(item=>{
                    if(item.companyName == value){
                        this.ruleForm.loadCompanyId = item.id
                    }
                })
            },
            changeReceiverCompany(value){
                this.options.map(item=>{
                    if(item.companyName == value){
                        this.ruleForm.receiverCompanyId = item.id
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    /deep/ .el-form-item {
      width: 325px;
    }
    /deep/.el-input,.el-input__inner {
        width: 200px;
    }

    //隐藏数字按钮上下
      /deep/ input::-webkit-outer-spin-button,
      /deep/ input::-webkit-inner-spin-button {
          -webkit-appearance: none;
      }
    /deep/input[type="number"]{
        -moz-appearance: textfield;
    }
</style>
