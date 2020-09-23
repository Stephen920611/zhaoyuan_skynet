<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
                <!--如果路由没有重定向或者为面包屑的最后一个-->
                <span v-if="item.redirect==='noRedirect'||index==levelList.length-1||index===0" class="no-redirect">
                <!--<span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">-->
                  {{ generateTitle(item.meta.title) }}
                </span>
                <a v-else @click.prevent="handleLink(item)">{{ generateTitle(item.meta.title) }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script>
    import {getStorage} from '@/utils/storage'
    import {generateTitle} from '@/utils/i18n'
    import pathToRegexp from 'path-to-regexp'
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                levelList: null,
                userInfo: {},//登录者信息
            }
        },
        computed: {
            ...mapGetters([
                'permission_routes',
                'sidebar',
                'avatar'
            ])
        },
        watch: {
            $route(route) {
                // if you go to the redirect page, do not update the breadcrumbs
                if (route.path.startsWith('/redirect/')) {
                    return
                }
                this.getBreadcrumb()
            }
        },
        created() {
            //获取用户信息
            this.userInfo = getStorage('userInfo');
            this.getBreadcrumb()
        },
        methods: {
            generateTitle,
            getBreadcrumb() {
                // only show routes with meta.title
                let matched = this.$route.matched.filter(item => item.meta && item.meta.title)

                //面包屑是否显示首页，统一默认第一个为首页
                /*const first = matched[0];
                if (!this.isDashboard(first)) {
                    matched = [{path: '/dashboard', meta: {title: 'dashboard'}}].concat(matched)
                }*/

                //筛选路由
                this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
                // 根据路由显示侧边栏 levelList 保存的为面包屑的数据
                const {dispatch} = this.$store;
                // 遍历路由数据，传递侧边栏的显示数据
                this.permission_routes.map((val, idx) => {
                    //如果面包屑前面同一加上首页时
//        if (val.hasOwnProperty('name') && this.levelList.length > 1 && val.name === this.levelList[1].name) {

                    //没有首页时
                    if (val.hasOwnProperty('name') && this.levelList.length > 0 && val.name === this.levelList[0].name) {
//                        console.log(val,'val');
                        dispatch({
                            type: 'app/updateSidebar', // 调用action
                            sidebarData: val.children, // 侧边栏的数据
//                            hasSidebar: val.name === 'DashboardHome' ? false : true, // 是否显示侧边栏
                            hasSidebar: val.children[0].meta.isShowSlideBar, // 是否显示侧边栏
                            sidebarParents: val// 点击的顶部标题的数据
                        })
                    }
                })
            },

            pathCompile(path) {
                // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
                const {params} = this.$route
                var toPath = pathToRegexp.compile(path)
                return toPath(params)
            },
            handleLink(item) {
                this.isShowSlideBar(item)
                const {redirect, path} = item
                if (redirect) {
                    this.$router.push(redirect)
                    return
                }
                this.$router.push(this.pathCompile(path))
            },
            //判断是否有首页
            isDashboard(route) {
                const name = route && route.name
                if (!name) {
                    return false
                }
                return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
            },
            /**
             * 是否显示侧边栏
             * @param tag {Object} 点击tag的数据
             */
            isShowSlideBar(tag) {
                const {dispatch} = this.$store;
                // 是否显示侧边栏
                if (!(tag.hasOwnProperty('meta') && tag.meta.hasOwnProperty('isShowSlideBar') && tag.meta.isShowSlideBar)) {
                    dispatch({
                        type: 'app/updateSidebar', // 调用action
                        sidebarData: null, // 侧边栏的数据
                        hasSidebar: false, // 是否显示侧边栏
                        sidebarParents: null// 点击的顶部标题的数据
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .app-breadcrumb.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 50px;
        margin-left: 8px;

        .no-redirect {
            color: #97a8be;
            cursor: text;
        }

    }
</style>
