<template>
    <div class="container">
        <el-tabs type="border-card" editable @edit="handleTabsEdit" v-model="editableTabsValue" >
            <el-tab-pane label="应急资源仓库" name="warehouse">
                <warehouse-table ref="warehouse" :type="editableTabsValue" :handleEdit="true"></warehouse-table>
            </el-tab-pane>
            <el-tab-pane label="应急队伍" name="team">
                <team-table ref="team" :type="editableTabsValue" :handleEdit="true"></team-table>
            </el-tab-pane>
            <el-tab-pane label="应急人员"  name="person" >
                <person-table ref="person" :type="editableTabsValue" :handleEdit="true"></person-table>
            </el-tab-pane>
            <el-tab-pane label="应急资源"  name="resources" >
                <resources-table ref="resources" :type="editableTabsValue" :handleEdit="true"></resources-table>
            </el-tab-pane>
            <el-tab-pane label="专家库"  name="expert" >
                <expert-table ref="expert" :type="editableTabsValue" :handleEdit="true"></expert-table>
            </el-tab-pane>
            <el-tab-pane label="外部资源"  name="external" >
                <external-table ref="external" :type="editableTabsValue" :handleEdit="true"></external-table>
            </el-tab-pane>
        </el-tabs>
        <el-dialog v-if="warehouseTableVisible"  :visible.sync="warehouseTableVisible" width="950px" append-to-body :close-on-click-modal="false">
            <div slot="title">
                <span style="padding-right: 10px;">添加{{tableTabsOptions[dialogTableValue]}}</span>
            </div>
            <associated-resources-dialog :dialogTableValue = dialogTableValue @closeDialog = closeDialog></associated-resources-dialog>

        </el-dialog>
    </div>
</template>

<script>
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import Pagination from '@/components/Pagination'
    import AssociatedResourcesDialog from './associated-resources-dialog.vue'
    import warehouseTable from './table/warehouse-table.vue'
    import teamTable from './table/team-table.vue'
    import personTable from './table/person-table.vue'
    import resourcesTable from './table/resources-table.vue'
    import expertTable from './table/expert-table.vue'
    import externalTable from './table/external-table.vue'
    import {mapGetters} from 'vuex'


    export default {
        name: "driverLicense",
        props: ['isDisabled', 'carInfo'],
        components: {ElImageViewer,Pagination,AssociatedResourcesDialog,warehouseTable,teamTable,personTable,resourcesTable,expertTable,externalTable},
        data() {
            return {
                editableTabsValue:'warehouse',//关联资源tab选中值
                dialogTableValue:'warehouse',
                warehouseTableVisible:false,
                tableTabsOptions:{
                    warehouse:'应急资源仓库',
                    team:'应急队伍',
                    person:'应急人员',
                    resources:'应急资源',
                    expert:'专家库',
                    external:'外部资源',

                },//tab键中英文互换
            }
        },
        computed: {
            ...mapGetters([
                'tableType',
                'tableCurrentData'
            ]),
        },
        watch:{
            'tableCurrentData':{
                deep:true,
                handler(newValue){
                    //深度监听，判断弹窗里保存的选中的表格数据是否改变
                    this.$refs[this.tableType].list = this.tableCurrentData;
                    this.$refs[this.tableType].total = 0;
                },
//                immediate: true, // immediate选项可以开启首次赋值监听
            }
        },
        methods: {
            //点击tab键弹窗，targetName：点击tab键的弹窗；action事件类型
            handleTabsEdit(targetName, action) {
                this.warehouseTableVisible = true;
                this.dialogTableValue = targetName;
                console.log('targetName',targetName,action)

            },
            //重置
            resetTab(){
                const keys = Object.keys(this.tableTabsOptions);
                //置空所有tab下的选中后的表格
                keys.map((item)=>{
                    this.$refs[item].list = [];
                })

            },
            //保存时的数据
            submitTab(){
                const keys = Object.keys(this.tableTabsOptions);
                let resourcesParams = {};
                //置空所有tab下的选中后的表格
                keys.map((item)=>{
                    //将数据处理成对象属性格式（team属性名：[]）
                    resourcesParams[item] = this.$refs[item].list
                });
                return resourcesParams;
            },
            //关闭弹窗
            closeDialog(){
                this.warehouseTableVisible = false;
            }
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    .container {
        padding: 10px;
    }

    //弹出框样式
    /deep/.el-dialog__body{
        padding: 20px !important;
    }
    /deep/ .el-dialog__header {
        background-color: #304156;
        color: #fff;
        padding: 13px 20px;
    }
    /deep/.el-dialog__header .el-dialog__headerbtn{
        top:10px
    }
</style>
