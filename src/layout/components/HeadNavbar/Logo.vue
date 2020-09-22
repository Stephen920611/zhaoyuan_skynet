<template>
    <div class="sidebar-logo-container">
        <transition name="sidebarLogoFade">
            <!--<router-link  key="collapse" class="sidebar-logo-link" to="/">
                    <img v-if="logo" :src="logo" class="sidebar-logo">
                    <h1 v-else class="sidebar-title">{{ title }} </h1>
                  </router-link>-->
            <!--临时关闭，因为去掉首页-->
            <!--<router-link key="expand" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="sidebar-logo">
                <h1 class="sidebar-title" :title="title">{{ title }} </h1>
            </router-link>-->
            <div class="sidebar-logo-link" >
                <img v-if="logo" :src="logo" class="sidebar-logo">
                <h1 class="sidebar-title" :title="title">{{ sysName }} </h1>
            </div>
        </transition>
    </div>
</template>

<script>
    import logoBg from '@/assets/image/logo_sm.png';
    import {getSystemNameAsync} from '@/utils/sysName'
    export default {
        name: 'SidebarLogo',
        props: {},
        data() {
            return {
                title: '招远天网',
                logo: '',
                sysName:''
            }
        },
        mounted(){
            this.logo = logoBg;
            this.getSystemName();
        },
        methods:{
            //获取系统名
            async getSystemName(){
                if(!localStorage.getItem('system_name')){
                    //若没有则请求接口，存储到缓存中
                    this.sysName =  await getSystemNameAsync();
                }else{
                    this.sysName = localStorage.getItem('system_name')
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .sidebarLogoFade-enter-active {
        transition: opacity 1.5s;
    }

    .sidebarLogoFade-enter,
    .sidebarLogoFade-leave-to {
        opacity: 0;
    }

    .sidebar-logo-container {
        position: relative;
        max-width: 500px;
        min-width: 300px;
        height: 50px;
        padding-left: 12px;
        line-height: 50px;
        background: #2b2f3a;
        text-align: center;
        overflow: hidden;
        padding-right: 20px;

        & .sidebar-logo-link {
            height: 100%;
            width: 100%;

            & .sidebar-logo {
                width: 17px;
                height: 17px;
                vertical-align: middle;
                margin-right: 5px;
            }

            & .sidebar-title {
                display: inline-block;
                margin: 0;
                color: #fff;
                font-weight: 600;
                max-width: 430px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                height: 50px;
                line-height: 50px;
                font-size: 16px;
                font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
                vertical-align: middle;
            }
        }

        &.collapse {
            .sidebar-logo {
                margin-right: 0px;
            }
        }
    }
</style>
