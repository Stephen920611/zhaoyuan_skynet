<template>
  <div class="tree-container">
      <el-input
              v-show="showSearch == true"
              placeholder="输入关键字进行过滤"
              v-model="filterText"
              style="margin-bottom: 6px;">
      </el-input>
      <el-tree
              v-scrollBar
              class="filter-tree"
              :data="data"
              :props="defaultProps"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
              :filter-node-method="filterNode"
              :expand-on-click-node = 'false'
              v-loading="loading"
              ref="tree">
      </el-tree>
  </div>
</template>
<script>
    export default {
        props:{
            data:{
                type:Array,
                default() {
                    return [];
                }
            },
            defaultProps:{
                type:Object,
                default(){
                    return {
                        children: 'nodes',
                        label: 'text'
                    }
                }
            },
            loading:{
                type:Boolean,
                default: false
            },
            showSearch:{
                type:Boolean,
                default: false
            },
        },
        data(){
            return{
                filterText: '',
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        mounted(){

        },
        methods:{
            //点击节点
            handleNodeClick(node){
                this.$emit("node-click",node)
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },
        }

    }

</script>
<style lang="scss" scoped>
    .tree-container{
        width: 100%;
        height: 100%;
        padding: 10px 0;
        position: relative;
        .el-tree{
            height: calc(100% - 36px);
        }
    }
</style>
