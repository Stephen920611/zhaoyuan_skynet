/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const statisticAnalysisRouter = {
    path: '/statistic-analysis',
    component: Layout,
    redirect: '/statistic-analysis/analysis',
    name: 'StatisticAnalysisModule',
    meta: {
        title: 'statisticAnalysisModule',
        icon: 'statistic',
        fullPath:'/statistic-analysis'
    },
    children: [
        {
            path: 'analysis',
            redirect: '/statistic-analysis/analysis/index',
            component: () => import('@/views/statistic-analysis/index'),
            name: 'StatisticAnalysisIndex',
            meta: {
                title: '',
                icon: 'statistic',
                activeMenu: '/statistic-analysis/analysis',
                isShowSlideBar: true,
                fullPath:'/statistic-analysis'
            },
            children: [
                {
                    path: 'index',
                    component: () => import('@/views/statistic-analysis/list'),
                    name: 'StatisticAnalysisList',
                    meta: {
                        title: 'statisticAnalysisIndex',
                        icon: 'list',
                        isShowSlideBar: true,
                        fullPath:'/statistic-analysis'
                    }
                }
            ]
        }
    ]
}

export default statisticAnalysisRouter
