/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const courseMonitorRouter = {
    path: '/course-monitor',
    component: Layout,
    redirect: '/course-monitor/handling-process/rectification-notice/index',
    name: 'CourseMonitorModule',
    meta: {
        title: 'courseMonitorModule',
        icon: 'course',
        // breadcrumb: false,  //在面包屑中隐藏
        isShowSlideBar: true,
        isNeedReWriteRedirect: true,
        fullPath:'/course-monitor'
    },
    children: [
        /*-------------------------------------- 装卸过程监测 ----------------------------------*/
        {
            path: 'handling-process',
            redirect: '/course-monitor/handling-process/operation-process',
            component: () => import('@/views/course-monitor/handling-process/index'),
            name: 'CourseMonitorHandlingProcess',
            meta: {
                title: 'cMHandlingProcess',
                icon: 'handing-process',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/course-monitor/handling-process'
            },
            children: [
                /*-------------------------------------- 作业过程追溯 ----------------------------------*/
                {
                    path: 'operation-process',
                    redirect: '/course-monitor/handling-process/operation-process/index',
                    component: () => import('@/views/course-monitor/handling-process/operation-process/index'),
                    name: 'CMOperationProcess',
                    meta: {
                        title: 'cMOperationProcess',
                        // icon: 'handing-process',
                        isShowSlideBar: true,
                        isShowTagsView: false,
                        fullPath:'/course-monitor/handling-process/operation-process/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/course-monitor/handling-process/operation-process/list'),
                            name: 'CMOperationProcessIndex',
                            hidden: true,
                            meta: {
                                title: 'cMOperationProcessIndex',
                                breadcrumb:false,
                                activeMenu: '/course-monitor/handling-process/operation-process',
                                noCache: false,
                                isShowSlideBar: true,
                                isShowTagsView: false,
                                fullPath:'/course-monitor/handling-process/operation-process/index'
                            }
                        },
                    ]
                },

                /*-------------------------------------- 历史报警查询 ----------------------------------*/
                {
                    path: 'historical-alarm-query',
                    redirect: '/course-monitor/handling-process/historical-alarm-query/index',
                    component: () => import('@/views/course-monitor/handling-process/historical-alarm-query/index'),
                    name: 'CMHistoricalAlarmQuery',
                    meta: {
                        title: 'cMHistoricalAlarmQuery',
                        // icon: 'list',
                        isShowSlideBar: true,
                        fullPath:'/course-monitor/handling-process/historical-alarm-query/index'
                    },
                    children: [
                        {
                            path: 'index',
                            redirect: '/course-monitor/handling-process/historical-alarm-query/index/list',
                            component: () => import('@/views/course-monitor/handling-process/historical-alarm-query/index'),
                            name: 'CMHistoricalAlarmQueryIndex',
                            hidden: true,
                            meta: {
                                title: 'cMHistoricalAlarmQueryIndex',
                                breadcrumb:false,
                                activeMenu: '/course-monitor/handling-process/historical-alarm-query',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath:'/course-monitor/handling-process/historical-alarm-query/index'
                            },
                            children:[
                                {
                                    path: 'list',
                                    component: () => import('@/views/course-monitor/handling-process/historical-alarm-query/list'),
                                    name: 'CMHistoricalAlarmQueryList',
                                    hidden: true,
                                    meta: {
                                        title: 'cMHistoricalAlarmQueryList',
                                        breadcrumb:false,
                                        activeMenu: '/course-monitor/handling-process/historical-alarm-query',
                                        noCache: false,
                                        isShowSlideBar: true,
                                        fullPath:'/course-monitor/handling-process/historical-alarm-query/index'
                                    }
                                },
                                {
                                    path: 'alarmList',
                                    component: () => import('@/views/course-monitor/handling-process/historical-alarm-query/alarmList'),
                                    name: 'CMHistoricalAlarmQueryAlarmList',
                                    hidden: true,
                                    meta: {
                                        title: 'cMHistoricalAlarmQueryAlarmList',
                                        activeMenu: '/course-monitor/handling-process/historical-alarm-query',
                                        noCache: false,
                                        isShowSlideBar: true,
                                        fullPath:'/course-monitor/handling-process/historical-alarm-query/index'
                                    }
                                }
                            ]
                        },

                    ]
                },

                /*-------------------------------------- 整改通知 ----------------------------------*/
                {
                    path: 'rectification-notice',
                    redirect: '/course-monitor/handling-process/rectification-notice/index',
                    component: () => import('@/views/course-monitor/handling-process/rectification-notice/index'),
                    name: 'CMRectificationNotice',
                    meta: {
                        title: 'cMRectificationNotice',
                        // icon: 'list',
                        isShowSlideBar: true,
                        fullPath:'/course-monitor/handling-process/rectification-notice/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/course-monitor/handling-process/rectification-notice/list'),
                            name: 'CMRectificationNoticeIndex',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/course-monitor/handling-process/rectification-notice',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath:'/course-monitor/handling-process/rectification-notice/index'
                            }
                        },
                    ]
                },
            ]
        },
        /*-------------------------------------- 进出口综合核验 ----------------------------------*/
        {
            path: 'import-export',
            redirect: '/course-monitor/import-export/record-search/index',
            component: () => import('@/views/course-monitor/import-export/index'),
            name: 'CourseMonitorImportExport',
            meta: {
                title: 'cMImportAndExportSyntheticalVerification',
                icon: 'import-export',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/course-monitor/import-export'
            },
            children: [
                /*-------------------------------------- 进出实时核验 ----------------------------------*/
                /*{
                    path: 'real-verification',
                    redirect: '/course-monitor/import-export/real-verification/index',
                    component: () => import('@/views/course-monitor/import-export/real-verification/index'),
                    name: 'CMImportAndExportRealVerification',
                    meta: {
                        title: 'cMImportAndExportRealVerification',
                        icon: 'list',
                        isShowSlideBar: true,
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/course-monitor/import-export/real-verification/list'),
                            name: 'cMImportAndExportRealVerificationIndex',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/course-monitor/import-export/real-verification',
                                noCache: false,
                                isShowSlideBar: true,
                            }
                        },
                    ]
                },*/
                /*-------------------------------------- 核验记录查询 ----------------------------------*/
                {
                    path: 'record-search',
                    redirect: '/course-monitor/import-export/record-search/index',
                    component: () => import('@/views/course-monitor/import-export/record-search/index'),
                    name: 'CMVerificationRecordSearch',
                    meta: {
                        title: 'cMVerificationRecordSearch',
                        // icon: 'list',
                        isShowSlideBar: true,
                        fullPath:'/course-monitor/import-export/record-search/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/course-monitor/import-export/record-search/list'),
                            name: 'CMVerificationRecordSearchIndex',
                            hidden: true,
                            meta: {
                                title: 'cMVerificationRecordSearchIndex',
                                breadcrumb:false,
                                activeMenu: '/course-monitor/import-export/record-search',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath:'/course-monitor/import-export/record-search/index'
                            }
                        },
                        {
                            path: 'detail',
                            component: () => import('@/views/course-monitor/import-export/record-search/detail'),
                            name: 'cMVerificationRecordSearchDetail',
                            hidden: true,
                            meta: {
                                title: 'cMVerificationRecordSearchDetail',
                                activeMenu: '/course-monitor/import-export/record-search',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath:'/course-monitor/import-export/record-search/index'
                            }
                        },
                    ]
                },
                /*-------------------------------------- 车辆进出口管理 ----------------------------------*/
                {
                    path: 'car-bayonet-manage',
                    redirect: '/course-monitor/import-export/car-bayonet-manage/index',
                    component: () => import('@/views/course-monitor/import-export/car-bayonet-manage/index'),
                    name: 'CarBayonetManage',
                    meta: {
                        title: 'carBayonetManage',
                        // icon: 'list',
                        isShowSlideBar: true,
                        fullPath:'/course-monitor/import-export/car-bayonet-manage/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/course-monitor/import-export/car-bayonet-manage/list'),
                            name: 'CarBayonetManageIndex',
                            hidden: true,
                            meta: {
                                title: 'carBayonetManageIndex',
                                breadcrumb:false,
                                activeMenu: '/course-monitor/import-export/car-bayonet-manage',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath:'/course-monitor/import-export/car-bayonet-manage/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 进出口核验查询 ----------------------------------*/
                {
                    path: 'verification-query',
                    redirect: '/course-monitor/import-export/verification-query/index',
                    component: () => import('@/views/course-monitor/import-export/verification-query/index'),
                    name: 'VerificationQuery',
                    meta: {
                        title: 'verificationQuery',
                        // icon: 'list',
                        isShowSlideBar: true,
                        fullPath:'/course-monitor/import-export/verification-query/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/course-monitor/import-export/verification-query/list'),
                            name: 'VerificationQuery',
                            hidden: true,
                            meta: {
                                title: 'verificationQuery',
                                breadcrumb:false,
                                activeMenu: '/course-monitor/import-export/verification-query',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath:'/course-monitor/import-export/verification-query/index'
                            }
                        }
                    ]
                },
            ]
        },
        /*-------------------------------------- 报警综合查询 ----------------------------------*/
        {
            path: 'alarm-synthesis',
            redirect: '/course-monitor/alarm-synthesis/alarm-synthesis-search/index',
            component: () => import('@/views/course-monitor/alarm-synthesis/index'),
            name: 'CourseMonitorAlarmSynthesis',
            meta: {
                title: 'courseMonitorAlarmSynthesis',
                icon: 'alarm-synthesis',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/course-monitor/alarm-synthesis'
            },
            children: [
                /*-------------------------------------- 报警综合查询 ----------------------------------*/
                {
                    path: 'alarm-synthesis-search',
                    redirect: '/course-monitor/alarm-synthesis/alarm-synthesis-search/index',
                    component: () => import('@/views/course-monitor/alarm-synthesis/index'),
                    name: 'CMAlarmSynthesisQuerySearch',
                    meta: {
                        title: 'cMAlarmSynthesisQuerySearch',
                        breadcrumb:false,//在面包屑中不显示
                        isShowSlideBar: true,
                        fullPath:'/course-monitor/alarm-synthesis/alarm-synthesis-search/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/course-monitor/alarm-synthesis/list'),
                            name: 'CMAlarmSynthesisQueryIndex',
                            hidden: true,
                            meta: {
                                title: 'cMAlarmSynthesisQueryIndex',
                                activeMenu: '/course-monitor/alarm-synthesis/alarm-synthesis-search',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath:'/course-monitor/alarm-synthesis/alarm-synthesis-search/index'
                            }
                        }
                    ]
                },
            ]
        },
    ]
}

export default courseMonitorRouter
