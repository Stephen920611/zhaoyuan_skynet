/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const emergencyManagementRouter = {
    path: '/emergency-management',
    component: Layout,
    redirect: '/emergency-management/emergency-plan-management/index',
    name: 'EmergencyManagementModule',
    meta: {
        title: 'emergencyManagementModule',
        icon: 'hazard',
        // breadcrumb: false,  //在面包屑中隐藏
        isShowSlideBar: true,
        isNeedReWriteRedirect: true,
        fullPath: '/emergency-management'
    },
    children: [
        /*-------------------------------------- 应急管理首页 ----------------------------------*/
        {
            path: 'emergency-home',
            redirect: '/emergency-management/emergency-home/index',
            component: () => import('@/views/emergency-management/emergency-home/list'),
            name: 'EmergencyHome',
            meta: {
                title: 'emergencyHome',
                icon: 'handing-process',
                isShowSlideBar: true,
                fullPath: '/emergency-management/emergency-home/index'
            },
            children: [
                {
                    path: 'index',
                    component: () => import('@/views/emergency-management/emergency-home/index'),
                    name: 'EmergencyHomeIndex',
                    hidden: true,
                    meta: {
                        title: 'emergencyHomeIndex',
                        breadcrumb: false,
                        activeMenu: '/emergency-management/emergency-home',
                        noCache: false,
                        isShowSlideBar: true,
                        fullPath: '/emergency-management/emergency-home/index'
                    }
                },
            ]
        },
        /*-------------------------------------- 应急预案管理 ----------------------------------*/
        {
            path: 'emergency-plan-management',
            redirect: '/emergency-management/emergency-plan-management/index',
            component: () => import('@/views/emergency-management/emergency-plan-management/index'),
            name: 'EmergencyManagementPlan',
            meta: {
                title: 'eMEmergencyPlanManagement',
                icon: 'handing-process',
                isShowSlideBar: true,
                fullPath: '/emergency-management/emergency-plan-management'
            },
            children: [
                /*-------------------------------------- 应急预案管理 ----------------------------------*/
                {
                    path: 'index',
                    component: () => import('@/views/emergency-management/emergency-plan-management/list'),
                    name: 'EMPlanIndex',
                    hidden: true,
                    meta: {
                        title: 'eMPlanIndex',
                        breadcrumb: false,
                        activeMenu: '/emergency-management/emergency-plan-management',
                        noCache: false,
                        isShowSlideBar: true,
                        fullPath: '/emergency-management/emergency-plan-management/index'
                    }
                },
                /*-------------------------------------- 添加应急预案 ----------------------------------*/
                {
                    path: 'addPlan',
                    component: () => import('@/views/emergency-management/emergency-plan-management/addPlan'),
                    name: 'EMPlanAdd',
                    hidden: true,
                    meta: {
                        title: 'eMPlanAdd',
                        // breadcrumb: false,
                        activeMenu: '/emergency-management/emergency-plan-management',
                        noCache: false,
                        isShowSlideBar: true,
                        fullPath: '/emergency-management/emergency-plan-management/index'
                    }
                },
                /*-------------------------------------- 编辑应急预案 ----------------------------------*/
                {
                    path: 'editPlan',
                    component: () => import('@/views/emergency-management/emergency-plan-management/editPlan'),
                    name: 'EMPlanEdit',
                    hidden: true,
                    meta: {
                        title: 'eMPlanEdit',
                        // breadcrumb: false,
                        activeMenu: '/emergency-management/emergency-plan-management',
                        noCache: false,
                        isShowSlideBar: true,
                        fullPath: '/emergency-management/emergency-plan-management/index'
                    }
                },
            ]
        },
        /*-------------------------------------- 应急资源管理 ----------------------------------*/
        {
            path: 'emergency-resource-management',
            redirect: '/emergency-management/emergency-resource-management/material-reserve/index',
            component: () => import('@/views/emergency-management/emergency-resource-management/index'),
            name: 'EmergencyManagementResource',
            meta: {
                title: 'eMEmergencyResourceManagement',
                icon: 'import-export',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath: '/emergency-management/emergency-resource-management'
            },
            children: [
                /*-------------------------------------- 应急物资储备库 ----------------------------------*/
                {
                    path: 'material-reserve',
                    redirect: '/emergency-management/emergency-resource-management/material-reserve/index',
                    component: () => import('@/views/emergency-management/emergency-resource-management/index'),
                    name: 'EMMaterialReserve',
                    meta: {
                        title: 'eMMaterialReserve',
                        breadcrumb: false,//在面包屑中不显示
                        isShowSlideBar: true,
                        fullPath: '/emergency-management/emergency-resource-management/material-reserve/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/emergency-management/emergency-resource-management/material-reserve/list'),
                            name: 'EMMaterialReserveIndex',
                            hidden: true,
                            meta: {
                                title: 'eMMaterialReserveIndex',
                                activeMenu: '/emergency-management/emergency-resource-management/material-reserve',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath: '/emergency-management/emergency-resource-management/material-reserve/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 应急队伍 ----------------------------------*/
                {
                    path: 'emergency-team',
                    redirect: '/emergency-management/emergency-resource-management/emergency-team/index',
                    component: () => import('@/views/emergency-management/emergency-resource-management/index'),
                    name: 'EMEmergencyTeam',
                    meta: {
                        title: 'eMEmergencyTeam',
                        breadcrumb: false,//在面包屑中不显示
                        isShowSlideBar: true,
                        fullPath: '/emergency-management/emergency-resource-management/emergency-team/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/emergency-management/emergency-resource-management/emergency-team/list'),
                            name: 'EMEmergencyTeamIndex',
                            hidden: true,
                            meta: {
                                title: 'eMEmergencyTeamIndex',
                                activeMenu: '/emergency-management/emergency-resource-management/emergency-team',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath: '/emergency-management/emergency-resource-management/emergency-team/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 应急人员 ----------------------------------*/
                {
                    path: 'emergency-personnel',
                    redirect: '/emergency-management/emergency-resource-management/emergency-personnel/index',
                    component: () => import('@/views/emergency-management/emergency-resource-management/index'),
                    name: 'EMEmergencyPersonnel',
                    meta: {
                        title: 'eMEmergencyPersonnel',
                        breadcrumb: false,//在面包屑中不显示
                        isShowSlideBar: true,
                        fullPath: '/emergency-management/emergency-resource-management/emergency-personnel/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/emergency-management/emergency-resource-management/emergency-personnel/list'),
                            name: 'EMEmergencyPersonnelIndex',
                            hidden: true,
                            meta: {
                                title: 'eMEmergencyPersonnelIndex',
                                activeMenu: '/emergency-management/emergency-resource-management/emergency-personnel',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath: '/emergency-management/emergency-resource-management/emergency-personnel/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 应急资源 ----------------------------------*/
                {
                    path: 'emergency-resources',
                    redirect: '/emergency-management/emergency-resource-management/emergency-resources/index',
                    component: () => import('@/views/emergency-management/emergency-resource-management/index'),
                    name: 'EMEmergencyResources',
                    meta: {
                        title: 'eMEmergencyResources',
                        breadcrumb: false,//在面包屑中不显示
                        isShowSlideBar: true,
                        fullPath: '/emergency-management/emergency-resource-management/emergency-resources/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/emergency-management/emergency-resource-management/emergency-resources/list'),
                            name: 'EMEmergencyResourcesIndex',
                            hidden: true,
                            meta: {
                                title: 'eMEmergencyResourcesIndex',
                                activeMenu: '/emergency-management/emergency-resource-management/emergency-resources',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath: '/emergency-management/emergency-resource-management/emergency-resources/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 外部资源 ----------------------------------*/
                {
                    path: 'external-resources',
                    redirect: '/emergency-management/emergency-resource-management/external-resources/index',
                    component: () => import('@/views/emergency-management/emergency-resource-management/index'),
                    name: 'EMExternalResources',
                    meta: {
                        title: 'eMExternalResources',
                        breadcrumb: false,//在面包屑中不显示
                        isShowSlideBar: true,
                        fullPath: '/emergency-management/emergency-resource-management/external-resources/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/emergency-management/emergency-resource-management/external-resources/list'),
                            name: 'EMExternalResourcesIndex',
                            hidden: true,
                            meta: {
                                title: 'eMExternalResourcesIndex',
                                activeMenu: '/emergency-management/emergency-resource-management/external-resources',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath: '/emergency-management/emergency-resource-management/external-resources/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 外部资源 ----------------------------------*/
                {
                    path: 'expert-database',
                    redirect: '/emergency-management/emergency-resource-management/expert-database/index',
                    component: () => import('@/views/emergency-management/emergency-resource-management/index'),
                    name: 'ExpertDatabase',
                    meta: {
                        title: 'expertDatabase',
                        breadcrumb: false,//在面包屑中不显示
                        isShowSlideBar: true,
                        fullPath: '/emergency-management/emergency-resource-management/expert-database/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/emergency-management/emergency-resource-management/expert-database/list'),
                            name: 'ExpertDatabaseIndex',
                            hidden: true,
                            meta: {
                                title: 'expertDatabaseIndex',
                                activeMenu: '/emergency-management/emergency-resource-management/expert-database',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath: '/emergency-management/emergency-resource-management/expert-database/index'
                            }
                        }
                    ]
                },
            ]
        },
        /*-------------------------------------- 应急培训与演习 ----------------------------------*/
        {
            path: 'training-exercises',
            redirect: '/emergency-management/training-exercises/training/index',
            component: () => import('@/views/emergency-management/training-exercises/index'),
            name: 'EMTrainingExercises',
            meta: {
                title: 'eMTrainingExercises',
                icon: 'alarm-synthesis',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath: '/emergency-management/training-exercises'
            },
            children: [
                /*-------------------------------------- 应急培训 ----------------------------------*/
                {
                    path: 'training',
                    redirect: '/emergency-management/training-exercises/training/index',
                    component: () => import('@/views/emergency-management/training-exercises/index'),
                    name: 'EMTraining',
                    meta: {
                        title: 'eMTraining',
                        breadcrumb: false,//在面包屑中不显示
                        isShowSlideBar: true,
                        fullPath: '/emergency-management/training-exercises/training/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/emergency-management/training-exercises/training/list'),
                            name: 'EMTrainingIndex',
                            hidden: true,
                            meta: {
                                title: 'eMTrainingIndex',
                                activeMenu: '/emergency-management/training-exercises/training',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath: '/emergency-management/training-exercises/training/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 应急演习 ----------------------------------*/
                {
                    path: 'exercise',
                    redirect: '/emergency-management/training-exercises/exercise/index',
                    component: () => import('@/views/emergency-management/training-exercises/index'),
                    name: 'EMExercise',
                    meta: {
                        title: 'eMExercise',
                        breadcrumb: false,//在面包屑中不显示
                        isShowSlideBar: true,
                        fullPath: '/emergency-management/training-exercises/exercise/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/emergency-management/training-exercises/exercise/list'),
                            name: 'EMExerciseIndex',
                            hidden: true,
                            meta: {
                                title: 'eMExerciseIndex',
                                activeMenu: '/emergency-management/training-exercises/exercise',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath: '/emergency-management/training-exercises/exercise/index'
                            }
                        }
                    ]
                },
            ]
        },
        /*-------------------------------------- 重大危险源管理 ----------------------------------*/
        {
            path: 'hazard-module',
            redirect: '/emergency-management/hazard-module/tank-management-company/index',
            component: () => import('@/views/hazard-installations/tank-management/index'),
            name: 'HazardInstallationsModule',
            meta: {
                title: 'hazardInstallationsModule',
                icon: 'hazard',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/emergency-management/hazard-module'
            },
            children: [
                /*-------------------------------------- 储罐管理(企业) ----------------------------------*/
                {
                    path: 'tank-management-company',
                    redirect: '/emergency-management/hazard-module/tank-management-company/index',
                    component: () => import('@/views/hazard-installations/tank-management/tank-management-company/index'),
                    name: 'TankManagementCompanyIndex',
                    meta: {
                        title: 'tankManagementCompanyIndex',
                        isShowSlideBar: true,
                        fullPath:'/emergency-management/hazard-module/tank-management-company/index'
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
                                activeMenu: '/emergency-management/hazard-module/tank-management-company',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/emergency-management/hazard-module/tank-management-company/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 储罐管理(监管部门) ----------------------------------*/
                {
                    path: 'tank-management-department',
                    redirect: '/emergency-management/hazard-module/tank-management-department/index',
                    component: () => import('@/views/hazard-installations/tank-management/tank-management-department/index'),
                    name: 'TankManagementDepartmentIndex',
                    meta: {
                        title: 'tankManagementDepartmentIndex',
                        isShowSlideBar: true,
                        fullPath:'/emergency-management/hazard-module/tank-management-department/index'
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
                                activeMenu: '/emergency-management/hazard-module/tank-management-department',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/emergency-management/hazard-module/tank-management-department/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 重大危险源管理单体(企业) ----------------------------------*/
                {
                    path: 'hazard-management-company',
                    redirect: '/emergency-management/hazard-module/hazard-management-company/index',
                    component: () => import('@/views/hazard-installations/hazard-management/hazard-management-company/index'),
                    name: 'HazardManagementCompanyIndex',
                    meta: {
                        title: 'hazardManagementCompanyIndex',
                        isShowSlideBar: true,
                        fullPath:'/emergency-management/hazard-module/hazard-management-company/index'
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
                                activeMenu: '/emergency-management/hazard-module/hazard-management-company',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/emergency-management/hazard-module/hazard-management-company/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 重大危险源管理单体(部门) ----------------------------------*/
                {
                    path: 'hazard-management-department',
                    redirect: '/emergency-management/hazard-module/hazard-management-department/index',
                    component: () => import('@/views/hazard-installations/hazard-management/hazard-management-department/index'),
                    name: 'HazardManagementDepartmentIndex',
                    meta: {
                        title: 'hazardManagementDepartmentIndex',
                        isShowSlideBar: true,
                        fullPath:'/emergency-management/hazard-module/hazard-management-department/index'
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
                                activeMenu: '/emergency-management/hazard-module/hazard-management-department',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/emergency-management/hazard-module/hazard-management-department/index'
                            }
                        }
                    ]
                },
            ]
        },
    ]
}

export default emergencyManagementRouter
