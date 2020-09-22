<template>
    <div class="mask-add-edit-manage" id="mask">
        <div class="mask-content" id="mask-content">
            <div class="info">
                <el-form v-loading="loading" :model="form" :rules="rules" ref="form" class="demo-form-inline" label-position="right" label-width="120px">
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
                                    <el-select v-model="form.chemicalId" type="textarea" multiple filterable :disabled="isDisabled"
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
                        <div class="box-card-title" >关联摄像机</div>
                        <el-card class="box-card" style="margin-left: 20px;margin-top: 10px">
                                <!-- 表格开始 -->
                                <el-table
                                        :data="tableList"
                                        border
                                        fit
                                        highlight-current-row
                                        style="width: 100%;margin-top: 13px;"
                                >
                                    <el-table-column label="序号" type="index" align="center" width="80px">
                                        <template slot-scope="row">{{ row.$index + 1 }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="摄像机名称" header-align="center" align="center">
                                        <template slot-scope="{row}">{{row.cameraName}}</template>
                                    </el-table-column>
                                    <el-table-column
                                            label="操作"
                                            align="center"
                                            width="100"
                                            class-name="small-padding fixed-width"
                                    >
                                        <template slot-scope="{row}">
                                            <i class="icon iconfont iconshipinbofangyingpian2" style="cursor: pointer" title="实时视频" @click="showDetail(row)"></i>
                                            <!--<i class="el-icon-edit-outline" style="font-size: 18px" @click="showDetail(row)"></i>-->
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <pagination
                                        v-show="total >0"
                                        :total="total"
                                        :page.sync="listQuery.page"
                                        :limit.sync="listQuery.size"
                                        style="padding:0px !important"
                                        class="pagination"
                                        @pagination="getListSiteCameraInfo"
                                        :pageSizes="[5]"
                                />

                        </el-card>
                    </div>

                    <div style="text-align: center;margin-top: 20px" class="form-item-btn">
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                        <el-button @click="cancelDetail">取消</el-button>
                    </div>
                </el-form>

            </div>
        </div>
        <el-dialog v-if="videoTracingVisible" :visible.sync="videoTracingVisible" width="850px" append-to-body  :before-close="beforeCloseDialog" >
            <div slot="title">
                <span style="padding-right: 10px;">实时视频</span>
            </div>
            <video-tracing ref="videoTracing" :videoCameraInfo=videoCameraInfo ></video-tracing>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import CommonSubtitle from '@/components/CommonSubtitle'
    import { mapGetters } from 'vuex'
    import VideoTracing from './videoTracing'
    import Pagination from '@/components/Pagination'

    import {getStorage} from '@/utils/storage'
    import {getByCode, basicChemicalsList} from '@/api/industry'
    import {fetchListUserCamera, saveLadeSite,fetchLadeSiteInfo,fetchPageSiteCamera} from '@/api/courseMonitor/loadingManagement';

    export default {
        name: 'LoadingDockDetail',
        props: ['ladeSiteInfo'],
        components: {CommonSubtitle,VideoTracing,Pagination},
        data() {
            return {
                loading:false,//loading 效果
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
                tableList:[],//摄像机列表

                videoCamera: [],//选中的摄像机点位
                userInfo: {},//用户信息
                ladeSiteStatusOptions: [],//运营状态
                ladeSiteModelOptions: [],//装卸方式
                ladeSiteTypeOptions: [],//装卸类型
                chemicalIdOptions: [],//装卸介质
                videoTracingVisible:false,  //是否展示视频追溯
                isDisabled:true,//是否可编辑

                listQuery: {
                    page: 1,
                    size: 5,
                },
                total:0,
                videoCameraInfo:{},//摄像机信息


            }
        },
        created() {
            //获取用户信息
            this.userInfo = getStorage('userInfo');
        },
        mounted(){
            //保存公司的id/name
            this.form.companyName = this.userInfo.companyName;
            this.form.companyId = this.userInfo.companyId;
            //获取装卸类型
            this.dictionary();
            //获取危化品名录
            this.getChemicaId();
            //获取装卸位详情ladeSiteInfo
            this.getLadeSiteInfo();
            //获取装卸位下的摄像机(分页)
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
                this.loading = true;
                fetchPageSiteCamera({siteId: this.ladeSiteInfo.hasOwnProperty('id')?this.ladeSiteInfo.id:null,...this.listQuery}).then(res => {
                    self.tableList=res.data.list;
                    self.total=res.data.total;
                    self.loading = false;
                }).catch((err) => {
                    self.loading = false;
                })
            },

            //确定
            onSubmit(){
                this.cancelDetail();
            },
            //查看
            showDetail(data){
                this.videoTracingVisible = true;
                this.videoCameraInfo = data;
            },
            cancelDetail(){
                this.$emit('toggleLoadingDockDetail','view')
            },
            //关闭弹窗前执行
            beforeCloseDialog(done){
                //关闭视频播放openOrCloseLoading
                this.$refs['videoTracing'].closeVideoWindow();
                done()
            },
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
    .box-card-title{
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
            /deep/ .el-table th {
                background-color: #308FE4;
                color: #fff;
            }
        }

        /*.el-card.is-always-shadow {
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        }*/
    }
    //弹出框样式
    /deep/.el-dialog__body{
        padding: 20px 8px 20px 20px!important;
    }
    /deep/ .el-dialog__header {
        background-color: #304156;
        color: #fff;
        padding: 13px 20px;
    }
    /deep/.el-dialog__header .el-dialog__headerbtn{
        top:10px
    }

    .pagination {
        background-color:rgba(0,0,0,0.003) ;
        /deep/ .el-pagination {
            display: flex;
            justify-content: center;
        }
        /deep/.el-pagination.is-background .btn-prev, /deep/.el-pagination.is-background .btn-next{
            background-color: #ffffff;
        }
    }


</style>
