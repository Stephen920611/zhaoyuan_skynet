<template>
    <!-- <div :class="classObj" class="app-wrapper">
          <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
          <sidebar class="sidebar-container"/>
          <div :class="{hasTagsView:needTagsView}" class="main-container">
              <div :class="{'fixed-header':fixedHeader}">
                  <navbar/>
                  &lt;!&ndash;顶部菜单栏&ndash;&gt;
                  &lt;!&ndash;<head-navbar/>&ndash;&gt;
                  <tags-view v-if="needTagsView"/>
              </div>
              <app-main/>
              <right-panel v-if="showSettings">
                  <settings/>
              </right-panel>
          </div>
      </div>-->
    <!--修改后-->
    <div :class="classObj" class="app-wrapper">
        <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
        <head-navbar/>
        <sidebar v-if="hasSidebar" class="sidebar-container"/>
        <div :class="{hasTagsView:needTagsView}">
            <div :class="{'fixed-header':fixedHeader}" class="navbar-container"
                 :style="!hasSidebar ? 'margin-left:0;width:100%' : null">
                <!--<navbar/>-->
                <!-- tag切换 -->
                <tags-view v-if="needTagsView"/>
            </div>
        </div>
        <div id="main-container" v-scrollBar :class="['main-container', !hasSidebar ? 'margin-l-0' : 'mg-sideBar-width', isShowBreadcrumb ? 'hasBreadcrumb' : 'hasNoBreadcrumb']" >
            <app-main/>
            <right-panel v-if="showSettings" v-show="false">
                <settings/>
            </right-panel>
        </div>
    </div>
</template>

<script>
    import RightPanel from '@/components/RightPanel'
    import {AppMain, Navbar, Settings, Sidebar, TagsView, HeadNavbar} from './components'
    import ResizeMixin from './mixin/ResizeHandler'
    import {mapState, mapGetters} from 'vuex'

    export default {
        name: 'Layout',
        components: {
            AppMain,
            Navbar,
            RightPanel,
            Settings,
            Sidebar,
            TagsView,
            HeadNavbar
        },
        mixins: [ResizeMixin],
        data() {
            return {
                headVisible: this.$store.state.app.headVisible
            }
        },
        computed: {
            ...mapGetters([
                'hasSidebar',
                'isShowBreadcrumb',
                'permission_routes',
            ]),
            ...mapState({
                sidebar: state => state.app.sidebar,
                device: state => state.app.device,
                showSettings: state => state.settings.showSettings,
                needTagsView: state => state.settings.tagsView,
                fixedHeader: state => state.settings.fixedHeader
            }),
            classObj() {
                return {
                    hideSidebar: !this.sidebar.opened,
                    openSidebar: this.sidebar.opened,
                    withoutAnimation: this.sidebar.withoutAnimation,
                    mobile: this.device === 'mobile'
                }
            }
        },
        watch: {
            // 监听路由变化，路由改变滚动条返回到顶部
            /*$route() {
                document.getElementById('main-container').scrollTop = 0;
                //刷新界面或者点击浏览器回退按钮，侧边栏根据当前的路由来判断是否显示
                this.updateSidebar();
            }*/
            '$route':{
                immediate: false, // immediate选项可以开启首次赋值监听
                handler(newVal, oldVal) {
                    document.getElementById('main-container').scrollTop = 0;
                    //刷新界面或者点击浏览器回退按钮，侧边栏根据当前的路由来判断是否显示
                    this.updateSidebar();
                }
            },
        },
        methods: {
            //刷新界面或者点击浏览器回退按钮，侧边栏根据当前的路由来判断是否显示
            updateSidebar(){
                const {dispatch} = this.$store;
                // 是否显示面包屑，根据路由判断
                dispatch({
                    type: 'app/toggleShowBreadcrumb',
                    isShowBreadcrumb: !(this.$route.meta && this.$route.meta.hasOwnProperty('isShowBreadcrumb') && !this.$route.meta.isShowBreadcrumb)
                });

                //是否显示侧边栏
                let matched = this.$route.matched.filter(item => item.meta && item.meta.title);
                //筛选路由
                this.levelList = matched.filter(item => item.meta && item.meta.title);
                this.permission_routes.map((val, idx) => {
                   //找出与当前路由匹配的地址
                    if (val.hasOwnProperty('name') && this.levelList.length > 0 && val.name === this.levelList[0].name) {
                        this.$store.dispatch({
                            type: 'app/updateSidebar', // 调用action
                            sidebarData:this.$route.meta && this.$route.meta.hasOwnProperty('isShowSlideBar') && !this.$route.meta.isShowSlideBar ? null : val.children, // 侧边栏的数据
                            hasSidebar: !(this.$route.meta && this.$route.meta.hasOwnProperty('isShowSlideBar') && !this.$route.meta.isShowSlideBar), // 是否显示侧边栏
                            sidebarParents: val// 点击的顶部标题的数据
                        })
                    }
                })
            },
            //点击是否收起菜单栏
            handleClickOutside() {
                this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
            }
        },

    }
</script>

<style lang="scss" scoped type="text/scss">
    @import "~@/styles/mixin.scss";
    @import "~@/styles/variables.scss";

    #app {
        .hideSidebar { //侧边栏收起时
            &>>> .navbar-container {
                width: calc(100% - 54px); //侧边栏的状况决定navbar-container的宽度
            }
        }
        .openSidebar { //侧边栏打开时
            &>>> .navbar-container {
                width: calc(100% - 210px); //侧边栏的状况决定navbar-container的宽度
            }
        }

        .hasBreadcrumb {
            margin-top: 110px !important;
            height: calc(100vh - 110px) !important;
        }
        .hasNoBreadcrumb {
            margin-top: 60px !important;
            height: calc(100vh - 60px) !important;
        }
    }

    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;

        &.mobile.openSidebar {
            position: fixed;
            top: 0;
        }
    }

    .sidebar-container {
        padding-top: 60px;
    }

    .drawer-bg {
        background: #000;
        opacity: 0.3;
        width: 100%;
        top: 0;
        height: 100%;
        position: absolute;
        z-index: 999;
    }

    .fixed-header {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9;
        width: calc(100% - #{$sideBarWidth});
        transition: width 0.28s;
    }

    .mg-sideBar-width {
        margin-left: $sideBarWidth;
    }

    .hideSidebar .fixed-header {
        width: calc(100% - 54px)
    }

    .mobile .fixed-header {
        width: 100%;
    }
</style>
