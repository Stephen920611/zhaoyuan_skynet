/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const mapMonitorRouter = {
    path: '/map-monitor',
    component: Layout,
    redirect: '/map-monitor/index',
    name: 'MapMonitorModule',
    meta: {
        title: 'mapMonitorModule',
        icon: 'map',
        noCache:true,
        breadcrumb: false,  //在面包屑中隐藏
        isShowSlideBar: false,
        fullPath:'/map-monitor/index'
    },
    children: [
        {
            path: 'index',
            component: () => import('@/views/map-monitor/index'),
            name: 'MapMonitorIndex',
            meta: {
                title: 'mapMonitorIndex',
                icon: 'map',
                noCache:true,
                isShowSlideBar: false,
                isShowBreadcrumb: false,
                fullPath:'/map-monitor/index'
            }
        }
    ]
}

export default mapMonitorRouter
