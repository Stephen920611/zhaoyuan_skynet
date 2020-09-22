<!--带搜索框的树结构
    <df-create-tree
        ref="initTree"
        :data="treeData"
        :isSearch="true"
        :expandedKeys="expandedKeys"
        reqSearchUrl="/api/camera/search"
        reqSearchType="get"
        :reqSearchParam="{'treeId':treeForm.defaultSelected}"
        reqNextNodeUrl="/api/tree/cameraList"
        reqNextNodeType="post"
        :reqNextNodeParam="{'treeId':treeForm.defaultSelected}"
        @node-click="handleNodeClick">
     </df-create-tree>
     其中：isSearch可选，不传参默认是true（带搜索框）
            reqSearchParam：是除了搜索关键字之外的参数
            reqNextNodeParam：是除了部门节点（departCode）之外的参数
            handleNodeClick：节点点击后的回调方法
-->
<template>
  <div class="tree-wrapper">
    <el-autocomplete
      class="search-node-inp"
      size="medium"
      v-model="filterText"
      v-show="isSearch"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入内容"
      :trigger-on-focus="false"
      @select="handleSelectSearchNode"
      clearable
    >
    </el-autocomplete>
    <div class="tree-wrap" :class="{'tree-wrap-not-search':!isSearch}">
      <el-tree
        class="camera-tree"
        :data="data"
        :props="defaultProps"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        @node-contextmenu="rightClick"
        node-key="code"
        :default-expand-all="true"
        :default-expanded-keys="expandedDefaultKeys"
        highlight-current
        ref="tree"
        :filter-node-method="filterNode">
          <span class="custom-tree-node ellipsis-l1" :title="node.label"  slot-scope="{node,data}" >
              <span class="ellipsis-l1">
                  <i :class="data.icon?data.icon:''"></i>{{node.label}}
              </span>
              <span>
                    <a class="my-badge" :class="(data.type.indexOf('depart')>-1)?'':'hide-badge'">{{data.tags}}</a>
                </span>
          </span>
      </el-tree>
      <div id="perTreeMenu" v-if="tmDisplay" class="tree_menu" :style="{...rightMenu}">
        <ul v-for="(menu,index) in rightMenus" :key="index">
          <li class="menu-li" :id="index"><i :class="menu.icon"></i>{{menu.name}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import qs from 'qs'
  import {getToken} from '@/utils/auth'
    export default {
        props:{
          data:{   //树结构的数据
            type: Array,
            default: function() {
              return []
            }
          },
          isSearch:{
            type: Boolean,
            default: true
          },
          expandedKeys:{   //默认展开的树节点
            type: Array,
            default: function() {
              return []
            }
          },
          reqSearchUrl:{   //请求搜索节点的url地址
            type:String
          },
          reqSearchType:{   //请求搜索节点的请求类型
            type:String
          },
          reqSearchParam:{   //请求搜索节点的参数对象
            type:Object
          },
          reqNextNodeUrl:{   //请求下级节点的url地址
            type:String
          },
          reqNextNodeType:{   //请求下级节点的请求类型
            type:String
          },
          reqNextNodeParam:{   //请求下级节点的参数对象
            type:Object
          },
          rightMenus:{    //右键菜单项
            type: Array,
            default: function() {
              return []
            }
          },
          rightMenuShow:{   //右键树节点的类型名称，通过树节点类型与传入的参数匹配则显示，不匹配则隐藏，不传则默认全部显示
            type:String
          }
        },
        data(){
            return{
              defaultProps: {
                children: 'nodes',
                label: 'text',
                icon:'icon'
              },
              filterText: '',
              expandedDefaultKeys:[],
              timeout:null,
              restaurants:[],
              tmDisplay:false,  //右键菜单显示，默认隐藏
              rightMenu:{},
            }
        },
        watch:{
          filterText(val){
            this.filterText = val;
            //监听输入框，若是清空数据后，启动筛选节点，将全部的节点显示出来
            if(!val){
              this.$refs.tree.filter(this.filterText);
            }
          }
        },
        mounted(){
            this.expandedDefaultKeys = this.expandedKeys;
        },
        methods:{
          /*选中节点的回调方法*/
          handleNodeClick(node){
              console.log('node',node);
//            this.$refs.tree.setCurrentKey(null);
            if(node.type && node.type.indexOf('depart')>-1){
                //若是有下级节点请求地址，则请求下级节点列表，若没有则启动回调方法
                if(this.reqNextNodeUrl){
                    if(this.expandedKeys.indexOf(node.code)==-1){
                      this.expandedKeys.push(node.code);
                      this.getNextNodeList(node);
                    }
                    this.$emit('node-depart-click',node);
                }else{
                  this.$emit('node-click',node)
                }
            }else if(node.type && node.type.indexOf('camera')>-1){
              this.$emit('node-click',node)
            }
          },

          /*通过下级节点的请求地址，获取下级节点列表*/
          getNextNodeList(node,aimNode){
            const reqNextNodeType = this.reqNextNodeType;
            let reqNextNodeUrl = this.reqNextNodeUrl;
            let reqNextNodeParam = this.reqNextNodeParam;
            reqNextNodeParam.departCode = node.code;
              axios.defaults.headers.common["Authorization"] = getToken();
            if(reqNextNodeType.toLowerCase()=="get"){
              reqNextNodeUrl = this.getTypeUrl(reqNextNodeUrl,reqNextNodeParam);
              // 发送get请求
              axios.get(reqNextNodeUrl).then(res=>{
                this.getNextNodeListFunc(node,aimNode,res.data)
              })
            }else{
//              reqNextNodeParam = qs.stringify(reqNextNodeParam);
              axios.post(reqNextNodeUrl, reqNextNodeParam).then(res=>{
                this.getNextNodeListFunc(node,aimNode,res.data.data)
              })
            }
          },
          /*请求下级节点列表完成后的操作*/
          getNextNodeListFunc(node,aimNode,data){
//              alert('ssss')
            let newChildren = [];
            data.forEach(item=>{
              newChildren.push(item);
            });
            //判断该节点是否有下级节点，若有则将下级节点和查询出的摄像机节点进行先清空下级节点再拼接
            //若无，则要判断该节点是不是部门节点
            if (!(node.nodes && node.nodes.length>0)) {
              this.$set(node, 'nodes', []);
            }else{
                let departNodes = [];
                node.nodes.forEach(item =>{
                    if(this.isDepartNode(item)){
                      departNodes.push(item);
                    }
                });
              this.$set(node, 'nodes', departNodes);
            }
            newChildren = node.nodes.concat(newChildren);
            node.nodes = newChildren;
            //展开选中的节点
            if(this.expandedDefaultKeys.indexOf(node.code) == -1){
              this.expandedDefaultKeys.push(node.code);
            }
            //设置搜索结果的摄像机节点作为当前节点
            this.$nextTick(()=>{
              if(aimNode){
                this.$refs.tree.setCurrentKey(aimNode.code);
                //筛选目标节点
                this.$refs.tree.filter(this.filterText);
                //选中节点后的方法
                this.handleNodeClick(aimNode);
              }
            })

          },
          /*判断选中节点下的子节点是否存在部门节点*/
          isDepartNode(node){
              let flag = false;
              if(node && node.type.indexOf('depart')>-1){
                  flag = true
              }
              return flag;
          },

          /* 选中搜索结果列表中的节点，定位到对应的节点*/
          handleSelectSearchNode(node){
            //获取父节点并作为当前节点进行展开
            this.$refs.tree.setCurrentKey(node.parent);
            let curNode = this.$refs.tree.getCurrentNode();
            this.getNextNodeList(curNode,node);
          },

          /*自动补全搜索结果*/
          querySearchAsync(queryString, cb){
            const val = this.filterText;
            const reqType = this.reqSearchType;
            let reqUrl = this.reqSearchUrl;
            let reqParam = this.reqSearchParam;
            reqParam.keyword = val;
            if(val){
              setTimeout(()=>{
                //输入关键字搜索摄像机，返回的结果自动补全
                  axios.defaults.headers.common["Authorization"] = getToken();
                if(reqType.toLowerCase()=="get"){
                 reqUrl = this.getTypeUrl(reqUrl,reqParam);
                 console.log('reqUrl',reqUrl);
                  // 发送get请求
                  axios.get(reqUrl).then(res=>{
                      this.querySearchAsyncFunc(queryString,cb,res.data)
                  })
                }else{
//                  reqParam = qs.stringify(reqParam);
                  axios.post(reqUrl, reqParam).then(res=>{
                    this.querySearchAsyncFunc(queryString,cb,res.data)
                  })
                }
              },300)
            }
          },
          /*拼接get方法的请求地址*/
          getTypeUrl(url,param){
            let dataStr = ''; //数据拼接字符串
            Object.keys(param).forEach(key => {
              dataStr += key + '=' + param[key] + '&'
            });
            if (dataStr !== '') {
              dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
              url = url + '?' + dataStr
            }
            return url;
          },
          /*将请求的接口数据填充在补齐框中*/
          querySearchAsyncFunc(queryString,cb,res){
            const data = res.data;
            //自动补齐功能，必须有value属性
            data.forEach(item=>{
              item.value = item.des;
              item.title = item.des;
              item.type = 'camera';
            });
            this.restaurants = data;
            const restaurants = data;
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
          /*筛选符合条件的节点*/
          filterNode(value, data) {
            if (!value) return true;
            return data.text.indexOf(value) !== -1;
          },
          setCurrSelectedNode(code){
            this.$refs.tree.setCurrentKey(code);
          },
          //右键菜单
          rightClick(e,data,node,comp){
            this.rightMenu = {top:e.pageY+'px',left:e.pageX+'px'};

            if((this.rightMenuShow && data.type.indexOf(this.rightMenuShow)>-1 || !this.rightMenuShow)){   //通过树节点的类型判断是否显示右键菜单,若没传则默认所有节点都显示
              this.tmDisplay = true;
            }else{
              this.tmDisplay = false;
            }
            const self = this;
            document.onclick=function(ev){
              if(ev.target!==document.getElementById('perTreeMenu')){
                self.tmDisplay = false
              }
              if(ev.target.className == "menu-li"){
                const type = ev.target.id;
                self.$emit('right-menu',type,data)
              }
            }
          },
        }
    }
</script>
<style lang="less" scoped>
  @import "./style/create-tree.less";
</style>
