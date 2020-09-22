<template>
    <div class="app-container" style="background: #FEFEFE;">
        <el-container>
            <el-main style="padding: 0 10px 10px;">
                <el-row>
                    <span style="margin-right: 10px">考核项目:</span>
                    <el-button
                            :type="clickId === item.id ? 'primary': null"
                            v-for="(item,idx) in projectList"
                            :key="item.id"
                            icon="el-icon-menu"
                            style="margin-top: 10px;"
                            @click="changeId(item)"
                    >
                        {{item.appraiseDes}}
                    </el-button>
                </el-row>
                <el-main style="padding: 10px 0;">
                    <el-table
                            class="common-table"
                            v-loading="treeLoading"
                            :data="tableList"
                            border
                            fit
                            :span-method="objectSpanMethod"
                            style="width: 100%;margin-top: 15px"
                    >
                        <el-table-column label="文件名称" type="index" align="center" width="130px">
                            <template slot-scope="{row}">
                                {{Number(row.grandParentInfo.appraiseTotalScore) > 0 ? row.fileName + '（' +
                                row.grandParentInfo.appraiseTotalScore + '分）' : row.fileName}}
                            </template>
                        </el-table-column>
                        <el-table-column label="考核内容" header-align="center" align="center" min-width="20%">
                            <template slot-scope="{row}">
                                {{Number(row.parentInfo.appraiseTotalScore) > 0 ? row.checkContent + '（' +
                                row.parentInfo.appraiseTotalScore + '分）' : row.checkContent}}
                            </template>
                        </el-table-column>
                        <el-table-column label="评分标准" header-align="center" align="left" min-width="50%">
                            <template slot-scope="{row}">{{row.selfTableId + '.' + row.markStandard}}</template>
                        </el-table-column>

                        <el-table-column label="企业自评是否涉及" header-align="center" align="center" width="100px">
                            <template slot-scope="{row}">
                                <el-checkbox disabled v-model="row.isCompanySelected"
                                             @change="(val)=>selectedChange(val,row)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="企业自评频次" header-align="center" align="center" min-width="14%"
                                         v-if="this.clickId !== 1">
                            <template slot-scope="{row}">
                                <el-input-number v-if="Number(row.info.appraiseType) === 3" v-model="row.companyRate"
                                                 controls-position="right"
                                                 @change="(newValue,oldValue)=>rateChange(newValue,oldValue,row)"
                                                 :min="0"
                                                 style="width: 100%;"
                                                 disabled
                                ></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column label="企业自评得分" header-align="center" align="center" width="100px"
                                         v-if="this.clickId !== 1">
                            <template slot-scope="{row}">{{clickId === 2 ? Number(row.parentInfo.showCompanyTotalScore)
                                : Number(row.grandParentInfo.showCompanyTotalScore)}}
                            </template>
                        </el-table-column>

                        <el-table-column label="主管部门初评是否涉及" header-align="center" align="center" width="120px">
                            <template slot-scope="{row}">
                                <el-checkbox :disabled="formStatus === 'view'" v-model="row.isSelected"
                                             @change="(val)=>selectedChange(val,row)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="主管部门初评频次" header-align="center" align="center" min-width="14%"
                                         v-if="this.clickId !== 1">
                            <template slot-scope="{row}">
                                <el-input-number v-if="Number(row.info.appraiseType) === 3" v-model="row.rate"
                                                 controls-position="right"
                                                 @change="(newValue,oldValue)=>rateChange(newValue,oldValue,row)"
                                                 :min="0"
                                                 style="width: 100%;"
                                                 :disabled="formStatus === 'view'"
                                ></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column label="主管部门初评得分" header-align="center" align="center" width="100px"
                                         v-if="this.clickId !== 1">
                            <template slot-scope="{row}">{{clickId === 2 ? Number(row.parentInfo.showTotalScore) :
                                Number(row.grandParentInfo.showTotalScore)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="建议扣分" header-align="center" align="center" min-width="14%"
                                         v-if="this.clickId !== 1">
                            <template slot-scope="{row}">
                                <span :style="row.adviceRate > 0 ? 'color:red':''">  {{row.adviceRate}} </span>

                            </template>
                        </el-table-column>

                    </el-table>
                </el-main>
                <el-row class="submit-btn" v-if="formStatus === 'add'">
                    <el-button
                            type="primary"
                            style="margin-top: 10px;"
                            @click="submitList"
                    >
                        提交
                    </el-button>
                </el-row>
                <el-row class="submit-btn" v-if="formStatus === 'view'">
                    <el-button
                            type="primary"
                            style="margin-top: 10px;"
                            @click="showResults('company')"
                    >
                        企业自评结果
                    </el-button>
                    <el-button
                            style="margin-top: 10px;margin-left: 30px"
                            @click="showResults('department')"
                    >
                        部门初评结果
                    </el-button>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import CommonSubtitle from '@/components/CommonSubtitle'
    import Pagination from '@/components/Pagination'
    import {
        getSysPathTree,
        getSysPathDetail,
        saveSysPath,
        deleteSysPath,
        getRoleList
    } from '@/api/evaluateAnalysis/checkIndicator'
    import {mapGetters} from 'vuex'

    export default {
        name: 'EAEnterpriseSelfAssessmentCheckScale',
        components: {Pagination, CommonSubtitle},
        data() {
            return {
                treeLoading: false,     //获取树和表格的状态
                projectList: [
                    {
                        appraiseCode: "rejectionOpt",
                        appraiseDes: "否决项",
                        appraiseLevel: 1,
                        appraiseTotalScore: 0,
                        appraiseType: "-1",
                        appraiseUnitScore: 0,
                        code: "rejectionOpt",
                        displayOrder: 1,
                        id: 1,
                        parentId: 0,
                        isSelected: true,
                        remarkDes: "",
                        nodes: [],
                    }
                ],        //考核项目的列表
                tableList: [
                    /*{
                        id: '1',
                        fileName: '企业资质',
                        checkContent: '经营资质符合性10',
                        markStandard: '《道路运输经营许可证》与《营业执照》所载的法定代表人、名称、地址等信息不一致的，扣10分；',
                        isSelected: true,
                        rate: '',
                        score: '',
                    },
                    {
                        id: '2',
                        fileName: '企业资质',
                        checkContent: '经营资质符合性20',
                        markStandard: '实际地址与许可证件所载信息不一致的，扣10分。',
                        isSelected: true,
                        rate: '',
                        score: '',
                    },
                    {
                        id: '3',
                        fileName: '企业资质',
                        checkContent: '安全生产管理机构设置和人 配备情况',
                        markStandard: '未按规定设置安全管理机构或配备相应管理人员的，扣20分。',
                        isSelected: true,
                        rate: '',
                        score: '',
                    },
                    {
                        id: '4',
                        fileName: '企业资质',
                        checkContent: '主要负责人、安全生产管理人员安全生产知识和管理能力考核',
                        markStandard: '主要负责人（法定代表人、实际控制人，以及分支机构的法定代表人、实际控制人）、安全生产管理人员（专职安全生产管理人员、分管安全生产的负责人）在从事相关工作6个月内未取得市交通运输局制发的考核合格证明（证书）或考核合格证明（证书）超出有效期的，每缺一人扣10分。',
                        isSelected: true,
                        rate: '',
                        score: '',
                    },
                    {
                        id: '5',
                        fileName: '企业资质',
                        checkContent: '办公场地和停车场地',
                        markStandard: '办公场地、停车场地须提供房屋及场地自主产权证书或租借合同文本原件及相应图片资料，每缺一项扣40分；',
                        isSelected: true,
                        rate: '',
                        score: '',
                    },
                    {
                        id: '6',
                        fileName: '企业资质',
                        checkContent: '办公场地和停车场地',
                        markStandard: '具有剧毒化学品、爆炸品运输车辆，未设立专用停车区域的，扣40分；',
                        isSelected: true,
                        rate: '',
                        score: '',
                    },
                    {
                        id: '7',
                        fileName: '企业资质',
                        checkContent: '办公场地和停车场地',
                        markStandard: '未设立安全管理规定，安全标识，安全告示，限速标志的，每缺一项扣40分；',
                        isSelected: true,
                        rate: '',
                        score: '',
                    },
                    {
                        id: '8',
                        fileName: '企业资质',
                        checkContent: '办公场地和停车场地',
                        markStandard: '停车场地未封闭的，扣40分；',
                        isSelected: true,
                        rate: '',
                        score: '',
                    },
                    {
                        id: '9',
                        fileName: '企业资质',
                        checkContent: '办公场地和停车场地',
                        markStandard: '妨碍居民生活或威胁公共安全的，扣40分。',
                        isSelected: true,
                        rate: '',
                        score: '',
                    },*/
                ],          //项目下对应的列表的状态
                clickId: null,     //默认选中的project的id
                treeData: [],       //树结构数据
                lastTreeLevelContent: [],   //最后一级的树结构
                rateList: {     //部门频次数组
//                    id : value
//                    173:25
                },
                companyRateList: {//企业自评频次数组
                    173: 2
                },
                //企业自评-是否涉及的数组
                isCompanySelectedList: {
//                    1: true,
//                    2: false,
                    173: true
                },
                //部门初评-是否涉及的数组
                isSelectedList: {
//                    1: true,
//                    2: false,
//                    173:true
                },
                //建议扣分
                adviceRateList: {
                    173: 23
                },
                //是加分项目还是减分项目
                projectType: 'deduction', //add为加分，不是add就是减分

                //后端返回的
                b: [
                    {
                        id: 1,
                    },
                    {
                        id: 2,
                    }
                ],


            }
        },
        computed: {
            ...mapGetters([
                'formStatus'
            ]),
        },
        watch: {},
        created() {
            this.getTree(null);
        },
        mounted() {
            //如果是查看，要获取分数信息，计算分数
            if (this.formStatus === 'view') {
                this.initData();
            }

        },
        methods: {
            //初始化数据
            initData(){
                //请求接口，赋值

                //获取分数信息，计算分数
                this.calcShowTotalScore();
            },
            //获取菜单树结构
            getTree(id) {
                this.treeLoading = true;
                getSysPathTree({id}).then(res => {
                    this.treeLoading = false;
                    //如果id不为空，就代表能查到树的后级
                    if (id) {
//                        this.tableList = res.data;
                        //将树增加显示分数
                        this.treeData = this.addTreeShowScore(res.data);
                        //根据树所有最后一级造表格
                        this.tableList = this.makeAllLastLevelTree(this.treeData);
                        //计算企业自评得分
                        this.calcShowCompanyTotalScore();
//                        this.calcShowTotalScore();

                    } else {
                        this.projectList = res.data;
                        this.changeId(res.data[0])
                    }
                }).catch(err => {
                    self.treeLoading = false;
                });
            },

            //将树的第二级和第三级添加上showTotalScore
            addTreeShowScore(data) {
                return data.map(val => {
                    if (val.nodes) {
                        val.nodes = this.addTreeShowScore(val.nodes)
                    }
                    //第二级和第三级进行处理
                    switch (val.appraiseLevel) {
                        case 2:
                            return {
                                ...val,
                                showTotalScore: Number(val.nodes[0].nodes[0].appraiseType) === 4 ? 0 : val.appraiseTotalScore,  //表格最后一列展示的分数
                                showCompanyTotalScore: Number(val.nodes[0].nodes[0].appraiseType) === 4 ? 0 : val.appraiseTotalScore  //表格最后一列展示的分数
                            };
                            break;
                        case 3 :
                            return {
                                ...val,
                                showTotalScore: Number(val.nodes[0].appraiseType) === 4 ? 0 : val.appraiseTotalScore, //表格最后一列展示的分数
                                showCompanyTotalScore: Number(val.nodes[0].appraiseType) === 4 ? 0 : val.appraiseTotalScore  //表格最后一列展示的分数
                            };
                            break;
                        default:
                            //如果是第四级并且appraiseType为4，这说明是加分项目，得分必须是0分开始
                            if (val.appraiseLevel === 4 && Number(val.appraiseType) === 4) {
                                this.projectType = 'add'
                            }
                            return {
                                ...val
                            }
                    }
                })
            },

            //根据树所有最后一级造表格
            makeAllLastLevelTree(tree) {
                //最后树的所有的最后一级的结果
                let LastTreeLevelContent = [];
                //递归遍历
                tree.map((val, index) => {
                    //如果有节点，说明不是最后一级，需要递归遍历
                    if (val.nodes) {
                        this.makeAllLastLevelTree(val.nodes).map((item, idx) => {
                            LastTreeLevelContent.push({
                                ...item,
                            })
                        })
                    } else {
                        let parentInfo = this.findTreeInfo(this.treeData, val.parentId);
                        let grandParentInfo = this.findTreeInfo(this.treeData, parentInfo.parentId);
                        //最后一级的时候的结果
                        LastTreeLevelContent.push({
                            info: {...val},
                            id: val.id,
                            markStandard: val.appraiseDes,
                            selfTableId: index + 1,
                            parentInfo,
                            grandParentInfo,
                            //是否涉及
//                            isSelected: this.isSelectedList[val.id] ? this.isSelectedList[val.id] : false,
                            //企业自评是否涉及
                            isCompanySelected: this.isCompanySelectedList[val.id] ? this.isCompanySelectedList[val.id] : false,
                            //部门初评是否涉及
                            isSelected: this.isSelectedList[val.id] ? this.isSelectedList[val.id] : false,
                            //选择频率
                            companyRate: this.companyRateList[val.id] ? this.companyRateList[val.id] : 0,
                            //部门频次
                            rate: this.rateList[val.id] ? this.rateList[val.id] : 0,

                            //建议扣分
                            adviceRate: this.adviceRateList[val.id] ? this.adviceRateList[val.id] : 0,

                            appraiseType: val.appraiseType,//考核类型
                            checkContent: parentInfo.appraiseDes,//父亲考核项描述
                            fileName: grandParentInfo.appraiseDes,//爷爷考核项描述
                        });
                    }
                });
                return LastTreeLevelContent
            },

            //根据当前id，获取到对应id的层级信息
            findTreeInfo(tree, id) {
                for (let i = 0; i < tree.length; i++) {
                    if (id === tree[i].id) {
                        return tree[i]
                    }
                    if (tree[i].nodes) {
                        let findResult = this.findTreeInfo(tree[i].nodes, id);
                        if (findResult) {
                            return findResult;
                        }
                    }
                }
            },

            //改变选中的项目，切换列表
            changeId(data) {
                this.projectType = 'deduction';
                this.clickId = data.id;
                this.getTree(data.id);
            },

            //是否涉及选择框改变
            selectedChange(checked, row) {
                //更改是否涉及列表的值，为了传给后端
//                this.isSelectedList[row.id] = checked;
                this.isSelectedList[row.id] = checked;
                //修改table列表
                this.tableList.map(val => {
                    if (val.id === row.id) {
//                        val.isSelected = checked;
                        val.isSelected = checked;
                    }
                });
                //每次变化需要重新计算值
                this.calcShowTotalScore(row);
            },

            //频次改变计算
            rateChange(newValue, oldValue, row) {
                //更改频次列表的值，为了传给后端
                this.rateList[row.id] = newValue !== undefined ? newValue : 0;
                //修改table列表
                this.tableList.map(val => {
                    if (val.id === row.id) {
                        val.rate = newValue !== undefined ? newValue : 0;
                    }
                });
                //如果是选中状态，那么需要重新计算分，如果不是选中状态，那么不需要重新计算分
                /*if(this.isSelectedList[row.id]){
                    this.calcShowTotalScore(row)
                }*/
                //部门初评是否不涉及
                if (this.isSelectedList[row.id]) {
                    this.calcShowTotalScore(row)
                }

            },

            //重新计算得分项
            calcShowTotalScore() {
                //选中的需要计算扣分的所有表格的父亲的列表
                let uniqSelectedParentList = this.$lodash.uniq(this.$lodash.filter(this.tableList, function (o) {
//                    return o.isSelected;
                    return o.isSelected;
                }).map(val => {
                    return this.clickId === 2 ? val.parentInfo.id : val.grandParentInfo.id
                }));
                this.treeData.map(val => {
                    //判断是否是计分项(为了过滤出否决项)
                    if (val.appraiseType === '0') {
                        //clickId为2（基础管理）的是获取所有儿子节点，所有不为2的是获取孙子节点
                        if (this.clickId !== 2) {
                            if (uniqSelectedParentList.indexOf(val['id']) !== -1) {
                                //遍历获取所有孙子节点的id值
                                let keys = [];
                                val.nodes.map(node => {
                                    node.nodes.map(j => {
                                        keys.push(j.id)
                                    })
                                });
                                //需要扣除的分数
                                let score = 0;
                                //每操作一次，都要根据当前行，计算其父亲需要一共扣除的分数
                                keys.map(key => {
                                    if (this.isSelectedList[key]) {
                                        this.tableList.map(item => {
                                            //找到表格中当前子内容的分数
                                            if (item.id === key) {
                                                //需要扣除的分数(选择扣分项为2 次数扣分项为3 加分项4；如果类型为4，那么就是加分项)
                                                score = score + (Number(item.appraiseType) === 2 ? item.info.appraiseUnitScore : Number(item.appraiseType) === 3 ? item.info.appraiseUnitScore * item.rate : Number(item.appraiseType) === 4 ? item.info.appraiseUnitScore : 0 )
                                            }
                                        })
                                    }
                                });
                                //当前展示的值，判断是否超过总分,如果加分超过总分，那么只能是当前总分，如果扣分超过总分，最低为0
                                val.showTotalScore = this.projectType === 'add' ?
                                    score >= val.appraiseTotalScore ? val.appraiseTotalScore : score
                                    :
                                    (val.appraiseTotalScore - score) < 0 ? 0 : (val.appraiseTotalScore - score) > val.appraiseTotalScore ? val.appraiseTotalScore : (val.appraiseTotalScore - score);
                            } else {
                                //还要判断是加分项还是减分项，如果是加分项目，初始值为0
                                val.showTotalScore = this.projectType === 'add' ? 0 : val.appraiseTotalScore;
                            }
                        } else {
                            //遍历重新造显示的分数
                            val.nodes.map(item => {
                                //判断3级是否包含选中的，如果包含选中的需要进行计算，不包含的就是默认的分
                                if (uniqSelectedParentList.indexOf(item['id']) !== -1) {
                                    //所有子节点
                                    let keys = item.nodes.map(node => {
                                        return node.id
                                    });
                                    //需要扣除的分数
                                    let score = 0;
                                    //每操作一次，都要根据当前行，计算其父亲需要一共扣除的分数
                                    keys.map(key => {
                                        if (this.isSelectedList[key]) {
                                            this.tableList.map(item => {
                                                //找到表格中当前子内容的分数
                                                if (item.id === key) {
                                                    //需要扣除的分数
                                                    score = score + (Number(item.appraiseType) === 2 ? item.info.appraiseUnitScore : Number(item.appraiseType) === 3 ? item.info.appraiseUnitScore * item.rate : Number(item.appraiseType) === 4 ? -item.info.appraiseUnitScore * item.rate : 0 )
                                                }
                                            })
                                        }
                                    });
                                    //当前展示的值，判断是否超过总分,如果加分超过总分，那么只能是当前总分，如果扣分超过总分，最低为0
                                    item.showTotalScore = (item.appraiseTotalScore - score) < 0 ? 0 : (item.appraiseTotalScore - score) > item.appraiseTotalScore ? item.appraiseTotalScore : (item.appraiseTotalScore - score);
                                } else {
                                    item.showTotalScore = item.appraiseTotalScore;
                                }
                            })
                        }
                    }
                })
            },
            //计算企业自评得分
            calcShowCompanyTotalScore() {
                //选中的需要计算扣分的所有表格的父亲的列表
                let uniqSelectedParentList = this.$lodash.uniq(this.$lodash.filter(this.tableList, function (o) {
                    return o.isCompanySelected;
                }).map(val => {
                    return this.clickId === 2 ? val.parentInfo.id : val.grandParentInfo.id
                }));
                this.treeData.map(val => {
                    //判断是否是计分项
                    if (val.appraiseType === '0') {
                        //clickId为2（基础管理）的是获取所有儿子节点，所有不为2的是获取孙子节点
                        if (this.clickId !== 2) {
                            if (uniqSelectedParentList.indexOf(val['id']) !== -1) {
                                //遍历获取所有孙子节点的id值
                                let keys = [];
                                val.nodes.map(node => {
                                    node.nodes.map(j => {
                                        keys.push(j.id)
                                    })
                                });
                                //需要扣除的分数
                                let score = 0;
                                //每操作一次，都要根据当前行，计算其父亲需要一共扣除的分数
                                keys.map(key => {
                                    if (this.isCompanySelectedList[key]) {
                                        this.tableList.map(item => {
                                            //找到表格中当前子内容的分数
                                            if (item.id === key) {
                                                //需要扣除的分数(如果类型为4，那么就是加分项)
                                                score = score + (Number(item.appraiseType) === 2 ? item.info.appraiseUnitScore : Number(item.appraiseType) === 3 ? item.info.appraiseUnitScore * item.companyRate : Number(item.appraiseType) === 4 ? item.info.appraiseUnitScore : 0 )
                                            }
                                        })
                                    }
                                });
                                //当前展示的值，判断是否超过总分,如果加分超过总分，那么只能是当前总分，如果扣分超过总分，最低为0
                                val.showCompanyTotalScore = this.projectType === 'add' ?
                                    score >= val.appraiseTotalScore ? val.appraiseTotalScore : score
                                    :
                                    (val.appraiseTotalScore - score) < 0 ? 0 : (val.appraiseTotalScore - score) > val.appraiseTotalScore ? val.appraiseTotalScore : (val.appraiseTotalScore - score);
                            } else {
                                //还要判断是加分项还是减分项，如果是加分项目，初始值为0
                                val.showCompanyTotalScore = this.projectType === 'add' ? 0 : val.appraiseTotalScore;
                            }
                        } else {
                            //遍历重新造显示的分数
                            val.nodes.map(item => {
                                //判断3级是否包含选中的，如果包含选中的需要进行计算，不包含的就是默认的分
                                if (uniqSelectedParentList.indexOf(item['id']) !== -1) {
                                    //所有子节点
                                    let keys = item.nodes.map(node => {
                                        return node.id
                                    });
                                    //需要扣除的分数
                                    let score = 0;
                                    //每操作一次，都要根据当前行，计算其父亲需要一共扣除的分数
                                    keys.map(key => {
                                        if (this.isCompanySelectedList[key]) {
                                            this.tableList.map(item => {
                                                //找到表格中当前子内容的分数
                                                if (item.id === key) {
                                                    //需要扣除的分数
                                                    score = score + (Number(item.appraiseType) === 2 ? item.info.appraiseUnitScore : Number(item.appraiseType) === 3 ? item.info.appraiseUnitScore * item.companyRate : Number(item.appraiseType) === 4 ? -item.info.appraiseUnitScore * item.companyRate : 0 )
                                                }
                                            })
                                        }
                                    });
                                    //当前展示的值，判断是否超过总分,如果加分超过总分，那么只能是当前总分，如果扣分超过总分，最低为0
                                    item.showCompanyTotalScore = (item.appraiseTotalScore - score) < 0 ? 0 : (item.appraiseTotalScore - score) > item.appraiseTotalScore ? item.appraiseTotalScore : (item.appraiseTotalScore - score);
                                } else {
                                    item.showCompanyTotalScore = item.appraiseTotalScore;
                                }
                            })
                        }
                    }
                })
            },

            //做表格合并
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                //相同id节点的合并
                let key = [];
                switch (columnIndex) {
                    case 0:
                        key = this.tableList.map(val => {
                            return val.grandParentInfo.id
                        });
                        break;
                    case 1:
                        key = this.tableList.map(val => {
                            return val.parentInfo.id
                        });
                        break;
                    case 5:
                        //判断是否为2，因为基础管理项目太多，需要变成跟考核内容对齐，其他的跟文件名称列对齐
                        key = this.tableList.map(val => {
                            return this.clickId === 2 ? val.parentInfo.id : val.grandParentInfo.id
                        });
                        break;
                    case 8:
                        //判断是否为2，因为基础管理项目太多，需要变成跟考核内容对齐，其他的跟文件名称列对齐
                        key = this.tableList.map(val => {
                            return this.clickId === 2 ? val.parentInfo.id : val.grandParentInfo.id
                        });
                        break;
                }
                //相同元素的首个下标
                let indexArr = this.$lodash.uniq(key).map(val => {
                    return this.$lodash.indexOf(key, val)
                });
                //增加数组的长度是为了做表格合并
                indexArr.push(this.tableList.length);

                //动态合并表格
                for (let i = 0; i < indexArr.length - 1; i++) {
                    if (rowIndex === indexArr[i]) {
                        return {
                            rowspan: indexArr[i + 1] - indexArr[i],
                            colspan: 1
                        }
                    }
                    if (rowIndex > indexArr[i] && rowIndex < indexArr[i + 1]) {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
                /* 目标：
                if (columnIndex === 0) {
                    if(rowIndex === 0){
                        return {
                            rowspan: 9,
                            colspan: 1
                        }
                    }
                    if(rowIndex > 0 && rowIndex < 9){
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }*/
            },

            //提交功能
            submitList() {
                console.log(this.isSelectedList, 'isSelectedList');
            },

            //查看时，企业自评结果、部门初评结果 跳转界面
            showResults(type) {
                switch (type) {
                    //企业自评结果
                    case 'company':
//                        this.$router.push({name: 'EAEnterpriseSelfAssessmentCheckScale'});
                        break;
                    //部门初评结果
                    case 'department':
//                        this.$router.push({name: 'EAEnterpriseSelfAssessmentApplicationForm'});
                        break;
                }
            },

        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    //内容样式

    /*.common-table th{
        background-color: #308FE4;
        color: #fff;
    }*/
    .submit-btn {
        display: flex;
        justify-content: center;
    }

    /deep/ .el-table th {
        background-color: #308FE4;
        color: #fff;
    }
</style>



