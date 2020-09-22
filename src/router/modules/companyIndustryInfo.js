/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const companyIndustryInfoRouter = {
    path: '/company-industry-info',
    component: Layout,
    redirect: '/company-industry-info/electronic-waybill/waybill-manager',
    name: 'CIndustryInfoModule',
    meta: {
        title: 'cIndustryInfoModule',
        icon: 'industry',
        // breadcrumb: false,  //在面包屑中隐藏
        isShowSlideBar: true,
        isNeedReWriteRedirect: true,
        fullPath:'/company-industry-info'
    },
    children: [
        {
            path: 'electronic-waybill',
            redirect: '/company-industry-info/electronic-waybill/waybill-manager/index',
            component: () => import('@/views/company-industry-info/electronic-waybill/index'),
            name: 'CElectronicWaybillIndex',
            meta: {
                title: 'cElectronicWaybillIndex',
                icon: 'waybill',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/company-industry-info/electronic-waybill'
            },
            children: [
                {
                    path: 'waybill-manager',
                    redirect: '/company-industry-info/electronic-waybill/waybill-manager/index',
                    component: () => import('@/views/company-industry-info/electronic-waybill/waybill-manager/index'),
                    name: 'CWaybillManagerIndex',
                    meta: {
                        title: 'cWaybillManagerIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/electronic-waybill/waybill-manager/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/electronic-waybill/waybill-manager/list'),
                            name: 'CWaybillManagerList',
                            hidden: true,
                            meta: {
                                title: 'cWaybillManagerList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/company-industry-info/electronic-waybill/waybill-manager',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/electronic-waybill/waybill-manager/index'
                            }
                        }
                    ]
                }/*,
                {
                    path: 'order-track',
                    redirect: '/company-industry-info/electronic-waybill/order-track/index',
                    component: () => import('@/views/company-industry-info/electronic-waybill/order-track/index'),
                    name: 'OrderTrackIndex',
                    meta: {
                        title: 'orderTrackIndex',
                        isShowSlideBar: true
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/electronic-waybill/order-track/list'),
                            name: 'OrderTrackList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/company-industry-info/electronic-waybill/order-track',
                                noCache: true,
                                isShowSlideBar: true
                            }
                        }
                    ]
                },
                {
                    path: 'warehouse-order',
                    redirect: '/company-industry-info/electronic-waybill/warehouse-order/index',
                    component: () => import('@/views/company-industry-info/electronic-waybill/warehouse-order/index'),
                    name: 'WarehouseOrderIndex',
                    meta: {
                        title: 'warehouseOrderIndex',
                        isShowSlideBar: true
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/electronic-waybill/warehouse-order/list'),
                            name: 'WarehouseOrderList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/company-industry-info/electronic-waybill/warehouse-order',
                                noCache: true,
                                isShowSlideBar: true
                            }
                        }
                    ]
                },
                {
                    path: 'warehouse-audit',
                    redirect: '/company-industry-info/electronic-waybill/warehouse-audit/index',
                    component: () => import('@/views/company-industry-info/electronic-waybill/warehouse-audit/index'),
                    name: 'WarehouseAuditIndex',
                    meta: {
                        title: 'warehouseAuditIndex',
                        isShowSlideBar: true
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/electronic-waybill/warehouse-audit/list'),
                            name: 'WarehouseAuditList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/company-industry-info/electronic-waybill/warehouse-audit',
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
            redirect: '/company-industry-info/base-info/administrate-region/index',
            component: () => import('@/views/company-industry-info/base-info/index'),
            name: 'CBaseInfoIndex',
            meta: {
                title: 'cBaseInfoIndex',
                icon: 'industry',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/company-industry-info/base-info'
            },
            children: [
                {
                    path: 'administrate-region',
                    redirect: '/company-industry-info/base-info/administrate-region/index',
                    component: () => import('@/views/company-industry-info/base-info/administrate-region/index'),
                    name: 'CRegionIndex',
                    meta: {
                        title: 'cRegionIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/base-info/administrate-region/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/base-info/administrate-region/list'),
                            name: 'CRegionList',
                            hidden: true,
                            meta: {
                                title: 'cRegionList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/company-industry-info/base-info/administrate-region',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/base-info/administrate-region/index'
                            }
                        }
                    ]
                },
                {
                    path: 'danger-directory',
                    redirect: '/company-industry-info/base-info/danger-directory/index',
                    component: () => import('@/views/company-industry-info/base-info/danger-directory/index'),
                    name: 'CDangerDirectoryIndex',
                    meta: {
                        title: 'cDangerDirectoryIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/base-info/danger-directory/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/base-info/danger-directory/list'),
                            name: 'CDangerDirectoryList',
                            hidden: true,
                            meta: {
                                title: 'cDangerDirectoryList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/company-industry-info/base-info/danger-directory',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/base-info/danger-directory/index'
                            }
                        }
                    ]
                },
                {
                    path: 'road-code-info',
                    redirect: '/company-industry-info/base-info/road-code-info/index',
                    component: () => import('@/views/company-industry-info/base-info/road-code-info/index'),
                    name: 'CRoadCodeInfoIndex',
                    meta: {
                        title: 'cRoadCodeInfoIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/base-info/road-code-info/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/base-info/road-code-info/list'),
                            name: 'CRoadCodeInfoList',
                            hidden: true,
                            meta: {
                                title: 'cRoadCodeInfoList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/company-industry-info/base-info/road-code-info',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/base-info/road-code-info/index'
                            }
                        }
                    ]
                },
                {
                    path: 'restricted-road',
                    redirect: '/company-industry-info/base-info/restricted-road/index',
                    component: () => import('@/views/company-industry-info/base-info/restricted-road/index'),
                    name: 'CRestrictedRoadIndex',
                    meta: {
                        title: 'cRestrictedRoadIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/base-info/restricted-road/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/base-info/restricted-road/list'),
                            name: 'CRestrictedRoadList',
                            hidden: true,
                            meta: {
                                title: 'cRestrictedRoadList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/company-industry-info/base-info/restricted-road',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/base-info/restricted-road/index'
                            }
                        }
                    ]
                },
                {
                    path: 'tunnel-information',
                    redirect: '/company-industry-info/base-info/tunnel-information/index',
                    component: () => import('@/views/company-industry-info/base-info/tunnel-information/index'),
                    name: 'CTunnelInformationIndex',
                    meta: {
                        title: 'cTunnelInformationIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/base-info/tunnel-information/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/base-info/tunnel-information/list'),
                            name: 'CTunnelInformationList',
                            hidden: true,
                            meta: {
                                title: 'cTunnelInformationList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/company-industry-info/base-info/tunnel-information',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/base-info/tunnel-information/index'
                            }
                        }
                    ]
                },
                {
                    path: 'bridge-information',
                    redirect: '/company-industry-info/base-info/bridge-information/index',
                    component: () => import('@/views/company-industry-info/base-info/bridge-information/index'),
                    name: 'CBridgeInformationIndex',
                    meta: {
                        title: 'cBridgeInformationIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/base-info/bridge-information/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/base-info/bridge-information/list'),
                            name: 'CBridgeInformationList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/company-industry-info/base-info/bridge-information',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/base-info/bridge-information/index'
                            }
                        }
                    ]
                },
                {
                    path: 'parking-information',
                    redirect: '/company-industry-info/base-info/parking-information/index',
                    component: () => import('@/views/company-industry-info/base-info/parking-information/index'),
                    name: 'CParkingInformationIndex',
                    meta: {
                        title: 'cParkingInformationIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/base-info/parking-information/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/base-info/parking-information/list'),
                            name: 'CParkingInformationList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/company-industry-info/base-info/parking-information',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/base-info/parking-information/index'
                            }
                        }
                    ]
                },
                {
                    path: 'inlet-outlet',
                    redirect: '/company-industry-info/base-info/inlet-outlet/index',
                    component: () => import('@/views/company-industry-info/base-info/inlet-outlet/index'),
                    name: 'CInletOutletIndex',
                    meta: {
                        title: 'cInletOutletIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/base-info/inlet-outlet/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/base-info/inlet-outlet/list'),
                            name: 'CInletOutletList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/company-industry-info/base-info/parking-information',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/base-info/inlet-outlet/index'
                            }
                        }
                    ]
                },
                {
                    path: 'loading-unloading',
                    redirect: '/company-industry-info/base-info/loading-unloading/index',
                    component: () => import('@/views/company-industry-info/base-info/loading-unloading/index'),
                    name: 'CLoadingUnloadingIndex',
                    meta: {
                        title: 'cLoadingUnloadingIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/base-info/loading-unloading/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/base-info/loading-unloading/list'),
                            name: 'cLoadingUnloadingList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/company-industry-info/base-info/loading-unloading',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/base-info/loading-unloading/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 企业标注----------------------------------*/
                {
                    path: 'enterprise-label',
                    redirect: '/company-industry-info/base-info/enterprise-label/index',
                    component: () => import('@/views/company-industry-info/base-info/enterprise-label/index'),
                    name: 'CEnterpriseLabelIndex',
                    meta: {
                        title: 'cEnterpriseLabelIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/base-info/enterprise-label/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/base-info/enterprise-label/list'),
                            name: 'CEnterpriseLabelList',
                            hidden: true,
                            meta: {
                                title: '',
                                activeMenu: '/company-industry-info/base-info/enterprise-label',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/base-info/enterprise-label/index'
                            }
                        }
                    ]
                },
            ]
        },
        /*-------------------------------------- 企业综合管理 ----------------------------------*/
        {
            path: 'enterprise-management',
            redirect: '/company-industry-info/enterprise-management/enterprise-info/index',
            component: () => import('@/views/company-industry-info/enterprise-management/index'),
            name: 'CEnterpriseManagementIndex',
            meta: {
                title: 'cEnterpriseManagementIndex',
                icon: 'enterprise',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/company-industry-info/enterprise-management'
            },
            children: [
                /*-------------------------------------- 企业基本信息 ----------------------------------*/
                {
                    path: 'enterprise-info',
                    redirect: '/company-industry-info/enterprise-management/enterprise-info/index',
                    component: () => import('@/views/company-industry-info/enterprise-management/enterprise-info/index'),
                    name: 'CEnterpriseInfoIndex',
                    meta: {
                        title: 'cEnterpriseInfoIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/enterprise-management/enterprise-info/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/enterprise-management/enterprise-info/list'),
                            name: 'CEnterpriseInfoList',
                            hidden: true,
                            meta: {
                                title: 'cEnterpriseInfoList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/company-industry-info/enterprise-management/enterprise-info',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/enterprise-management/enterprise-info/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 人员基本信息 ----------------------------------*/
                {
                    path: 'personnel-info',
                    redirect: '/company-industry-info/enterprise-management/personnel-info/index',
                    component: () => import('@/views/company-industry-info/enterprise-management/personnel-info/index'),
                    name: 'CPersonnelInfoIndex',
                    meta: {
                        title: 'cPersonnelInfoIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/enterprise-management/personnel-info/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/enterprise-management/personnel-info/list'),
                            name: 'CPersonnelInfoList',
                            hidden: true,
                            meta: {
                                title: 'cPersonnelInfoList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/company-industry-info/enterprise-management/personnel-info',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/enterprise-management/personnel-info/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 车辆基本信息 ----------------------------------*/
                {
                    path: 'vehicle-info',
                    redirect: '/company-industry-info/enterprise-management/vehicle-info/index',
                    component: () => import('@/views/company-industry-info/enterprise-management/vehicle-info/index'),
                    name: 'CVehicleInfoIndex',
                    meta: {
                        title: 'cVehicleInfoIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/enterprise-management/vehicle-info/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/enterprise-management/vehicle-info/list'),
                            name: 'CVehicleInfoList',
                            hidden: true,
                            meta: {
                                title: 'cVehicleInfoList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/company-industry-info/enterprise-management/vehicle-info',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/enterprise-management/vehicle-info/index'
                            }
                        }
                    ]
                },
                /*-------------------------------------- 危险货物管理 ----------------------------------*/
                {
                    path: 'management-goods',
                    redirect: '/company-industry-info/enterprise-management/management-goods/index',
                    component: () => import('@/views/company-industry-info/enterprise-management/management-goods/index'),
                    name: 'ManagementGoodsIndex',
                    meta: {
                        title: 'managementGoodsIndex',
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/enterprise-management/management-goods/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/company-industry-info/enterprise-management/management-goods/list'),
                            name: 'ManagementGoodsList',
                            hidden: true,
                            meta: {
                                title: 'managementGoodsList',
                                breadcrumb: false,  //在面包屑中隐藏
                                activeMenu: '/company-industry-info/enterprise-management/management-goods',
                                noCache: true,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/enterprise-management/management-goods/index'
                            }
                        }
                    ]
                },
            ]
        },
        /*-------------------------------------- 装卸位管理（企业端） ----------------------------------*/
        {
            path: 'company-loading-management',
            redirect: '/company-industry-info/company-loading-management/company-loading-management-search/index',
            component: () => import('@/views/course-monitor/loading-management/index'),
            name: 'CMCompanyLoadingManagement',
            meta: {
                title: 'courseMonitorCompanyLoadingManagement',
                icon: 'alarm-synthesis',
                isShowSlideBar: true,
                isNeedReWriteRedirect: true,
                fullPath:'/company-industry-info/company-loading-management'
            },
            children: [
                /*-------------------------------------- 装卸位管理（企业端） ----------------------------------*/
                {
                    path: 'company-loading-management-search',
                    redirect: '/company-industry-info/company-loading-management/company-loading-management-search/index',
                    component: () => import('@/views/course-monitor/loading-management/index'),
                    name: 'CMCompanyLoadingManagementSearch',
                    meta: {
                        title: 'cMCompanyLoadingManagementSearch',
                        breadcrumb:false,//在面包屑中不显示
                        isShowSlideBar: true,
                        fullPath:'/company-industry-info/company-loading-management/company-loading-management-search/index'
                    },
                    children: [
                        {
                            path: 'index',
                            component: () => import('@/views/course-monitor/loading-management/company-loading-management/list'),
                            name: 'CMCompanyLoadingManagementIndex',
                            hidden: true,
                            meta: {
                                title: 'cMCompanyLoadingManagementIndex',
                                activeMenu: '/company-industry-info/company-loading-management/company-loading-management-search',
                                noCache: false,
                                isShowSlideBar: true,
                                fullPath:'/company-industry-info/company-loading-management/company-loading-management-search/index'
                            }
                        }
                    ]
                },
            ]
        },
    ]
};

export default companyIndustryInfoRouter
