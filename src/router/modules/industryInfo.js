/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const industryInfoRouter = {
    path: '/industry-info',
    component: Layout,
    redirect: '/industry-info/electronic-waybill/waybill-manager',
    name: 'IndustryInfoModule',
    meta: {
        title: 'industryInfoModule',
        icon: 'industry',
        // breadcrumb: false,  //在面包屑中隐藏
        isShowSlideBar: true,
        isNeedReWriteRedirect: true,
        fullPath:'/industry-info'
    },
    children: [
        {
            path: 'electronic-waybill',
            redirect: '/industry-info/electronic-waybill/waybill-manager/index',
            component: () => import('@/views/industry-info/electronic-waybill/index'),
            name: 'ElectronicWaybillIndex',
            meta: {
                title: 'electronicWaybillIndex',
                icon: 'waybill',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/industry-info/electronic-waybill'
            },
            children: [
                {
                    path: 'waybill-manager',
                    redirect: '/industry-info/electronic-waybill/waybill-manager/index',
                    component: () => import('@/views/industry-info/electronic-waybill/waybill-manager/index'),
                    name: 'WaybillManagerIndex',
                    meta: {
                        title: 'waybillManagerIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/electronic-waybill/waybill-manager/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/electronic-waybill/waybill-manager/list'),
                            name: 'WaybillManagerList',
                            hidden: true,
                            meta: {
                                title: 'waybillManagerList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/electronic-waybill/waybill-manager',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/electronic-waybill/waybill-manager/index'
                            }
                        }
                    ]
                }/*,
                {
                    path: 'order-track',
                    redirect: '/industry-info/electronic-waybill/order-track/index',
                    component: () => import('@/views/industry-info/electronic-waybill/order-track/index'),
                    name: 'OrderTrackIndex',
                    meta: {
                        title: 'orderTrackIndex',
                        isShowSlideBar: true
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/electronic-waybill/order-track/list'),
                            name: 'OrderTrackList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/industry-info/electronic-waybill/order-track',
                                noCache: true,
                                isShowSlideBar: true
                            }
                        }
                    ]
                },
                {
                    path: 'warehouse-order',
                    redirect: '/industry-info/electronic-waybill/warehouse-order/index',
                    component: () => import('@/views/industry-info/electronic-waybill/warehouse-order/index'),
                    name: 'WarehouseOrderIndex',
                    meta: {
                        title: 'warehouseOrderIndex',
                        isShowSlideBar: true
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/electronic-waybill/warehouse-order/list'),
                            name: 'WarehouseOrderList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/industry-info/electronic-waybill/warehouse-order',
                                noCache: true,
                                isShowSlideBar: true
                            }
                        }
                    ]
                },
                {
                    path: 'warehouse-audit',
                    redirect: '/industry-info/electronic-waybill/warehouse-audit/index',
                    component: () => import('@/views/industry-info/electronic-waybill/warehouse-audit/index'),
                    name: 'WarehouseAuditIndex',
                    meta: {
                        title: 'warehouseAuditIndex',
                        isShowSlideBar: true
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/electronic-waybill/warehouse-audit/list'),
                            name: 'WarehouseAuditList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/industry-info/electronic-waybill/warehouse-audit',
                                noCache: true,
                                isShowSlideBar: true
                            }
                        }
                    ]
                }*/
            ]
        },
        {
            path: 'base-info',
            redirect: '/industry-info/base-info/administrate-region/index',
            component: () => import('@/views/industry-info/base-info/index'),
            name: 'BaseInfoIndex',
            meta: {
                title: 'baseInfoIndex',
                icon: 'industry',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/industry-info/base-info'
            },
            children: [
                {
                    path: 'administrate-region',
                    redirect: '/industry-info/base-info/administrate-region/index',
                    component: () => import('@/views/industry-info/base-info/administrate-region/index'),
                    name: 'RegionIndex',
                    meta: {
                        title: 'regionIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/base-info/administrate-region/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/base-info/administrate-region/list'),
                            name: 'RegionList',
                            hidden: true,
                            meta: {
                                title: 'regionList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/base-info/administrate-region',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/base-info/administrate-region/index'
                            }
                        }
                    ]
                },
                {
                    path: 'danger-directory',
                    redirect: '/industry-info/base-info/danger-directory/index',
                    component: () => import('@/views/industry-info/base-info/danger-directory/index'),
                    name: 'DangerDirectoryIndex',
                    meta: {
                        title: 'dangerDirectoryIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/base-info/danger-directory/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/base-info/danger-directory/list'),
                            name: 'DangerDirectoryList',
                            hidden: true,
                            meta: {
                                title: 'dangerDirectoryList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/base-info/danger-directory',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/base-info/danger-directory/index'
                            }
                        }
                    ]
                },
                {
                    path: 'road-code-info',
                    redirect: '/industry-info/base-info/road-code-info/index',
                    component: () => import('@/views/industry-info/base-info/road-code-info/index'),
                    name: 'RoadCodeInfoIndex',
                    meta: {
                        title: 'roadCodeInfoIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/base-info/road-code-info/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/base-info/road-code-info/list'),
                            name: 'RoadCodeInfoList',
                            hidden: true,
                            meta: {
                                title: 'roadCodeInfoList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/base-info/road-code-info',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/base-info/road-code-info/index'
                            }
                        }
                    ]
                },
                {
                    path: 'restricted-road',
                    redirect: '/industry-info/base-info/restricted-road/index',
                    component: () => import('@/views/industry-info/base-info/restricted-road/index'),
                    name: 'RestrictedRoadIndex',
                    meta: {
                        title: 'RestrictedRoadIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/base-info/restricted-road/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/base-info/restricted-road/list'),
                            name: 'RestrictedRoadList',
                            hidden: true,
                            meta: {
                                title: 'restrictedRoadList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/base-info/restricted-road',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/base-info/restricted-road/index'
                            }
                        }
                    ]
                },
                {
                    path: 'tunnel-information',
                    redirect: '/industry-info/base-info/tunnel-information/index',
                    component: () => import('@/views/industry-info/base-info/tunnel-information/index'),
                    name: 'TunnelInformationIndex',
                    meta: {
                        title: 'TunnelInformationIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/base-info/tunnel-information/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/base-info/tunnel-information/list'),
                            name: 'TunnelInformationList',
                            hidden: true,
                            meta: {
                                title: 'tunnelInformationList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/base-info/tunnel-information',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/base-info/tunnel-information/index'
                            }
                        }
                    ]
                },
                {
                    path: 'bridge-information',
                    redirect: '/industry-info/base-info/bridge-information/index',
                    component: () => import('@/views/industry-info/base-info/bridge-information/index'),
                    name: 'BridgeInformationIndex',
                    meta: {
                        title: 'bridgeInformationIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/base-info/bridge-information/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/base-info/bridge-information/list'),
                            name: 'BridgeInformationList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/industry-info/base-info/bridge-information',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/base-info/bridge-information/index'
                            }
                        }
                    ]
                },
                {
                    path: 'parking-information',
                    redirect: '/industry-info/base-info/parking-information/index',
                    component: () => import('@/views/industry-info/base-info/parking-information/index'),
                    name: 'ParkingInformationIndex',
                    meta: {
                        title: 'parkingInformationIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/base-info/parking-information/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/base-info/parking-information/list'),
                            name: 'ParkingInformationList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/industry-info/base-info/parking-information',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/base-info/parking-information/index'
                            }
                        }
                    ]
                },
                {
                    path: 'inlet-outlet',
                    redirect: '/industry-info/base-info/inlet-outlet/index',
                    component: () => import('@/views/industry-info/base-info/inlet-outlet/index'),
                    name: 'InletOutletIndex',
                    meta: {
                        title: 'inletOutletIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/base-info/inlet-outlet/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/base-info/inlet-outlet/list'),
                            name: 'inletOutletList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/industry-info/base-info/parking-information',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/base-info/inlet-outlet/index'
                            }
                        }
                    ]
                },
                {
                    path: 'loading-unloading',
                    redirect: '/industry-info/base-info/loading-unloading/index',
                    component: () => import('@/views/industry-info/base-info/loading-unloading/index'),
                    name: 'LoadingUnloadingIndex',
                    meta: {
                        title: 'loadingUnloadingIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/base-info/loading-unloading/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/base-info/loading-unloading/list'),
                            name: 'loadingUnloadingList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/industry-info/base-info/loading-unloading',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/base-info/loading-unloading/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 企业标注----------------------------------*/
                {
                    path: 'enterprise-label',
                    redirect: '/industry-info/base-info/enterprise-label/index',
                    component: () => import('@/views/industry-info/base-info/enterprise-label/index'),
                    name: 'EnterpriseLabelIndex',
                    meta: {
                        title: 'enterpriseLabelIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/base-info/enterprise-label/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/base-info/enterprise-label/list'),
                            name: 'enterpriseLabelList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/industry-info/base-info/enterprise-label',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/base-info/enterprise-label/index'
                            }
                        }
                    ]
                },
            ]
        },
        {
            path: 'enterprise-management',
            redirect: '/industry-info/enterprise-management/enterprise-info/index',
            component: () => import('@/views/industry-info/enterprise-management/index'),
            name: 'EnterpriseManagementIndex',
            meta: {
                title: 'enterpriseManagementIndex',
                icon: 'enterprise',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/industry-info/enterprise-management'
            },
            children: [
                {
                    path: 'enterprise-info',
                    redirect: '/industry-info/enterprise-management/enterprise-info/index',
                    component: () => import('@/views/industry-info/enterprise-management/enterprise-info/index'),
                    name: 'EnterpriseInfoIndex',
                    meta: {
                        title: 'enterpriseInfoIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/enterprise-management/enterprise-info/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/enterprise-management/enterprise-info/list'),
                            name: 'EnterpriseInfoList',
                            hidden: true,
                            meta: {
                                title: 'enterpriseInfoList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/enterprise-management/enterprise-info',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/enterprise-management/enterprise-info/index'
                            }
                        }
                    ]
                },
                {
                    path: 'personnel-info',
                    redirect: '/industry-info/enterprise-management/personnel-info/index',
                    component: () => import('@/views/industry-info/enterprise-management/personnel-info/index'),
                    name: 'PersonnelInfoIndex',
                    meta: {
                        title: 'personnelInfoIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/enterprise-management/personnel-info/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/enterprise-management/personnel-info/list'),
                            name: 'PersonnelInfoList',
                            hidden: true,
                            meta: {
                                title: 'personnelInfoList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/enterprise-management/personnel-info',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/enterprise-management/personnel-info/index'
                            }
                        }
                    ]
                },{
                    path: 'vehicle-info',
                    redirect: '/industry-info/enterprise-management/vehicle-info/index',
                    component: () => import('@/views/industry-info/enterprise-management/vehicle-info/index'),
                    name: 'VehicleInfoIndex',
                    meta: {
                        title: 'vehicleInfoIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/enterprise-management/vehicle-info/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/enterprise-management/vehicle-info/list'),
                            name: 'VehicleInfoList',
                            hidden: true,
                            meta: {
                                title: 'vehicleInfoList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/enterprise-management/vehicle-info',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/enterprise-management/vehicle-info/index'
                            }
                        }
                    ]
                },
            ]
        },
        /*-------------------------------------- 装卸位管理 ----------------------------------*/
        {
            path: 'loading-management',
            redirect: '/industry-info/loading-management/loading-management-search/index',
            component: () => import('@/views/course-monitor/loading-management/index'),
            name: 'CourseMonitorLoadingManagement',
            meta: {
                title: 'courseMonitorLoadingDockManagement',
                icon: 'alarm-synthesis',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/industry-info/loading-management'
            },
            children: [
                /*-------------------------------------- 装卸位管理 ----------------------------------*/
                {
                    path: 'loading-management-search',
                    redirect: '/industry-info/loading-management/loading-management-search/index',
                    component: () => import('@/views/course-monitor/loading-management/index'),
                    name: 'CMLoadingManagementSearch',
                    meta: {
                        title: 'cMLoadingManagementSearch',
                        breadcrumb:false,//在面包屑中不显示
                        isShowSlideBar: true,
                        fullPath:'/industry-info/loading-management/loading-management-search/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/course-monitor/loading-management/center-loading-management/list'),
                            name: 'CMLoadingManagementIndex',
                            hidden: true,
                            meta: {
                                title: 'cMLoadingManagementIndex',
                                activeMenu: '/industry-info/loading-management/loading-management-search',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/loading-management/loading-management-search/index'
                            }
                        }
                    ]
                },
            ]
        },
        /*{
            path: 'transport-qualify',
            redirect: '/industry-info/transport-qualify/company-qualify/index',
            component: () => import('@/views/industry-info/transport-qualify/index'),
            name: 'TransportQualifyIndex',
            meta: {
                title: 'transportQualifyIndex',
                icon: 'list',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/industry-info/transport-qualify'
            },
            children: [
                {
                    path: 'company-qualify',
                    redirect: '/industry-info/transport-qualify/company-qualify/index',
                    component: () => import('@/views/industry-info/transport-qualify/company-qualify/index'),
                    name: 'CompanyQualifyIndex',
                    meta: {
                        title: 'companyQualifyIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/transport-qualify/company-qualify/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/transport-qualify/company-qualify/list'),
                            name: 'CompanyQualifyList',
                            hidden: true,
                            meta: {
                                title: 'companyQualifyList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/transport-qualify/company-qualify',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/transport-qualify/company-qualify/index'
                            }
                        }
                    ]
                },
                {
                    path: 'transport-certificate',
                    redirect: '/industry-info/transport-qualify/transport-certificate/index',
                    component: () => import('@/views/industry-info/transport-qualify/transport-certificate/index'),
                    name: 'TransportCertificateIndex',
                    meta: {
                        title: 'transportCertificateIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/transport-qualify/transport-certificate/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/transport-qualify/transport-certificate/list'),
                            name: 'TransportCertificateList',
                            hidden: true,
                            meta: {
                                title: 'transportCertificateList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/transport-qualify/transport-certificate',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/transport-qualify/transport-certificate/index'
                            }
                        }
                    ]
                },
                {
                    path: 'run-card',
                    redirect: '/industry-info/transport-qualify/run-card/index',
                    component: () => import('@/views/industry-info/transport-qualify/run-card/index'),
                    name: 'RunCardIndex',
                    meta: {
                        title: 'runCardIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/transport-qualify/run-card/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/transport-qualify/run-card/list'),
                            name: 'RunCardList',
                            hidden: true,
                            meta: {
                                title: 'runCardList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/transport-qualify/run-card',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/transport-qualify/run-card/index'
                            }
                        }
                    ]
                },
                {
                    path: 'driving-card',
                    redirect: '/industry-info/transport-qualify/driving-card/index',
                    component: () => import('@/views/industry-info/transport-qualify/driving-card/index'),
                    name: 'DrivingCardIndex',
                    meta: {
                        title: 'drivingCardIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/transport-qualify/driving-card/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/transport-qualify/driving-card/list'),
                            name: 'DrivingCardList',
                            hidden: true,
                            meta: {
                                title: 'drivingCardList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/transport-qualify/driving-card',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/transport-qualify/driving-card/index'
                            }
                        }
                    ]
                },
                {
                    path: 'qualification-certificate',
                    redirect: '/industry-info/transport-qualify/qualification-certificate/index',
                    component: () => import('@/views/industry-info/transport-qualify/qualification-certificate/index'),
                    name: 'QualificationCertificateIndex',
                    meta: {
                        title: 'qualificationCertificateIndex',
                        isShowSlideBar: true,
                        fullPath:'/industry-info/transport-qualify/qualification-certificate/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/industry-info/transport-qualify/qualification-certificate/list'),
                            name: 'QualificationCertificateList',
                            hidden: true,
                            meta: {
                                title: 'qualificationCertificateList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/industry-info/transport-qualify/qualification-certificate',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/industry-info/transport-qualify/qualification-certificate/index'
                            }
                        }
                    ]
                }
            ]
        }*/
        /*,
        {
            path: 'way-bill',
            redirect: '/industry-info/way-bill/list',
            component: () => import('@/views/industry-info/way-bill/index'),
            name: 'WayBillIndex',
            meta: {
                title: '',
                icon: 'list',
                isShowSlideBar: true
            },
            children: [
                {
                    path: 'list',
                    component: () => import('@/views/industry-info/way-bill/list'),
                    name: 'WayBillList',
                    meta: {
                        title: 'wayBillList',
                        activeMenu: '/industry-info/way-bill/list',
                        noCache: true,
                        isShowSlideBar: true
                    }
                },
            ]
        }*/
    ]
}

export default industryInfoRouter
