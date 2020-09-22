<template>
    <div class="dashboard-editor-container">
        <div class=" clearfix">
            <!--<pan-thumb :image="avatar" style="float: left">-->
            <!--Your roles:-->
            <!--<span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>-->
            <!--</pan-thumb>-->
            <div class="info-container" style="display: flex; justify-content: center">
                <!--<span class="display_name">{{ name }}</span>-->
                <span style="font-size:20px;padding-top:20px;display:inline-block;"> 欢迎登录烟台市扶贫开发监测管理系统</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'DashboardEditor',
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters([
                'name',
                'avatar',
                'roles'
            ])
        },
        methods: {
            /**
             * 改变适配方案
             */
            changeAdapter() {
                const { adapterType, width, height } = this.state;
                const clientWidth = document.body.clientWidth;
                const clientHeight = document.body.clientHeight;
                const xScale = clientWidth / width;
                const yScale = clientHeight / height;
                // const cw_cy = clientWidth / clientHeight;
                // const w_y = width / height;
                let realScreenInner = document.getElementById('screen-index-frame');    // 内层div---真实宽高
                // let screenOuter = document.getElementById('screen-index-div');     // 最外层div

                switch (adapterType) {
                    // 等比缩放，即大屏缩放比例和原始大屏宽高比例一样，完整显示在当前浏览器内
                    case 'stretch':
                        if (xScale * height > clientHeight) {
                            realScreenInner.style.transform = 'scale(' + yScale + ')';
                        } else {
                            realScreenInner.style.transform = 'scale(' + xScale + ')';
                        }
                        break;
                    case 'width':
                        // 适应宽度
                        realScreenInner.style.transform = 'scale(' + xScale + ')';
                        break;
                    case 'height':
                        // 适应高度
                        realScreenInner.style.transform = 'scale(' + yScale + ')';
                        break;
                    case 'normal':

                        break;
                    case 'pull':
                        // 全屏铺满
                        realScreenInner.style.transform = 'scale(' + xScale + ',' + yScale + ')';
                        break;
                    default:
                        break;
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .emptyGif {
        display: block;
        width: 45%;
        margin: 0 auto;
    }

    .dashboard-editor-container {
        /*background-color: #e3e3e3;*/
        background-color: #fff;
        /*min-height: 100vh;*/
        padding: 50px 60px 0px;
        height: 100%;
        .pan-info-roles {
            font-size: 12px;
            font-weight: 700;
            color: #333;
            display: block;
        }
        .info-container {
            position: relative;
            height: 150px;
            background: #fff;
            line-height: 200px;
            .display_name {
                font-size: 48px;
                line-height: 48px;
                color: #212121;
                position: absolute;
                top: 25px;
            }
        }
    }
</style>
