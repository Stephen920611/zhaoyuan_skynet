<template>
  <div class="tree-container" v-scrollBar>
      <el-tree
              class="filter-tree"
              :data="data"
              :props="defaultProps"
              default-expand-all
              highlight-current
              @node-click="handleNodeClick"
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
            }
        },
        data(){
            return{

            }
        },
        mounted(){

        },
        methods:{
            //点击节点
            handleNodeClick(node){
                this.$emit("node-click",node)
            }
        }

    }

</script>
<style lang="scss" scoped>
    .tree-container{
        width: 300px;
        height: 100%;
        padding: 10px 0;
        position: relative;
        .el-tree{
            height: 100%;
        }
    }
</style>
