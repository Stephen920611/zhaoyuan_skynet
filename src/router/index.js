import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import lawCaseRouter from './modules/lawCase'
import videoMonitorRouter from './modules/videoMonitor'
import mapMonitorRouter from './modules/mapMonitor'
import courseMonitorRouter from './modules/courseMonitor'
import evaluateAnalysisRouter from './modules/evaluateAnalysis'
import industryInfoRouter from './modules/industryInfo'
import companyIndustryInfoRouter from './modules/companyIndustryInfo'
import statisticAnalysisRouter from './modules/statisticAnalysis'
import emergencyManagementRouter from './modules/emergencyManagement'
import systemManageRouter from './modules/systemManage'
import hazardInstallationsRouter from './modules/hazardInstallationsRouter'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   是否在侧边栏或者顶部导航栏显示；设为true, 该路由会隐藏（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果未设置alwaysShow，则当项具有多个子路线时，
 *                                它将变为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置noRedirect，则不会在面包屑中重定向
 * name:'router-name'             该名称由<keep-alive>使用（必须设置！！！）
 * meta : {
    roles: ['zhenggai','admin','visitor']    权限，控制页面角色（您可以设置多个角色）
    title: 'title'               名称，显示在侧边栏和面包屑中（推荐设置）
    icon: 'svg-name'             侧栏中或顶部导航栏的图标显示
    noCache: true                如果设置为true，将不缓存页面（默认为false）
    affix: true                  如果设为true,则改路由标签将粘贴在标签视图tags-view中（注：tags-view每项后面的小叉号）
    breadcrumb: false            如果设为false,该路由将在breadcrumb面包屑中隐藏（默认是true）
    activeMenu: '/example/list'  如果设置了路径，则侧边栏将突出高亮显示您设置的路径
    isShowSlideBar:true          是否需要显示侧边栏；设为true,该路由会显示侧边栏（默认是false）
    isShowBreadcrumb:true          是否展示整个面包屑；设为true,会显示面包屑（默认是true）
    isNeedReWriteRedirect: true    是否需要重新动态生成redirect， 如果只有3级，那么第1级需要加属性，如果是4级，那么1、2级需要加属性， 0~(n-2) 级都需要， 只有确定的页面才不需要（结合权限控制来，因为权限控制会使得一些路由消失，所以需要动态配置）
    fullPath:'/dashboard'          fullPath，用来对应的控制权限显示，必须要有，而且一个模块都必须一致
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基本页面
 * 所有角色都可以访问
 */
export const constantRoutes = [
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        hidden: true,
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard/index'),
                name: 'Dashboard',
                meta: {
                    title: 'dashboard',
                    icon: 'dashboard',
                    affix: true, // tags后面的关闭按钮是否显示
                    // fullPath:'/dashboard'
                }
            }
        ]
    },
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/auth-redirect',
        component: () => import('@/views/login/auth-redirect'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/error-page/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error-page/401'),
        hidden: true
    },
]

/**
 * asyncRoutes
 *
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
    /** -------------------------------- 首页 --------------------------------**/
    /*{
        path: '/dashboard',
        component: Layout,
        redirect: '/dashboard/index',
        name: 'DashboardHome',
        meta: {
            title: 'dashboard',
            icon: 'home',
            breadcrumb: false,  //在面包屑中隐藏
            isShowSlideBar: false,
            isNeedReWriteRedirect: false,
            fullPath:'/dashboard/index'
        },
        children: [
            {
                path: 'index',
                component: () => import('@/views/dashboard/index'),
                name: 'DashboardHomeIndex',
                meta: {
                    title: 'dashboard',
                    icon: 'home',
                    isShowSlideBar: false,
                    isShowBreadcrumb: false,
                    fullPath:'/dashboard/index'
                }
            }
        ]
    },*/
    /** 当您的路由图太长时，您可以将其拆分为小模块 **/
    
    /** -------------------------------- 案事件 --------------------------------**/
    lawCaseRouter,
    
    /** -------------------------------- 消防监控 --------------------------------**/
    
    /** -------------------------------- 罐箱监管 --------------------------------**/
    
    /** --------------------------------  可视化  --------------------------------**/
    
    /** -------------------------------- 园区管理 --------------------------------**/
    
    /** -------------------------------- 系统管理 --------------------------------**/

    /** -------------------------------- 视频监管 --------------------------------**/
    videoMonitorRouter,
    /** -------------------------------- 地图应用 --------------------------------**/
    mapMonitorRouter,
    /** -------------------------------- 过程监管 --------------------------------**/
    courseMonitorRouter,
    /** -------------------------------- 应急管理 --------------------------------**/
    emergencyManagementRouter,
    /** -------------------------------- 评价分析 --------------------------------**/
    evaluateAnalysisRouter,
    /** -------------------------------- 行业信息（政府部门使用） --------------------------------**/
    industryInfoRouter,
    /** -------------------------------- 行业信息(企业使用) --------------------------------**/
    companyIndustryInfoRouter,
    /** -------------------------------- 统计分析 --------------------------------**/
    statisticAnalysisRouter,
    /** -------------------------------- 系统管理 --------------------------------**/
    systemManageRouter,
    /** -------------------------------- 重大危险源 --------------------------------**/
    hazardInstallationsRouter,

];

const createRouter = () => new Router({
    base: '/', // require service support
    mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes.concat(asyncRoutes)
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher // reset router
}

export default router
