<!--联排开关按钮项：记录用户点击的激活状态-->
<!--调用方式：<df-switch-item ref="switchItem" :data="operateBtnItems" :defaultValue="defaultSelectSwitch" :isMultiSelect="true" @selectItem="handleSwitch"></df-switch-item>-->
<!--参数说明：data（必传)，
            defaultValue(是否有默认值，若是没传则默认为空数组)，
            isInterval(各项之间是否有间隙，true为有间隙，false无间隙，默认true)
            isSelect(是否支持选中，true为选中，false不选中，默认支持选中)
            isMultiSelect(是否是多选，true为默认多选，false默认单选)-->
<template>
    <div class="switch-wrapper">
        <div class="operate-group" v-for="(item,index) in data" :key="index">
            <div class="operate-item" :class="{'active':defaultSelectArr.indexOf(item.code)>-1}"
                 @click="handleSwitch(item.code)" :style="{'margin-right':interval}">
                <i :class="item.icon?item.icon:''"></i>
                <label>{{item.name}}</label>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            defaultValue: {
                type: Array,
                default: function () {
                    return []
                }
            },
            isInterval: {
                type: Boolean,
                default: false
            },
            isSelect: {
                type: Boolean,
                default: true
            },
            isMultiSelect: {
                type: Boolean,
                default: false
            },
            data: Array
        },
        data() {
            return {
                defaultSelectArr: this.defaultValue,  //若是空数组，表示不选中任意项； 若数组中始终为一个，则是单选；若是数组中有多个，则是多选
                interval: '0px'
            }
        },
        watch: {
            'defaultValue': {
                handler(newValue) {
                    this.defaultSelectArr = newValue;
                }
            }
        },
        mounted() {
            if (this.isInterval) {
                //间距10px
                this.interval = '10px';
            }
        },
        methods: {
            handleSwitch(code) {
                //阻止选中文字
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                if (this.isSelect) {   //默认支持选中
                    if (!this.isMultiSelect) {   //单选
                        this.defaultSelectArr = [];
                    }
                    const index = this.defaultSelectArr.indexOf(code);
                    if (index > -1) {
                        this.defaultSelectArr.splice(index, 1)
                    } else {
                        this.defaultSelectArr.push(code);
                    }
                }
                this.$emit("selectItem", code);
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "./style/style.switch-item.less";
</style>
