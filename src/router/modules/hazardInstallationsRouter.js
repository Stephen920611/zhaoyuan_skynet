/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const hazardInstallationsRouter = {
    path: '/hazard-installations',
    component: Layout,
    redirect: '/hazard-installations/tank-management/tank-management-company',
    name: 'HazardInstallationsModule',
    meta: {
        title: 'hazardInstallationsModule',
        icon: 'hazard',
        isShowSlideBar: true,
        isNeedReWriteRedirect: true,
        fullPath:'/hazard-installations'
    },
    children: [
        /*-------------------------------------- 储罐管理----------------------------------*/
        {
            path: 'tank-management',
            redirect: '/hazard-installations/tank-management/tank-management-company/index',
            component: () => import('@/views/hazard-installations/tank-management/index'),
            name: 'TankManagementIndex',
            meta: {
                title: 'tankManagementIndex',
                icon: 'waybill',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/hazard-installations/tank-management'
            },
            children: [
                /*-------------------------------------- 储罐管理(企业) ----------------------------------*/
                {
                    path: 'tank-management-company',
                    redirect: '/hazard-installations/tank-management/tank-management-company/index',
                    component: () => import('@/views/hazard-installations/tank-management/tank-management-company/index'),
                    name: 'TankManagementCompanyIndex',
                    meta: {
                        title: 'tankManagementCompanyIndex',
                        isShowSlideBar: true,
                        fullPath:'/hazard-installations/tank-management/tank-management-company/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/hazard-installations/tank-management/tank-management-company/list'),
                            name: 'TankManagementCompanyList',
                            hidden: true,
                            meta: {
                                title: 'tankManagementCompanyList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/hazard-installations/tank-management/tank-management-company',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/hazard-installations/tank-management/tank-management-company/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 储罐管理(监管部门) ----------------------------------*/
                {
                    path: 'tank-management-department',
                    redirect: '/hazard-installations/tank-management/tank-management-department/index',
                    component: () => import('@/views/hazard-installations/tank-management/tank-management-department/index'),
                    name: 'TankManagementDepartmentIndex',
                    meta: {
                        title: 'tankManagementDepartmentIndex',
                        isShowSlideBar: true,
                        fullPath:'/hazard-installations/tank-management/tank-management-department/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/hazard-installations/tank-management/tank-management-department/list'),
                            name: 'TankManagementDepartmentList',
                            hidden: true,
                            meta: {
                                title: 'tankManagementDepartmentList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/hazard-installations/tank-management/tank-management-department',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/hazard-installations/tank-management/tank-management-department/index'
                            }
                        }
                    ]
                }
            ]
        },
        /*-------------------------------------- 重大危险源管理单体----------------------------------*/
        {
            path: 'hazard-management',
            redirect: '/hazard-installations/hazard-management/hazard-management-company/index',
            component: () => import('@/views/hazard-installations/hazard-management/index'),
            name: 'HazardManagementIndex',
            meta: {
                title: 'hazardManagementIndex',
                icon: 'waybill',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/hazard-installations/hazard-management'
            },
            children: [
                /*-------------------------------------- 重大危险源管理单体(企业) ----------------------------------*/
                {
                    path: 'hazard-management-company',
                    redirect: '/hazard-installations/hazard-management/hazard-management-company/index',
                    component: () => import('@/views/hazard-installations/hazard-management/hazard-management-company/index'),
                    name: 'HazardManagementCompanyIndex',
                    meta: {
                        title: 'hazardManagementCompanyIndex',
                        isShowSlideBar: true,
                        fullPath:'/hazard-installations/hazard-management/hazard-management-company/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/hazard-installations/hazard-management/hazard-management-company/list'),
                            name: 'HazardManagementCompanyList',
                            hidden: true,
                            meta: {
                                title: 'hazardManagementCompanyList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/hazard-installations/hazard-management/hazard-management-company',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/hazard-installations/hazard-management/hazard-management-company/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 重大危险源管理单体(部门) ----------------------------------*/
                {
                    path: 'hazard-management-department',
                    redirect: '/hazard-installations/hazard-management/hazard-management-department/index',
                    component: () => import('@/views/hazard-installations/hazard-management/hazard-management-department/index'),
                    name: 'HazardManagementDepartmentIndex',
                    meta: {
                        title: 'hazardManagementDepartmentIndex',
                        isShowSlideBar: true,
                        fullPath:'/hazard-installations/hazard-management/hazard-management-department/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/hazard-installations/hazard-management/hazard-management-department/list'),
                            name: 'HazardManagementDepartmentList',
                            hidden: true,
                            meta: {
                                title: 'hazardManagementDepartmentList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/hazard-installations/hazard-management/hazard-management-department',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/hazard-installations/hazard-management/hazard-management-department/index'
                            }
                        }
                    ]
                },
            ]
        },
    ]
};

export default hazardInstallationsRouter
