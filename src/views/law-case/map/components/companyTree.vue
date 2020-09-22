<!--右侧抽屉-->
<template>
    <div class="tab-container">
        <!-- <el-form ref="form" :model="form" label-width="100px">
             <el-form-item label="点位类型：">
                 <el-select v-model="form.pointType" placeholder="请选择活动区域" style="z-index: 60000" @change="handleChange">
                     <el-option :label="item.label" :value="item.value" v-for="item in form.pointTypes"></el-option>
                 </el-select>
             </el-form-item>
         </el-form>-->
        <div class="tree-wrapper">
            <el-autocomplete
                    class="search-node-inp"
                    size="medium"
                    v-model="filterText"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelectSearchNode"
                    clearable
            >
            </el-autocomplete>
            <el-tree
                    class="filter-tree"
                    :data="treeData"
                    ref="tree"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    node-key="code"
                    v-loading="treeLoading"
                    v-scrollBar
                    @node-click="handleNodeClick"
                    highlight-current
            >
                <span class="custom-tree-node ellipsis-l1" :title="node.label" slot-scope="{node,data}">
                  <span class="ellipsis-l1">
                      <i class="self-icon" :class="data.icon?data.icon:''"></i>{{node.label}}
                  </span>
              </span>
            </el-tree>
        </div>
    </div>
</template>
<script>
    import dfCreateTree from '../../../../components/common/createTree.vue'
    import {
        queryAreaTree,
        queryCompanyCar,
        queryCameraPoints,
        queryBayonetPoints,
        queryParkingPoints,
        queryLadeSiteArea,
        queryLadeSitePoints,
        queryBridgePoints,
        queryTunnelPoints
    } from '@/api/map'
    import {getCompanyDetail} from '@/api/industry'
    import mapShowFunc from '@/utils/mapShowFunc'

    export default {
        inject: ['handleSwitch', 'updateDefaultSelectSwitch', 'defaultSelectSwitch', 'locMarkerOpenInfoWindow'],  //注入参数
        data() {
            return {
                form: {
                    pointType: '0',   // '0' 表示不加载下级节点
                    pointTypes: [
                        {value: '1', label: '车辆'},
                        {value: '2', label: '摄像机'},
                        {value: '3', label: '进出卡口'},
                        {value: '4', label: '装卸区'},
                        {value: '5', label: '停车场'},
                        {value: '6', label: '桥梁'},
                        {value: '7', label: '隧道'}
                    ],
                },
                filterText: '',
                treeData: [],
                defaultProps: {
                    children: 'nodes',
                    label: 'text'
                },
                timeout: null,
                restaurants: [],
                ifShowCompany: "1",  //是否显示公司信息，"1"显示，"2"不显示
                treeLoading: false,
                userInfo: null,  //存储登录用户信息,

            }
        },
        components: {},
        watch: {
            filterText(val) {
                this.filterText = val;
                //监听输入框，若是清空数据后，启动筛选节点，将全部的节点显示出来
                if (!val) {
                    this.$refs.tree.filter(this.filterText);
                }
            },
        },
        mounted() {
            this.userInfo = JSON.parse(localStorage.getItem('yt_user_info')).userInfo.value;
            this.getAreaTree({ifShowCompany: this.ifShowCompany});

        },
        methods: {
            /**
             * 获取区域树
             */
            getAreaTree(param) {
                this.treeLoading = true;
                queryAreaTree(param).then(res => {
                    this.treeData = res.data;
                    this.treeLoading = false;
                }).catch(err => {
                    this.treeLoading = false;
                })
            },
            /*筛选符合条件的节点*/
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },
            //获取选择的点位类型
            handleChange(value) {
                this.filterText = '';
                if (value == '1' || value == '3' || value == '4' || value == '5') {
                    //加载有企业的树
                    this.ifShowCompany = '1';
                    this.getAreaTree({ifShowCompany: this.ifShowCompany});
                } else {
                    //加载无企业的树
                    this.ifShowCompany = '2';
                    this.getAreaTree({ifShowCompany: this.ifShowCompany})
                }
            },
            //加载车辆列表
            getCarList(node, aimNode, type) {
                const param = {companyId: node.id};
                queryCompanyCar(param).then(res => {
                    let newChildren = [];
                    res.data.list.map(item => {
                        item.text = item.carNum;
                        newChildren.push(item);
                    });
                    node.nodes = newChildren;
                    if (type == 'search') {
                        //设置搜索结果的车辆节点作为当前节点
                        this.$nextTick(() => {
                            if (aimNode) {
                                console.log(aimNode, "aimNode");
                                this.$refs.tree.setCurrentKey(aimNode.id);
                                //筛选目标节点
                                this.$refs.tree.filter(this.filterText);
                            }
                        })
                    }
                }).catch(err => {
                })
            },
            //加载摄像机列表
            getCameraList(node, aimNode, type) {
                const param = {
                    areaId: node.id,
                    roleId: this.userInfo.roleId,
                    keyword: this.filterText
                };
                queryCameraPoints(param).then(res => {
                    let newChildren = [];
                    res.data.map(item => {
                        item.cameras.map(jtem => {
                            jtem.text = jtem.positionDes;
                            newChildren.push(jtem);
                        })

                    });
                    node.nodes = newChildren;
                    if (type == 'search') {
                        //设置搜索结果的车辆节点作为当前节点
                        this.$nextTick(() => {
                            if (aimNode) {
                                this.$refs.tree.setCurrentKey(aimNode.id);
                                //筛选目标节点
                                this.$refs.tree.filter(this.filterText);
                            }
                        })
                    }
                }).catch(err => {
                })
            },
            //加载进出卡口列表
            getBayonetList(node, aimNode, type) {
                const param = {companyId: node.id};
                queryBayonetPoints(param).then(res => {
                    let newChildren = [];
                    res.data.list.map(item => {
                        item.text = item.name;
                        newChildren.push(item);
                    });
                    node.nodes = newChildren;
                    if (type == 'search') {
                        //设置搜索结果的车辆节点作为当前节点
                        this.$nextTick(() => {
                            if (aimNode) {
                                this.$refs.tree.setCurrentKey(aimNode.id);
                                //筛选目标节点
                                this.$refs.tree.filter(this.filterText);
                            }
                        })
                    }
                });
            },
            //加载装卸区列表
            getSiteLadeAreaList(node, aimNode, type) {
                const param = {companyId: node.id};
                queryLadeSiteArea(param).then(res => {
                    let newChildren = [];
                    res.data.list.map(item => {
                        item.text = item.name;
                        newChildren.push(item);
                    });
                    node.nodes = newChildren;
                    if (type == 'search') {
                        //设置搜索结果的车辆节点作为当前节点
                        this.$nextTick(() => {
                            if (aimNode) {
                                this.$refs.tree.setCurrentKey(aimNode.id);
                                //筛选目标节点
                                this.$refs.tree.filter(this.filterText);
                            }
                        })
                    }
                });
            },
            //加载停车场列表
            getParkList(node, aimNode, type) {
                const param = {companyId: node.id};
                queryParkingPoints(param).then(res => {
                    let newChildren = [];
                    res.data.list.map(item => {
                        item.text = item.name;
                        newChildren.push(item);
                    });
                    node.nodes = newChildren;
                    if (type == 'search') {
                        //设置搜索结果的车辆节点作为当前节点
                        this.$nextTick(() => {
                            if (aimNode) {
                                this.$refs.tree.setCurrentKey(aimNode.id);
                                //筛选目标节点
                                this.$refs.tree.filter(this.filterText);
                            }
                        })
                    }
                })

            },
            //加载桥梁列表
            getBridgeList(node, aimNode, type) {
                const param = {areaId: node.id};
                queryBridgePoints(param).then(res => {
                    let newChildren = [];
                    res.data.list.map(item => {
                        item.text = item.name;
                        newChildren.push(item);
                    });
                    node.nodes = newChildren;
                    if (type == 'search') {
                        //设置搜索结果的车辆节点作为当前节点
                        this.$nextTick(() => {
                            if (aimNode) {
                                this.$refs.tree.setCurrentKey(aimNode.id);
                                //筛选目标节点
                                this.$refs.tree.filter(this.filterText);
                            }
                        })
                    }
                });
            },
            //加载隧道列表
            getTunnelList(node, aimNode, type) {
                const param = {areaId: node.id};
                queryTunnelPoints(param).then(res => {
                    let newChildren = [];
                    res.data.list.map(item => {
                        item.text = item.name;
                        newChildren.push(item);
                    });
                    node.nodes = newChildren;
                    if (type == 'search') {
                        //设置搜索结果的车辆节点作为当前节点
                        this.$nextTick(() => {
                            if (aimNode) {
                                this.$refs.tree.setCurrentKey(aimNode.id);
                                //筛选目标节点
                                this.$refs.tree.filter(this.filterText);

                            }
                        })
                    }
                });
            },

            //点击节点，加载下级节点
            handleNodeClick(node) {
                if (node.type == 'company') {
                    //有企业节点的树
                    switch (this.form.pointType) {
                        case '0':
                            //首先判断企业的控制显隐开关是否打开
                            const flag = this.defaultSelectSwitch().indexOf('company') > -1;
                            if (!flag) {
                                //调用主页面的方法，打开企业显隐开关
                                this.updateDefaultSelectSwitch('company');
                            }
                            //地图定位
                            getCompanyDetail({id: node.id}).then(res => {
                                const boundsAry = res.data.list[0].boundsAry;
                                if (boundsAry && boundsAry.length > 0) {
                                    //获取中心点坐标
                                    boundsAry.map((bounds, index) => {
                                        if (bounds.length >= 2) {
                                            let LatLngBounds = new google.maps.LatLngBounds();//API地图边界
                                            bounds.map(ktem => {
                                                const temp = new google.maps.LatLng(ktem.lat, ktem.lng);
                                                LatLngBounds.extend(temp);
                                            });
                                            //得到中心点
                                            const latLng = LatLngBounds.getCenter();
                                            if (index == 0) {
                                                mapShowFunc.pan2Point(latLng.lat(), latLng.lng());
                                            }
                                        } else {
                                            mapShowFunc.pan2Point(bounds[0].lat, bounds[0].lng);
                                        }
                                        //定位--放大级别--弹出气泡窗口
                                        this.locMarkerOpenInfoWindow(node.id, 'company', true);
                                    })
                                } else {
                                    this.$message({message: '该公司暂未在地图上标注位置，请选标注！', type: 'warning'})
                                }
                            });

                            break;
                        case '1':
                            //加载车辆列表
                            this.getCarList(node);
                            break;
                        case '3':
                            //加载进出卡口列表
                            this.getBayonetList(node);
                            break;
                        case '4':
                            //加载装卸区列表
                            this.getSiteLadeAreaList(node);
                            break;
                        case '5':
                            //加载停车场列表
                            this.getParkList(node);
                            break;

                    }
                } else if (node.type == 'area_2') {
                    //无企业节点的树
                    switch (this.form.pointType) {
                        case '2':
                            //加载摄像机列表
                            this.getCameraList(node);
                            break;
                        case '6':
                            //加载桥梁列表
                            this.getBridgeList(node);
                            break;
                        case '7':
                            //加载隧道列表
                            this.getTunnelList(node);
                            break;
                    }
                }
            },
            /*自动补全搜索结果*/
            querySearchAsync(queryString, cb) {
                const val = this.filterText;
                if (val) {
                    setTimeout(() => {
                        //输入关键字搜索摄像机，返回的结果自动补全
                        switch (this.form.pointType) {
                            case '1':
                                queryCompanyCar({carNum: val}).then(res => {
                                    this.querySearchAsyncFunc(queryString, cb, res.data.list, 'car')
                                });
                                break;
                            case '2':
                                queryCameraPoints({keyword: val, roleId: this.userInfo.roleId}).then(res => {
                                    this.querySearchAsyncFunc(queryString, cb, res.data, 'camera')
                                });
                                break;
                            case '3':
                                queryBayonetPoints({keyword: val}).then(res => {
                                    this.querySearchAsyncFunc(queryString, cb, res.data.list, 'bayonet')
                                });
                                break;
                            case '4':
                                queryLadeSiteArea({keyword: val}).then(res => {
                                    this.querySearchAsyncFunc(queryString, cb, res.data.list, 'ladeSite')
                                });
                                break;
                            case '5':
                                queryParkingPoints({keyword: val}).then(res => {
                                    this.querySearchAsyncFunc(queryString, cb, res.data.list, 'parking')
                                });
                                break;
                            case '6':
                                queryBridgePoints({keyword: val}).then(res => {
                                    this.querySearchAsyncFunc(queryString, cb, res.data.list, 'bridge')
                                });
                                break;
                            case '7':
                                queryTunnelPoints({keyword: val}).then(res => {
                                    this.querySearchAsyncFunc(queryString, cb, res.data.list, 'tunnel')
                                });
                                break;
                        }
                    }, 300)
                }
            },


            /*将请求的接口数据填充在补齐框中*/
            querySearchAsyncFunc(queryString, cb, data, nodeType) {
                //自动补齐功能，必须有value属性
                data.forEach(item => {
                    item.value = nodeType == 'car' ? item.carNum : (nodeType == 'camera') ? item.positionDes : item.name;
                    item.title = nodeType == 'car' ? item.carNum : (nodeType == 'camera') ? item.positionDes : item.name;
                    item.type = nodeType;
                });

                const restaurants = this.restaurants = data;
                const results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 2000 * Math.random());
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
                };
            },
            /* 选中搜索结果列表中的节点，定位到对应的节点*/
            handleSelectSearchNode(node) {
                console.log(node, "333");
                if (node.type == 'camera') {
                    node = node.cameras[0];
                }
                //获取父节点并作为当前节点进行展开
                this.$refs.tree.setCurrentKey(node.parentCode);
                let curNode = this.$refs.tree.getCurrentNode();
                switch (this.form.pointType) {
                    case '1':
                        this.getCarList(curNode, node, 'search');
                        break;
                    case '2':
                        this.getCameraList(curNode, node, 'search');
                        break;
                    case '3':
                        this.getBayonetList(curNode, node, 'search');
                        break;
                    case '4':
                        this.getSiteLadeAreaList(curNode, node, 'search');
                        break;
                    case '5':
                        this.getParkList(curNode, node, 'search');
                        break;
                    case '6':
                        this.getBridgeList(curNode, node, 'search');
                        break;
                    case '7':
                        this.getTunnelList(curNode, node, 'search');
                        break;
                }

            },
        },
    }
</script>
<style lang="less">
    .el-select-dropdown, .el-autocomplete-suggestion {
        z-index: 60000 !important;
    }

</style>
<style lang="less" scoped>
    @import "../style/style.running-route.less";
    @import "../../../../components/common/style/create-tree.less";

</style>
