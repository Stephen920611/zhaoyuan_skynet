<template>
    <div class="mask-add-edit-manage" id="mask">
        <div class="mask-content" id="mask-content">
            <div class="info">
                <el-form v-loading="loading" :model="form" ref="form" class="demo-form-inline" label-position="right"
                         label-width="120px">
                    <el-form-item label="路线名称：">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="线路编号：">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="限行路线描述：">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="限行车辆类型：">
                        <el-checkbox-group v-model="form.carType">
                            <el-checkbox :label="item.value" border v-for="(item, index) in carTypeOptions"
                                         :key="item.value"
                                         style="margin-right: 10px;float:left;margin-bottom: 10px">{{item.name}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="限行时段：">
                        <el-checkbox-group v-model="form.timeType">
                            <el-checkbox :label="item.value" border v-for="(item, index) in timeTypeOptions"
                                         :key="item.value"
                                         style="margin-right: 10px;float:left;margin-bottom: 10px">{{item.name}}
                            </el-checkbox>
                            <el-checkbox v-show='showTimeType' label="add" border class="add-checkbox"
                                         @click.native="addTimeType">
                                <i class="el-icon-plus"></i>
                            </el-checkbox>
                        </el-checkbox-group>
                        <el-input v-model="timeTypeValue" v-show='!showTimeType' placeholder="请输入自定义限行时段"
                                  @change="changeTimeType"></el-input>
                    </el-form-item>

                </el-form>
                <div style="text-align: right;margin-bottom:12px">
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button @click="toggleRouteDetailVisible">取消</el-button>
                </div>

            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {mapGetters} from 'vuex'

    export default {
        name: 'alarmDetail',
        props: [''],
        components: {CommonSubtitle},
        data() {
            return {
                disableKey: false,
                loading: false,//loading 效果
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: '',
                    carType: [],
                    timeType: [],
                },
                carTypeOptions: [
                    {
                        name: '大货车',
                        value: 1
                    },
                    {
                        name: '小货车',
                        value: 2
                    },
                    {
                        name: '中型客车',
                        value: 3
                    },
                    {
                        name: '客车',
                        value: 4
                    },
                    {
                        name: '教练车',
                        value: 5
                    },
                ],
                timeTypeOptions: [
                    {
                        name: '9:00--10:00',
                        value: 1
                    },
                    {
                        name: '12:00--14:00',
                        value: 2
                    },
                    {
                        name: '14:00--16:00',
                        value: 3
                    },
                    {
                        name: '20:00--21:00',
                        value: 4
                    },
                    {
                        name: '22:00--24:00',
                        value: 5
                    },
                ],
                showTimeType: true,//判断是否显示加号或者输入框
                timeTypeValue: '',//添加限行时段，输入框输入的内容

            }
        },
        computed: {
            ...mapGetters([
                'editRouteDetail',
            ])
        },
        mounted() {
        },
        methods: {
            //添加限行时段
            addTimeType() {
                this.showTimeType = false;
                this.timeTypeValue = "";
            },
            //添加限行时段，输入框失去焦点时
            changeTimeType() {
                this.showTimeType = true;
                let resTimeTypeOptions = this.timeTypeOptions;
                resTimeTypeOptions.push({
                    name: this.timeTypeValue,
                    value: this.timeTypeOptions.length + 2
                })
                this.timeTypeOptions = resTimeTypeOptions;
            },

            //弹窗的显示与隐藏
            toggleRouteDetailVisible(){
                this.$store.dispatch("industryInfo/baseInfo/restrictedRoad/toggleRouteDetailVisible",{routeDetailVisible:false})
            },

            //保存功能
            onSubmit(){
                console.log('onSubmit')

            },
        },

    }
</script>
<style lang="scss" type="text/scss" scoped>
    .common-subtitle {
        font-size: 16px;
        border: none;
    }

    .common-subtitle-i {
        margin: -5px 10px -5px 0;
        height: 22px;
    }

    .detail-title {
        height: 20px;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        font-size: 16px;
    }

    .el-tag--medium {
        height: 20px;
        line-height: 20px;
    }

    .el-tag {
        border-radius: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        /*width:50%;*/
        /*text-align: center;*/
    }

    //form 表单详情
    .el-checkbox.is-bordered + .el-checkbox.is-bordered {
        margin-left: 0;
    }

    .el-checkbox:after {
        clear: both;
        content: '';
    }

    .el-checkbox {
        line-height: 20px;
    }

    //添加check
    .add-checkbox {
        /deep/ .el-checkbox__input {
            display: none;
        }
        margin-right: 10px;
        float: left;
        margin-bottom: 10px
    }


</style>
