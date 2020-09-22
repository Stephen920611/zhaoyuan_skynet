<template>
    <div class="mask-add-edit-manage" id="mask" style="position: relative;max-height: calc(100vh - 300px)" v-scrollBar>
        <div class="mask-content" id="mask-content">
            <div class="info-wrap">
                <el-form label-position="right" ref="form" :rules="rules" :model="form" :inline="true" label-width="185px">
                    <el-form-item label="危险源名称:" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="危险源状态:" prop="state">
                        <el-select v-model="form.state" class="filter-item"
                                   placeholder="请选择危险源状态" >
                            <el-option
                                    v-for="item in states"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="危险源所在地址:" prop="address">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                    <el-form-item label="危险源投用时间:" prop="useDate">
                        <el-date-picker
                                v-model="form.useDate"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="危险源级别:" prop="level">
                        <el-select v-model="form.level" class="filter-item"
                                   placeholder="请选择危险源级别" >
                            <el-option
                                    v-for="item in levels"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="危险源R值:" prop="rvalue">
                        <el-input v-model="form.rvalue" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="港口危险货物名称:" prop="hazard">
                        <el-input v-model="form.hazard"></el-input>
                    </el-form-item>
                    <el-form-item label="生产用途:" prop="purpose">
                        <el-select v-model="form.purpose" class="filter-item"
                                   placeholder="请选择生产用途" >
                            <el-option
                                    v-for="item in purposes"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规模:" prop="scale">
                        <el-input v-model="form.scale"></el-input>
                    </el-form-item>
                    <el-form-item label="与防护目标最近距离(米):" prop="distance">
                        <el-input v-model="form.distance" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="500m范围内人数估值:" prop="peopleNum">
                        <el-input v-model="form.peopleNum" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="近三年内港口危险货物事故:" prop="accidentSituation">
                        <el-input v-model="form.accidentSituation"></el-input>
                    </el-form-item>
                    <el-form-item label="危险性类别:" prop="type">
                        <el-input v-model="form.type"></el-input>
                    </el-form-item>
                    <el-form-item label="联合国编号:" prop="unCode">
                        <el-input v-model="form.unCode"></el-input>
                    </el-form-item>
                    <el-form-item label="生产工艺:" prop="technology">
                        <el-input v-model="form.technology"></el-input>
                    </el-form-item>
                    <el-form-item label="危险源影响范围半径（米）:" prop="radius">
                        <el-input v-model="form.radius"  type="number"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button  @click="resetForm('form')">重 置</el-button>
                <el-button type="primary" @click="submitForm('form')">添 加</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {saveOrUpdateHazardSource} from '@/api/majorHazardSource'
    export default {
        components: {CommonSubtitle},
        name: 'EditHazard',
        props:['states','levels','purposes','userInfo','areaId','data'],
        data(){
            return {
                form:{
                    id:null,
                    areaId:null,
                    companyId:null,
                    name:'',
                    state:null,
                    address:'',
                    useDate:'',
                    level:null,
                    rvalue:'',
                    scale:'',
                    distance:'',
                    peopleNum:'',
                    accidentSituation:'',
                    hazard:'',
                    type:'',
                    unCode:'',
                    purpose:'',
                    technology:'',
                    radius:'',
                    insertId :null,
                },
                rules:{
                    name: [
                        { required: true, message: '请输入重大危险源名称', trigger: 'blur' }
                    ],
                    state: [
                        { required: true, message: '请选择重大危险源状态', trigger: 'change' },
                    ],
                    level: [
                        { required: true, message: '请选择重大危险源级别', trigger: 'change' },
                    ],
                    address: [
                        { required: true, message: '请输入重大危险源所在地址', trigger: 'blur' },
                    ],
                    useDate: [
                        { required: true, message: '请选择重大危险源投用时间', trigger: 'change' },
                    ],
                    rvalue: [
                        { required: true, message: '请输入重大危险源的R值', trigger: 'blur' },
                    ],
                    hazard: [
                        { required: true, message: '请输入港口危险货物名称', trigger: 'blur' },
                    ],
                    purpose: [
                        { required: true, message: '请选择生产用途', trigger: 'change' },
                    ]
                }
            }
        },
        created() {
            this.form.companyId = this.userInfo.companyId;
            this.form.insertId = this.userInfo.id;
            this.form.areaId = this.areaId;
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
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.form,"this.form");
                        saveOrUpdateHazardSource(this.form).then(res=>{
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
    /deep/ .el-input,.el-select,.el-date-editor{
        width: 200px;
    }
</style>
<style lang="scss" scoped>
</style>
