<template>
    <div class="mask-add-edit-manage demo-form-inline-input" id="mask" style="position: relative;">
        <el-form label-position="right" ref="ruleForm" :inline="true" label-width="150px" :model="ruleForm"
                 :rules="rules">
            <CommonSubtitle title="基本信息" :isBold="true" style="line-height: 10px;margin-bottom: 15px"></CommonSubtitle>
            <el-row >
                <el-col :span="12">
                    <el-form-item label="物资名称:" prop="carNum">
                        <el-input v-model="ruleForm.carNum" placeholder="请输入物资名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="规格型号:" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入规格型号"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >

                <el-col :span="12">
                    <el-form-item label="物资数量:" prop="num">
                        <el-input v-model="ruleForm.num" placeholder="请输入物资数量"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="计量单位:" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入计量单位"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row  >
                <el-col :span="24" class="margin-t-10">
                    <el-form-item label="物资技术状况：" prop="des">
                        <el-input type="textarea" v-model="ruleForm.des"
                                  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请填写物资技术状况"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row  >
                <el-col :span="24" class="margin-t-10">
                    <el-form-item label="其他情况说明：" prop="other">
                        <el-input type="textarea" v-model="ruleForm.other"
                                  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请填写其他情况说明"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <CommonSubtitle title="从属信息" :isBold="true" style="line-height: 10px;margin-bottom: 15px"></CommonSubtitle>
            <el-row >
                <el-col :span="12" class="margin-t-10">
                    <el-form-item label="应急物资储备点：" prop="attribution" style="margin-bottom: 12px">
                        <el-select v-model="ruleForm.attribution" class="filter-item"
                                   placeholder="请选择应急物资储备点">
                            <el-option
                                    v-for="item in attributionOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="12" class="margin-t-10">
                    <el-form-item label="应急物资大类：" prop="personName" style="margin-bottom: 12px">
                        <el-select v-model="ruleForm.personName" class="filter-item"
                                   placeholder="请选择应急物资大类">
                            <el-option
                                    v-for="item in attributionOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="margin-t-10">
                    <el-form-item label="应急物资小类:" prop="organization">
                        <el-select v-model="ruleForm.organization" class="filter-item"
                                   placeholder="请选择应急物资小类">
                            <el-option
                                    v-for="item in attributionOptions"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-form-item class="margin-td-10" style="text-align:center; width: 100%;">
                <el-button @click="resetForm">重 置</el-button>
                <el-button type='primary' @click="submitForm">保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {getByCode, basicChemicalsList, carSaveOrUpdate} from '@/api/industryInfo/vehicleInfo'
    import {mapGetters} from 'vuex'
    import passParam from '@/utils/ext.passParam'


    export default {
        name: "editEmergencyResources",
        components: {CommonSubtitle},
        props: [],
        data() {
            return {
                ruleForm: {
                    id: null,
                    carNum: '',
                    name: '',
                    num: '',
                    des: '',
                    attribution: null,
                    personName:null,
                    organization:'',
                    direction:'',//救援方向
                    other:'',
//
                },
                //应急预案归属
                attributionOptions: [
                    {
                        name: '港航管理局',
                        value: 0,
                    },
                    {
                        name: '港口经营人',
                        value: 1,
                    },
                    {
                        name: '其他',
                        value: 2,
                    },],
                rules: {
                    carNum: [
                        {required: true, message: '请输入物资名称', trigger: 'change'},
                    ],
                    organization: [
                        {required: true, message: '请选择应急物资储备点', trigger: 'blur'},
                    ],
                    attribution: [
                        {required: true, message: '请选择应急物资小类', trigger: 'blur'},
                    ],
                    direction:[
                        {required: true, message: '请输入应急队伍救援方向', trigger: 'blur'},
                    ],
                    num:[
                        {required: true, message: '请填写物资数量', trigger: 'change'},
                    ],

                },
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            //保存基本信息
            submitForm() {

            },
            resetForm() {
                this.$refs['ruleForm'].resetFields();

            },
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    .demo-form-inline-input {
        /deep/ .el-input {
            width: 100% !important;
        }
        /deep/ .el-select {
            width: 100%;
        }
        .el-form-item{
            width: 100%;
        }

        /deep/ .el-form-item__content{
            width: calc(100% - 150px);
        }

        /deep/ .el-textarea{
            width: 100%;
        }
    }


</style>
