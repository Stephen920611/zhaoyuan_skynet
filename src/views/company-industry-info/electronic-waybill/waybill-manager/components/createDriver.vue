<template>
    <el-form :model="infoData" :rules="rulesDriver" label-width="125px" ref="infoData" :inline="true">
        <el-form-item label="驾驶员姓名:" prop="driverName" style="margin-right: 20px">
            <el-select v-model="infoData.driverName" filterable placeholder="请选择驾驶员" @change="handleSelectDriver">
                <el-option
                        v-for="item in driverArray"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="驾驶员身份证号:" prop="driveridCardNo" style="margin-right: 20px">
            <el-input v-model="infoData.driveridCardNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="驾驶证:" prop="driverLicenseNo" style="margin-right: 20px">
            <el-input v-model="infoData.driverLicenseNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="驾驶员联系电话:" prop="driverTelephone" style="margin-right: 20px">
            <el-input v-model="infoData.driverTelephone" disabled></el-input>
        </el-form-item>
        <!-------------------------删除按钮----------------------------------->
        <!--<el-button v-if="indexNum == 0" type="primary" icon="el-icon-plus" title="添加" size="small" circle @click="addDriver"></el-button>-->
        <!--<el-button v-if="indexNum!=0" type="danger" icon="el-icon-close" title="删除" size="small" circle @click="delDriver"></el-button>-->
    </el-form>
</template>

<script>
    import CreateDriver from '../components/createDriver.vue'
    import {getWorker,getFreeWorker} from '@/api/industry'

    export default {
        name: "createDriver",
        components: {CreateDriver},
        props: {
            driverData: {
                require: true
            },
            indexNum: {
                type: Number
            },
            driverArray:{
                type:Array,
                default(){
                    return [];
                }
            }
        },
        data() {
            let validateNumber = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入联系人电话'));
                } else {
                    let regPone = null;
                    let mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; //最新16手机正则
                    let tel = /^(0[0-9]{2,3}\-)([2-9][0-9]{4,7})+(\-[0-9]{1,4})?$/; //座机
                    if (value.charAt(0) == 0) {    // charAt查找第一个字符方法，用来判断输入的是座机还是手机号
                        regPone = tel;
                    } else {
                        regPone = mobile;
                    }
                    if (!regPone.test(value) && regPone == tel) {
                        return callback(
                            new Error("格式错误(座机'区号-座机号码')")
                        );
                    } else if (!regPone.test(value) && regPone == mobile) {
                        return callback(
                            new Error("错误输入，请重新输入")
                        );
                    } else {
                        callback();
                    }
                }
            };
            return {
                infoData: {
                    driverId: '',
                    driverName: '',
                    driveridCardNo: '',
                    driverLicenseNo: '',
                    driverTelephone: '',
                },
                rulesDriver: {
                    driverName: [
                        {required: true, message: '请输入驾驶员姓名', trigger: 'change'},
                    ],
                    driveridCardNo: [
                        {required: true, message: '请输入身份证号', trigger: 'blur'},
                    ],
                    driverLicenseNo: [
                        {required: true, message: '请输入驾驶证', trigger: 'blur'},
                    ],
                    driverTelephone: [
                        {required: true, validator: validateNumber, trigger: 'blur'},
                    ],
                },
                isValid: false,  //检验数据输入的有效性
            }
        },
        created() {
            //获取用户信息
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            this.infoData = this.driverData;
        },
        watch: {
            'driverData': {
                handler(newValue) {
                    deep: true;
                    immediate: true;
                    this.infoData = newValue;
                    this.$refs["infoData"].resetFields()
                }
            },
        },
        methods: {

            //根据选择的驾驶员名称，获取信息
            handleSelectDriver(id) {
                getWorker({workerId: id}).then(res => {
                    if (res.data.list.length > 0) {
                        this.infoData.driverId = res.data.list[0].id;  //身份证号
                        this.infoData.driveridCardNo = res.data.list[0].personNum;  //身份证号
                        this.infoData.driverTelephone = res.data.list[0].phoneNum;  //联系电话
                        this.infoData.driverLicenseNo = res.data.list[0].workerDriveLicenseDTO[0] ? res.data.list[0].workerDriveLicenseDTO[0].licenceCode : '';  //驾驶证
                        if(!res.data.list[0].workerDriveLicenseDTO[0]){
                            //证件已过期，给出提示
                            this.$message({message:'该人员的证件已过期!',type:'warning'})
                        }
                    }
                })
            },
            //点击删除驾驶员信息
            delDriver() {
                this.$emit('delDriver', this.indexNum)
            },
            //点击添加驾驶员信息
            addDriver() {
                this.$emit('addDriver')
            },
            //检验数据的有效性
            submitForm() {
                this.$refs['infoData'].validate((valid) => {
                    if (valid) {
                        this.isValid = true;
                    } else {
                        this.isValid = false;
                    }
                });
            },
            //清除表单表单
            resetForm() {
                this.$refs['infoData'].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
