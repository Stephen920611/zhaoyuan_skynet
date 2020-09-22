/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const systemManageRouter = {
    path: '/system-manage',
    component: Layout,
    redirect: '/system-manage/system-log',
    name: 'SystemManageModule',
    meta: {
        title: 'systemManageModule',
        icon: 'configuration',
        isNeedReWriteRedirect: true,
        isShowSlideBar: true,
        fullPath:'/system-manage'
    },
    children: [
        {
            path: 'system-log',
            redirect: '/system-manage/system-log/login-log-info',
            component: () => import('@/views/system-manage/system-log/index'),
            name: 'SystemLogIndex',
            meta: {
                title: 'systemManageModule',
                icon: 'configuration',
                activeMenu: '/system-manage/system-log',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/system-manage/system-log'
            },
            children: [
                {
                    path: 'login-log-info',
                    redirect: '/system-manage/system-log/login-log-info/index',
                    component: () => import('@/views/system-manage/system-log/login-log-info/index'),
                    name: 'SystemLogLoginLogInfoIndex',
                    meta: {
                        title: 'alarmManagerIndex',
                        isShowSlideBar: true,
                        fullPath:'/system-manage/system-log/login-log-info/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/system-manage/system-log/login-log-info/list'),
                            name: 'SystemLogLoginLogInfoList',
                            hidden: true,
                            meta: {
                                title: 'alarmManagerList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/system-manage/system-log/login-log-info',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/system-manage/system-log/login-log-info/index'
                            }
                        }
                    ]
                }
            ]
        },
        /*{
            path: 'alarm-configuration',
            redirect: '/system-manage/alarm-configuration/alarm-manager/index',
            component: () => import('@/views/system-manage/alarm-configuration/index'),
            name: 'AlarmConfigurationIndex',
            meta: {
                title: 'alarmConfigurationIndex',
                icon: 'configuration',
                activeMenu: '/system-manage/system',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/system-manage/alarm-configuration'
            },
            children: [
                {
                    path: 'alarm-manager',
                    redirect: '/system-manage/alarm-configuration/alarm-manager/index',
                    component: () => import('@/views/system-manage/alarm-configuration/alarm-manager/index'),
                    name: 'AlarmManagerIndex',
                    meta: {
                        title: 'alarmManagerIndex',
                        isShowSlideBar: true,
                        fullPath:'/system-manage/alarm-configuration/alarm-manager/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/system-manage/alarm-configuration/alarm-manager/list'),
                            name: 'AlarmManagerList',
                            hidden: true,
                            meta: {
                                title: 'alarmManagerList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/system-manage/alarm-configuration/alarm-manager',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/system-manage/alarm-configuration/alarm-manager/index'
                            }
                        }
                    ]
                }
            ]
        },
        {
            path: 'global-parameter',
            redirect: '/system-manage/global-parameter/parameter-configuration/index',
            component: () => import('@/views/system-manage/global-parameter/index'),
            name: 'GlobalParameterIndex',
            meta: {
                title: 'globalParameterIndex',
                icon: 'parameter',
                activeMenu: '/system-manage/system',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/system-manage/global-parameter'
            },
            children: [
                {
                    path: 'parameter-configuration',
                    redirect: '/system-manage/global-parameter/parameter-configuration/index',
                    component: () => import('@/views/system-manage/global-parameter/parameter-configuration/index'),
                    name: 'ParameterConfigurationIndex',
                    meta: {
                        title: 'parameterConfigurationIndex',
                        isShowSlideBar: true,
                        fullPath:'/system-manage/global-parameter/parameter-configuration/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/system-manage/global-parameter/parameter-configuration/list'),
                            name: 'ParameterConfigurationList',
                            hidden: true,
                            meta: {
                                title: 'parameterConfigurationList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/system-manage/global-parameter/parameter-configuration',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/system-manage/global-parameter/parameter-configuration/index'
                            }
                        }
                    ]
                }
            ]
        }*/

    ]
}

export default systemManageRouter
