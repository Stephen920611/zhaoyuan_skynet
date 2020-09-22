<!-- 下拉菜单显示
     使用方式：（1）首先引用该组件：import dfDropDown from '../../components/common/dropDownMenu.vue'；（2）组件标签化： components:{dfDropDown},
     调用方式：<df-drop-down name="区域选择" :data="regions" :defaultValue="defaultSelectRegionCode" :isMultiSelect="true" @command="handRegionClick"></df-drop-down>
     参数说明：name,data(默认值)(必传)，
              type、trigger、size（选传，有默认值）,
              defaultValue(是否有默认值，若是没传则默认为空数组)，
              isSelect(是否支持选中，true为选中，false不选中，默认支持选中)
              isMultiSelect(是否是多选，true为默认多选，false默认单选)
-->
<template id="dropdownTemp">
    <el-dropdown
            split-button
            :size="size?size:'medium'"
            :type="type?type:'default'"
            :trigger="trigger?trigger:'click'"
            @command="handleCommandFunc">
        {{name}}
        <el-dropdown-menu slot="dropdown">
            <div v-for="(item,index) in data" :key="index">
                <el-dropdown-item :command="item.code"
                                  :class="{'operate-choose':defaultSelectArr.indexOf(item.code)>-1}">
                    <i :class="item.icon?item.icon:''"></i>
                    {{item.des}}
                </el-dropdown-item>
            </div>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
    export default {
//    props:["name","data","defaultValue","isMultiSelect","type","trigger","size"],
        props: {
            name: String,
            data: Array,
            defaultValue: {
                type: Array,
                default: function () {
                    return []
                }
            },
            isSelect: {
                type: Boolean,
                default: true
            },
            isMultiSelect: {
                type: Boolean,
                default: false
            },
            type: String,
            trigger: String,
            size: String
        },
        data() {
            return {
                defaultSelectArr: this.defaultValue,  //若是空数组，表示不选中任意项； 若数组中始终为一个，则是单选；若是数组中有多个，则是多选
            }
        },
        watch: {
            'defaultValue': {
                handler(value) {
                    this.defaultSelectArr = this.defaultValue;
                }
            }
        },
        methods: {
            handleCommandFunc(value) {
                if (this.isSelect) {  //若是支持选中
                    if (!this.isMultiSelect) {   //单选
                        this.defaultSelectArr = [];
                    }
                    const index = this.defaultSelectArr.indexOf(value);
                    if (index > -1) {
                        this.defaultSelectArr.splice(index, 1)
                    } else {
                        this.defaultSelectArr.push(value);
                    }
                }
                this.$emit("command", value);
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "./style/dropdownMenu.less";
</style>
