<template>
    <div class="dashboard-editor-container">
        <div class=" clearfix">
            <!--<pan-thumb :image="avatar" style="float: left">-->
            <!--Your roles:-->
            <!--<span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>-->
            <!--</pan-thumb>-->
            <div class="info-container" style="display: flex; justify-content: center">
                <!--<span class="display_name">{{ name }}</span>-->
                <!--<span style="font-size:20px;padding-top:20px;display:inline-block;">欢迎访问</span>-->
                <span style="font-size:20px;padding-top:20px;display:inline-block;"> 欢迎登录烟台市扶贫开发监测管理系统</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import PanThumb from '@/components/PanThumb'
    import GithubCorner from '@/components/GithubCorner'

    export default {
        name: 'DashboardEditor',
        components: {PanThumb, GithubCorner},
        data() {
            return {
                emptyGif: ''
            }
        },
        computed: {
            ...mapGetters([
                'name',
                'avatar',
                'roles'
            ])
        }
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
