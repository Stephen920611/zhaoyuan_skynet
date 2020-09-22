<template>
    <div class="mask-add-edit-manage" id="mask">
        <div class="mask-content" id="mask-content">
            <div class="info">
                <el-form v-loading="loading" :model="form" :rules="rules" ref="form" class="demo-form-inline"
                         label-position="right" label-width="120px">
                    <div class="demo-form-inline-input">
                        <el-row :gutter="20">
                            <el-col :span="12" class="margin-t-10">
                                <el-form-item label="装卸位名称：" prop="name">
                                    <el-input v-model="form.name" :disabled="isDisabled"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="margin-t-10">
                                <el-form-item label="所属企业：" prop="companyName">
                                    <el-input v-model="form.companyName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12" class="margin-t-10">
                                <el-form-item label="装卸位类型：" prop="type">
                                    <el-select v-model="form.type" class="filter-item" :disabled="isDisabled"
                                               placeholder=""
                                    >
                                        <el-option
                                                v-for="item in ladeSiteTypeOptions"
                                                :key="Number(item.value)"
                                                :label="item.name"
                                                :value="Number(item.value)"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="margin-t-10">
                                <el-form-item label="装卸方式：" prop="model">
                                    <el-select v-model="form.model" class="filter-item" :disabled="isDisabled"
                                               placeholder=""
                                    >
                                        <el-option
                                                v-for="item in ladeSiteModelOptions"
                                                :key="Number(item.value)"
                                                :label="item.name"
                                                :value="Number(item.value)"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12" class="margin-t-10">
                                <el-form-item label="装卸介质：" prop="chemicalId">
                                    <el-select v-model="form.chemicalId" type="textarea" multiple filterable
                                               placeholder="">
                                        <el-option
                                                v-for="item in chemicalIdOptions"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="margin-t-10">
                                <el-form-item label="运营状态：" prop="status">
                                    <el-select v-model="form.status" class="filter-item" :disabled="isDisabled"
                                               placeholder=""
                                    >
                                        <el-option
                                                v-for="item in ladeSiteStatusOptions"
                                                :key="Number(item.value)"
                                                :label="item.name"
                                                :value="Number(item.value)"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24" class="margin-t-10">
                                <el-form-item label="备注：" prop="des">
                                    <el-input
                                            type="textarea"
                                            :rows="2"
                                            v-model="form.des"
                                            :disabled="isDisabled"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>

                    <div class="list-main">
                        <div class="box-card-title">关联摄像机</div>
                        <el-card class="box-card transfer-content" style="margin-left: 20px;margin-top: 10px">
                            <!-- 穿梭框 -->
                            <el-transfer
                                    filterable
                                    filter-placeholder="请输入点位名称"
                                    v-model="videoCamera"
                                    @right-check-change="handleChange"
                                    :titles="['资源列表', '已选择列表']"
                                    :props="props"
                                    :data="listData"

                            >
                                <el-button class="transfer-footer" slot="right-footer" size="small" @click="clear()">
                                    清空所选
                                </el-button>
                                <!--<el-button class="transfer-footer" slot="right-footer" size="small" @click="saveDevice()">保存</el-button>-->
                            </el-transfer>

                        </el-card>
                    </div>

                    <div style="text-align: center;margin-top: 20px" class="form-item-btn">
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                        <el-button @click="cancelDetail">取消</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonSubtitle from '@/components/CommonSubtitle'
    import {mapGetters} from 'vuex'
    import {getStorage} from '@/utils/storage'
    import {getByCode, basicChemicalsList} from '@/api/industry'
    import {fetchListUserCamera, saveLadeSite,fetchLadeSiteInfo,fetchListSiteCamera} from '@/api/courseMonitor/loadingManagement';

    export default {
        name: 'EditLoadingDockDetail',
        props: ['ladeSiteInfo'],
        components: {CommonSubtitle},
        data() {
            return {
                loading: false,//loading 效果
                form: {
                    id: null,
                    name: '',//装卸位名称
                    companyName: '',//企业名称
                    des: '',//备注
                    status: null,//运营状态
                    type: null,//装卸类型
                    model: null,//装卸方式
                    chemicalId: [],//危化品数组
                    companyId: null,//公司Id
                },
                rules: {},
                isDisabled: false,//是否可编辑
                props: {
                    label: 'cameraName',
                    key: 'cameraCode'
                },
                listData: [],//摄像机列表
                videoCamera: [],//选中的摄像机点位
                userInfo: {},//用户信息
                ladeSiteStatusOptions: [],//运营状态
                ladeSiteModelOptions: [],//装卸方式
                ladeSiteTypeOptions: [],//装卸类型
                chemicalIdOptions: [],//装卸介质
            }
        },
        created() {
            //获取用户信息
            this.userInfo = getStorage('userInfo');
        },
        mounted() {
            //保存公司的id/name
            this.form.companyName = this.userInfo.companyName;
            this.form.companyId = this.userInfo.companyId;
            //获取装卸类型
            this.dictionary();
            //获取危化品名录
            this.getChemicaId();
            //获取全部摄像机点位
            this.getListSiteCamera();
            //获取装卸位详情ladeSiteInfo
            this.getLadeSiteInfo();
            //获取装卸位下的摄像机
            this.getListSiteCameraInfo();
        },
        methods: {

            //获取字典表对应的字段
            dictionary() {
                //装卸类型
                getByCode({code: 'LADE_SITE_TYPE', enable: 1}).then(res => {
                    this.ladeSiteTypeOptions = [];
                    res.data.list.map(item => {
                        this.ladeSiteTypeOptions.push(item);
                    })
                });
                //运营状态
                getByCode({code: 'LADE_SITE_STATUS', enable: 1}).then(res => {
                    this.ladeSiteStatusOptions = [];
                    res.data.list.map(item => {
                        this.ladeSiteStatusOptions.push(item);
                    })
                });
                //装卸方式
                getByCode({code: 'LADE_SITE_MODE', enable: 1}).then(res => {
                    this.ladeSiteModelOptions = [];
                    res.data.list.map(item => {
                        this.ladeSiteModelOptions.push(item);
                    })
                });
            },

            //获取危化品列表
            getChemicaId() {
                let self = this
                basicChemicalsList({}).then(res => {
                    self.chemicalIdOptions = res.data
                }).catch((err) => {
                    // 公共方法有，所以不需要加提示了
                    // this.$message.error(err.msg)
                })
            },

            //获取全部摄像机点位
            getListSiteCamera() {
                let self = this
                fetchListUserCamera({userId: this.userInfo.id}).then(res => {
                    self.listData = res.data;
                }).catch((err) => {
                })
            },

            //获取装卸位详情
            getLadeSiteInfo(){
                let self = this;
                self.loading = true;
                fetchLadeSiteInfo({id: this.ladeSiteInfo.hasOwnProperty('id')?this.ladeSiteInfo.id:null}).then(res => {
//                    self.form = res.data;
                    let value = res.data;
                    self.form.chemicalId = [];
                    //处理装卸介质数据
                    value.ladeSiteChemicalList.map(item=>{
                        self.form.chemicalId.push(item.chemicalId)
                    });
                    //将form 中的变量赋值
                    Object.keys(this.form).map((key)=>{
                        if(key !== 'chemicalId'){
                            this.form[key] = value[key];
                        }
                    });
                    self.loading = false;
                }).catch((err) => {
                    self.loading = false;
                })
            },

            //获取该装卸位下的摄像机
            getListSiteCameraInfo(){
                let self = this;
                fetchListSiteCamera({siteId: this.ladeSiteInfo.hasOwnProperty('id')?this.ladeSiteInfo.id:null}).then(res => {
                    self.videoCamera = [];
                    res.data.map((item)=>{
                        self.videoCamera.push(item.cameraCode)
                    });
                }).catch((err) => {
                })
            },


            //保存
            onSubmit() {
                let self = this;
                this.loading = true;
                let params = {
                    ...this.form,
                    cameraCode: this.videoCamera.join(','),
                    chemicalId: this.form.chemicalId.join(','),
                };
                saveLadeSite(params).then(res => {
                    self.$message.success('保存成功！');
                    self.loading = false;
                    setTimeout(() => {
                        self.cancelDetail();
                    }, 1000)
                }).catch(err => {
                    self.loading = false;
                });

            },

            //取消
            cancelDetail() {
                this.$emit('toggleLoadingDockDetail', 'edit')
            },
            //穿梭框
            //到左边、到右边
            handleChange(value, direction, movedKeys) {
//                console.log('change',value, direction, movedKeys);
//                console.log('value',this.videoCamera);
            },
            //清空所选
            clear: function () {
                this.videoCamera = [];
            },
            /*//点击保存
            saveDevice:function () {
            }
*/
        },
    }
</script>
<style lang="scss" type="text/scss" scoped>
    .demo-form-inline-input {
        /deep/ .el-input {
            width: 100% !important;
        }
        /deep/ .el-select {
            width: 100%;
        }
    }

    .box-card-title {
        padding: 10px 20px;
        font-size: 14px;
        border-radius: 4px;
        font-weight: bold;
        border: 1px solid #dcdfe6;
        text-align: center;
        box-sizing: border-box;
        line-height: 1;
        display: inline-block;
        margin-left: 20px;
    }

    //列表样式
    .list-main {
        padding: 0;
        margin-left: 10px;
        //内容样式
        .el-card {
            background-color: rgba(0, 0, 0, 0.03);
        }
    }

    //弹出框样式
    /deep/ .el-dialog__body {
        padding: 20px 40px 20px 20px !important;
    }

    /deep/ .el-dialog__header {
        background-color: #304156;
        color: #fff;
        padding: 13px 20px;
    }

    /deep/ .el-dialog__header .el-dialog__headerbtn {
        top: 10px
    }

    //穿梭框
    .transfer-content {
        text-align: center;
        /deep/ .el-transfer-panel {
            text-align: left;
            width: 300px;
        }
        /deep/ .el-button {
            display: block;
            margin: 10px 0;
        }
        .el-transfer-panel__list {
            overflow-x: auto;
        }
        .el-transfer-panel__item.el-checkbox .el-checkbox__label {
            overflow: visible;
        }
        /deep/ .el-transfer-panel__footer {
            line-height: 40px;
            /deep/ .el-button {
                display: inline-block;
                margin: 0 0 0 15px;
                padding: 6px 5px
            }
        }
        /deep/ .el-transfer-panel .el-transfer-panel__header {
            background-color: #ffffff;
        }
    }


</style>
