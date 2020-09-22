<template>
    <div>
        <warehouse-table v-if="dialogTableValue==='warehouse'" ref="warehouse" :handleEdit="false"
                         :type="dialogTableValue"></warehouse-table>
        <team-table v-if="dialogTableValue==='team'" ref="team" :type="dialogTableValue"
                    :handleEdit="false"></team-table>
        <person-table v-if="dialogTableValue==='person'" ref="person" :type="dialogTableValue"
                      :handleEdit="false"></person-table>
        <resources-table v-if="dialogTableValue==='resources'" ref="resources" :type="dialogTableValue"
                         :handleEdit="false"></resources-table>
        <expert-table v-if="dialogTableValue==='expert'" ref="expert" :type="dialogTableValue"
                      :handleEdit="false"></expert-table>
        <external-table v-if="dialogTableValue==='external'" ref="external" :type="dialogTableValue"
                        :handleEdit="false"></external-table>
        <el-row>
            <div class="margin-td-10" style="text-align: center; width: 100%;">
                <el-button @click="resetForm">重 置</el-button>
                <el-button type='primary' @click="submitForm">保存</el-button>
            </div>
        </el-row>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import warehouseTable from './table/warehouse-table.vue'
    import teamTable from './table/team-table.vue'
    import personTable from './table/person-table.vue'
    import resourcesTable from './table/resources-table.vue'
    import expertTable from './table/expert-table.vue'
    import externalTable from './table/external-table.vue'

    export default {
        name: "driverLicense",
        props: ['isDisabled', 'dialogTableValue'],
        components: {
            Pagination,
            warehouseTable,
            teamTable,
            personTable,
            resourcesTable,
            expertTable,
            externalTable
        },
        data() {
            return {}
        },
        methods: {
            //保存
            submitForm() {
//                console.log('111111111111',this.$refs[this.dialogTableValue].tableSelection);
                //记录关联资源中，添加所选择的应急资源类型tableType，弹窗中所选择的列表信息tableCurrentData（为了方便本地保存）
                this.$store.dispatch("emergencyManagement/setTableCurrentData", {
                    tableType: this.dialogTableValue,
                    tableCurrentData: this.$refs[this.dialogTableValue].tableSelection
                });
                //延时关闭弹窗
                setTimeout(()=>{
                    this.$emit('closeDialog');
                },500);
            },
            //重置：清除表单数据
            resetForm() {
                this.$refs[this.dialogTableValue].handleClearSelection();
            },

        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    .container {
        padding: 10px;
        position: relative;
        .qualify-item {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .tag-wrap {
            position: absolute;
            top: 0;
            right: 0;
        }
        .text-area {
            width: 100%;
            /deep/ .el-form-item__content {
                width: calc(100% - 150px);
            }
        }
        /deep/ .el-textarea {
            width: 97%;
        }
        .file-item {
            display: inline-block;
            float: left;
            margin-right: 15px;
        }
        /*上传附件的样式*/
        .upload-item {
            width: 97%;
            .upload-demo {
                width: 100%;
                /deep/ .el-upload {
                    width: 100%;
                    & > .el-upload-dragger {
                        width: 100%;
                    }
                }
            }
        }
    }

    /deep/ .el-form-item {
        width: calc(33% - 20px) !important;
    }

    .text-area {
        width: 100% !important;
        /deep/ .el-form-item__content {
            width: calc(100% - 130px) !important;
        }
    }

    .fa-border {
        padding-right: 15px;
    }
</style>
