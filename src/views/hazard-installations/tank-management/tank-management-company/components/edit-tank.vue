<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form label-position="right" ref="ruleForm" :rules="rules" :model="form" :inline="true" label-width="170px">
                    <!-------------------------从属信息----------------------------------->
                    <CommonSubtitle title="从属信息" :isBold="true" style="margin-bottom: 10px"></CommonSubtitle>
                    <el-form-item label="名称/编号:" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <!--  <el-form-item label="所属港口经营人:">
                          <el-input v-model="form.name"></el-input>
                      </el-form-item>-->
                    <!--  <el-form-item label="所属罐区:">
                          <el-input v-model="form.areaId"></el-input>
                      </el-form-item>-->
                    <el-form-item label="所属罐组:" prop="tankGroup">
                        <el-input v-model="form.tankGroup"></el-input>
                    </el-form-item>
                    <!-------------------------基础信息----------------------------------->
                    <CommonSubtitle title="基础信息" :isBold="true" style="margin-bottom: 10px"></CommonSubtitle>
                    <el-form-item label="危险货物作业附证编号:" prop="certificate">
                        <el-input v-model="form.certificate"></el-input>
                    </el-form-item>
                    <el-form-item label="使用登记证编号:" prop="useCertificate">
                        <el-input v-model="form.useCertificate"></el-input>
                    </el-form-item>
                    <el-form-item label="设计储存介质类别:" prop="designMedium">
                        <el-input v-model="form.designMedium"></el-input>
                    </el-form-item>
                    <el-form-item label="许可储存介质:" prop="allowMedium">
                        <el-input v-model="form.allowMedium"></el-input>
                    </el-form-item>
                    <el-form-item label="作业方式:" prop="workType">
                        <el-input v-model="form.workType"></el-input>
                    </el-form-item>
                    <el-form-item label="作业危险货物品名:" prop="workCargoType">
                        <el-input v-model="form.workCargoType"></el-input>
                    </el-form-item>
                    <el-form-item label="制造日期:" prop="makeDate">
                        <el-date-picker
                            v-model="form.makeDate"
                            value-format="yyyy-MM-dd"
                            type="date">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="设计使用年限(年):" prop="designLife">
                        <el-input v-model="form.designLife" @keydown.native="upNumber" @keyup.native="upNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="材料分类:" prop="material">
                        <el-select v-model="form.material" class="filter-item"
                                   placeholder="请选择材料分类">
                            <el-option
                                v-for="item in materialOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="几何形式分类:" prop="geometry">
                        <el-select v-model="form.geometry" class="filter-item"
                                   placeholder="请选择几何形式分类">
                            <el-option
                                v-for="item in geometryOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="最大容积(立方米):" prop="volume">
                        <el-input v-model="form.volume" @keydown.native="upNumber" @keyup.native="upNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="罐体公称直径(米):" prop="diameter">
                        <el-input v-model="form.diameter" @keydown.native="upDecimals" @keyup.native="upDecimals"></el-input>
                    </el-form-item>
                    <el-form-item label="设计最大承压(兆帕):" prop="designPressure">
                        <el-input v-model="form.designPressure" @keydown.native="upDecimals" @keyup.native="upDecimals"></el-input>
                    </el-form-item>
                    <el-form-item label="当前工作压力(兆帕):" prop="workPressure">
                        <el-input v-model="form.workPressure" @keydown.native="upDecimals" @keyup.native="upDecimals"></el-input>
                    </el-form-item>
                    <el-form-item label="设计最大承温(℃):" prop="designTemperature">
                        <el-input v-model="form.designTemperature" @keydown.native="upNumber" @keyup.native="upNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="实际最高温度(℃):" prop="maxTemperature">
                        <el-input v-model="form.maxTemperature" @keydown.native="upNumber" @keyup.native="upNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="设计最高液位(米):" prop="designLevel">
                        <el-input v-model="form.designLevel" @keydown.native="upDecimals" @keyup.native="upDecimals"></el-input>
                    </el-form-item>
                    <el-form-item label="最高试验液位(米):" prop="maxLevel">
                        <el-input v-model="form.maxLevel" @keydown.native="upDecimals" @keyup.native="upDecimals"></el-input>
                    </el-form-item>
                    <el-form-item label="投入使用日期:" prop="startDate">
                        <el-date-picker
                            v-model="form.startDate"
                            value-format="yyyy-MM-dd"
                            type="date">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="检测周期(月):" prop="checkCycle">
                        <el-input v-model="form.checkCycle" @keydown.native="upNumber" @keyup.native="upNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="安装形式分类:" prop="installType">
                        <el-select v-model="form.installType" class="filter-item"
                                   placeholder="请选择所属罐组">
                            <el-option
                                v-for="item in installTypeOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <!-------------------------其他信息----------------------------------->
                    <CommonSubtitle title="其他信息" :isBold="true" style="margin-bottom: 10px"></CommonSubtitle>
                    <el-form-item label="设计单位名称:" prop="designCompany">
                        <el-input v-model="form.designCompany"></el-input>
                    </el-form-item>
                    <el-form-item label="设计单位资质:" prop="designQualify">
                        <el-input v-model="form.designQualify"></el-input>
                    </el-form-item>
                    <el-form-item label="制造单位名称:" prop="makeCompany">
                        <el-input v-model="form.makeCompany"></el-input>
                    </el-form-item>
                    <el-form-item label="制造单位资质:" prop="makeQualify">
                        <el-input v-model="form.makeQualify"></el-input>
                    </el-form-item>
                    <el-form-item label="安装单位名称:" prop="installCompany">
                        <el-input v-model="form.installCompany"></el-input>
                    </el-form-item>
                    <el-form-item label="安装单位资质:" prop="installQualify">
                        <el-input v-model="form.installQualify"></el-input>
                    </el-form-item>
                    <el-form-item label="检测单位名称:" prop="checkCompany">
                        <el-input v-model="form.checkCompany"></el-input>
                    </el-form-item>
                    <el-form-item label="检测日期:" prop="lastCheck">
                        <el-date-picker
                            v-model="form.lastCheck"
                            value-format="yyyy-MM-dd"
                            type="date">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="检测单位资质:" prop="checkQualify">
                        <el-input v-model="form.checkQualify"></el-input>
                    </el-form-item>
                    <el-form-item label="维护情况:" prop="maintain">
                        <el-input v-model="form.maintain"></el-input>
                    </el-form-item>
                    <el-form-item label="其它说明:" prop="mark">
                        <el-input v-model="form.mark"></el-input>
                    </el-form-item>
                    <el-form-item label="工作液位(M):" prop="workHeight">
                        <el-input v-model="form.workHeight" @keydown.native="upDecimals" @keyup.native="upDecimals"></el-input>
                    </el-form-item>
                    <el-form-item label="工作温度(°C):" prop="workTemperate">
                        <el-input v-model="form.workTemperate" @keydown.native="upDecimals" @keyup.native="upDecimals"></el-input>
                    </el-form-item>
                    <el-form-item label="理化信息:" prop="chemicalInfo">
                        <el-input v-model="form.chemicalInfo"></el-input>
                    </el-form-item>
                    <el-form-item label="安全应急措施:" prop="safetyMeasure" class="text-area">
                        <el-input
                            type="textarea"
                            v-model="form.safetyMeasure"
                            :autosize="{ minRows: 2, maxRows: 4}"
                        >
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button  @click="resetForm('ruleForm')">重 置</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {basicTankSaveOrUpdate} from '@/api/majorHazardSource'
    import {getByCode} from '@/api/industry'
    export default {
        components: {CommonSubtitle},
        name: 'EditTank',
        props:['userInfo','areaId','data'],
        data(){
            return {
                form:{
                    id:'',
                    insertId:'',
                    name: '',
                    areaId: '',
                    companyId:'',
                    tankGroup: '',
                    certificate: '',
                    useCertificate: '',
                    designMedium: '',
                    allowMedium: '',
                    workType: '',
                    workCargoType: '',
                    makeDate: '',
                    designLife: '',
                    material: '',
                    geometry: '',
                    volume: '',
                    diameter: '',
                    designPressure: '',
                    workPressure: '',
                    designTemperature: '',
                    maxTemperature: '',
                    designLevel: '',
                    maxLevel:'',
                    startDate: '',
                    checkCycle: '',
                    installType: '',
                    designCompany: '',
                    designQualify: '',
                    makeCompany: '',
                    makeQualify: '',
                    installCompany: '',
                    installQualify: '',
                    checkCompany: '',
                    lastCheck: '',
                    checkQualify: '',
                    maintain: '',
                    mark: '',
                    workHeight: '',
                    workTemperate: '',
                    chemicalInfo: '',
                    safetyMeasure: '',
                },
                rules:{
                    name: [
                        { required: true, message: '请输入名称/编号', trigger: 'blur' }
                    ],
                    tankGroup: [
                        { required: true, message: '请输入所属罐组', trigger: 'blur' },
                    ],
                    certificate: [
                        { required: true, message: '请输入危险货物作业附证编号', trigger: 'blur' },
                    ],
                    useCertificate: [
                        { required: true, message: '请输入使用登记证编号', trigger: 'blur' },
                    ],
                    designMedium: [
                        { required: true, message: '请输入设计储存介质类别', trigger: 'blur' },
                    ],
                    allowMedium: [
                        { required: true, message: '请输入许可储存介质', trigger: 'blur' },
                    ],
                    workType: [
                        { required: true, message: '请输入作业方式', trigger: 'blur' },
                    ],
                    workCargoType: [
                        { required: true, message: '请输入作业危险货物品名', trigger: 'blur' },
                    ],
                    makeDate: [
                        { required: true, message: '请选择制造日期', trigger: 'blur' },
                    ],
                    designLife: [
                        { required: true, message: '请输入设计使用年限', trigger: 'blur' },
                    ],
                    material: [
                        { required: true, message: '请输入材料分类', trigger: 'blur' },
                    ],
                    geometry: [
                        { required: true, message: '请选择几何形式分类', trigger: 'blur' },
                    ],
                    volume: [
                        { required: true, message: '请输入最大容积(立方米)', trigger: 'blur' },
                    ],
                    diameter: [
                        { required: true, message: '请输入罐体公称直径(米)', trigger: 'blur' },
                    ],
                    designPressure: [
                        { required: true, message: '请输入设计最大承压(兆帕)', trigger: 'blur' },
                    ],
                    workPressure: [
                        { required: true, message: '请输入当前工作压力(兆帕)', trigger: 'blur' },
                    ],
                    designTemperature: [
                        { required: true, message: '请输入设计最大承温(℃)', trigger: 'blur' },
                    ],
                    maxTemperature: [
                        { required: true, message: '请输入实际最高温度(℃)', trigger: 'blur' },
                    ],
                    designLevel: [
                        { required: true, message: '请输入设计最高液位(米)', trigger: 'blur' },
                    ],
                    startDate: [
                        { required: true, message: '请选择投入使用日期', trigger: 'blur' },
                    ],
                    checkCycle: [
                        { required: true, message: '请输入检测周期(月)', trigger: 'blur' },
                    ],
                    installType: [
                        { required: true, message: '请输入安装形式分类', trigger: 'blur' },
                    ],
                    designCompany: [
                        { required: true, message: '请输入设计单位名称', trigger: 'blur' },
                    ],
                    designQualify: [
                        { required: true, message: '请输入设计单位资质', trigger: 'blur' },
                    ],
                    makeCompany: [
                        { required: true, message: '请输入制造单位名称', trigger: 'blur' },
                    ],
                    makeQualify: [
                        { required: true, message: '请输入制造单位资质', trigger: 'blur' },
                    ],
                    installCompany: [
                        { required: true, message: '请输入安装单位名称', trigger: 'blur' },
                    ],
                    installQualify: [
                        { required: true, message: '请输入安装单位资质', trigger: 'blur' },
                    ],
                    checkCompany: [
                        { required: true, message: '请输入检测单位名称', trigger: 'blur' },
                    ],
                    lastCheck: [
                        { required: true, message: '请选择检测日期', trigger: 'blur' },
                    ],
                    checkQualify: [
                        { required: true, message: '请输入检测单位资质', trigger: 'blur' },
                    ],
                    maintain: [
                        { required: true, message: '请输入维护情况', trigger: 'blur' },
                    ],
                    mark: [
                        { required: true, message: '请输入其它说明', trigger: 'blur' },
                    ],
                    workHeight: [
                        { required: true, message: '请输入工作液位(M)', trigger: 'blur' },
                    ],
                    workTemperate: [
                        { required: true, message: '请输入工作温度(°C)', trigger: 'blur' },
                    ],
                    chemicalInfo: [
                        { required: true, message: '请输入理化信息', trigger: 'blur' },
                    ],
                    safetyMeasure: [
                        { required: true, message: '请输入安全应急措施', trigger: 'blur' },
                    ],
                },
                installTypeOptions:[],   //储罐安装形式
                materialOptions:[],   //材料
                geometryOptions:[],   //几何
            }
        },
        created() {
            this.form.companyId = this.userInfo.companyId;
            this.form.insertId = this.userInfo.id;
            this.form.areaId = this.areaId;
            this.dictionary();
        },
        watch:{
            'data':{
                handler(value){
                    if(value){
                        const keys = Object.keys(value);
                        for(let key of keys){
                            if(Object.keys(this.form).indexOf(key)>-1){
                                this.form[key] = value[key]
                            }
                        }
                    }
                },
                immediate: true,
                deep: true
            }
        },
        methods:{
            upDecimals(e){
                e.target.value = e.target.value.replace(/[^\d.]/g,'')
            },
            upNumber(e){
                e.target.value = e.target.value.replace(/[^\d]/g,'')
            },
            //字典查询
            dictionary() {
                //储罐的安装形式
                getByCode({code: 'TANK_INSTALL_TYPE', enable: 1}).then(res => {
                    this.installTypeOptions = [];
                    res.data.list.map(item => {
                        item.value= parseInt(item.value);
                        this.installTypeOptions.push(item);
                    })
                });
                //储罐的材料分类
                getByCode({code: 'TANK_MATERIAL', enable: 1}).then(res => {
                    this.materialOptions = [];
                    res.data.list.map(item => {
                        item.value= parseInt(item.value);
                        this.materialOptions.push(item);
                    })
                });
                //储罐的几何形式
                getByCode({code: 'TANK_SHAPE', enable: 1}).then(res => {
                    this.geometryOptions = [];
                    res.data.list.map(item => {
                        item.value= parseInt(item.value);
                        this.geometryOptions.push(item);
                    })
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        basicTankSaveOrUpdate(this.form).then(res=>{
                            if(res.code == "1000"){
                                this.$message({message:'添加成功!',type:'success'});
                                this.$emit('closeDialog')
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        }
    }
</script>
<style lang="scss" scoped>
    /deep/ .el-tabs__item{
        font-size: 16px;
    }
    .check-info{
        .el-col{
            height: 15px;
        }
        .line{
            width: 6px;
            height: 22px;
            display: inline-block;
            background-color: #2794e7;
            float: left;
            margin: -4px 10px 0 0;
        }
    }
    /deep/ .el-form--inline .el-form-item {
        width: 355px;
        /deep/ .el-form-item__content{
            width: 185px;
            /deep/ .el-date-editor{
                width: 185px;
            }
        }
    }
    .text-area {
        width: 98%!important;
        /deep/ .el-form-item__content {
            width: calc(100% - 170px)!important;
        }
        /deep/ .el-textarea, .el-select {
            width: 96%;
        }
    }
</style>
