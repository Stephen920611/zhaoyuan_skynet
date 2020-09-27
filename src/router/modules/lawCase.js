/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const lawCaseRouter = {
    path: '/law-case',
    component: Layout,
    redirect: '/law-case/home',
    name: 'LawCaseModule',
    meta: {
        title: 'lawCaseModule',
        icon: 'statistic',
        isShowBreadcrumb: false,
        fullPath:'/law-case'
    },
    children: [
        {
            path: 'home',
            redirect: '/law-case/home/index',
            component: () => import('@/views/law-case/home/index'),
            name: 'lawCaseHome',
            meta: {
                title: '',
                icon: 'statistic',
                isShowSlideBar: true,
                isShowBreadcrumb: false,
                activeMenu: '/law-case/home',
                fullPath:'/law-case/home/index'
            },
            children: [
                {
                    path: 'index',
                    component: () => import('@/views/law-case/home/list'),
                    name: 'lawCaseHomeIndex',
                    meta: {
                        title: 'lawCaseHomeIndex',
                        icon: 'list',
                        isShowSlideBar: true,
                        isShowBreadcrumb: false,
                        fullPath:'/law-case/home/index'
                    }
                }
            ]
        },
        {
            path: 'map',
            redirect: '/law-case/map/index',
            component: () => import('@/views/law-case/map/index'),
            name: 'lawCaseMapIndex',
            meta: {
                title: '',
                icon: 'statistic',
                activeMenu: '/law-case/map',
                isShowSlideBar: true,
                isShowBreadcrumb: false,
                fullPath:'/law-case/map'
            },
            children: [
                {
                    path: 'index',
                    component: () => import('@/views/law-case/map/list'),
                    name: 'lawCaseMapContent',
                    meta: {
                        title: 'lawCaseMapIndex',
                        icon: 'list',
                        isShowSlideBar: true,
                        isShowBreadcrumb: false,
                        fullPath:'/law-case/map'
                    }
                }
            ]
        }
    ]
}

export default lawCaseRouter
