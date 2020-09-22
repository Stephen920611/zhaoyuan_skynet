/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const videoMonitorRouter = {
    path: '/video-monitor',
    component: Layout,
    redirect: '/video-monitor/index',
    name: 'VideoMonitorModule',
    meta: {
        title: 'videoMonitorModule',
        icon: 'video',
        breadcrumb: false,  //在面包屑中隐藏
        isShowSlideBar: false,
        fullPath:'/video-monitor/index'
    },
    children: [
        {
            path: 'index',
            component: () => import('@/views/video-monitor/index'),
            name: 'VideoMonitorIndex',
            meta: {
                title: 'videoMonitorIndex',
                isShowSlideBar: false,
                isShowBreadcrumb: false,
                fullPath:'/video-monitor/index'
            }
        }
    ]
}

export default videoMonitorRouter
