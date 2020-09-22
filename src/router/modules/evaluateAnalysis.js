/** 当路由表过长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const evaluateAnalysisRouter = {
    path: '/evaluate-analysis',
    component: Layout,
    redirect: '/evaluate-analysis/department-preliminary-assessment',
    name: 'EvaluateAnalysisModule',
    meta: {
        title: 'evaluateAnalysisModule',
        icon: 'analysis',
        // isNeedReWriteRedirect: true,
        isShowSlideBar: true,
        fullPath:'/evaluate-analysis'
    },
    children: [
        /*--------------------------------------------------------- 企业自评 -----------------------------------------------------------*/
        {
            path: 'enterprise-self-assessment',
            redirect: '/evaluate-analysis/enterprise-self-assessment/index',
            component: () => import('@/views/evaluate-analysis/index'),
            name: 'EAEnterpriseSelfAssessment',
            meta: {
                title: 'eAEnterpriseSelfAssessmentIndex',
                icon: 'enterprise-self',
                isShowSlideBar: true,
                fullPath:'/evaluate-analysis/enterprise-self-assessment/index'
            },
            children: [
                {
                    path: 'index',
                    component: () => import('@/views/evaluate-analysis/enterprise-self-assessment/list'),
                    name: 'EAEnterpriseSelfAssessmentIndex',
                    hidden: true,
                    meta: {
                        title: '',
                        icon: 'enterprise-self',
                        activeMenu: '/evaluate-analysis/enterprise-self-assessment',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/enterprise-self-assessment/index'
                    }
                },
                {
                    path: 'check-scale',
                    component: () => import('@/views/evaluate-analysis/enterprise-self-assessment/components/checkScale'),
                    name: 'EAEnterpriseSelfAssessmentCheckScale',
                    hidden: true,
                    meta: {
                        title: 'eAEnterpriseSelfAssessmentCheckScale',
                        icon: 'department',
                        activeMenu: '/evaluate-analysis/enterprise-self-assessment',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/enterprise-self-assessment/index'
                    }
                },
                {
                    path: 'application-form',
                    component: () => import('@/views/evaluate-analysis/enterprise-self-assessment/components/applicationForm'),
                    name: 'EAEnterpriseSelfAssessmentApplicationForm',
                    hidden: true,
                    meta: {
                        title: 'eAEnterpriseSelfAssessmentApplicationForm',
                        icon: 'department',
                        activeMenu: '/evaluate-analysis/enterprise-self-assessment',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/enterprise-self-assessment/index'
                    }
                },
                {
                    path: 'rating-form',
                    component: () => import('@/views/evaluate-analysis/enterprise-self-assessment/components/ratingForm'),
                    name: 'EAEnterpriseSelfAssessmentRatingForm',
                    hidden: true,
                    meta: {
                        title: 'eAEnterpriseSelfAssessmentRatingForm',
                        icon: 'department',
                        activeMenu: '/evaluate-analysis/enterprise-self-assessment',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/enterprise-self-assessment/index'
                    }
                }
            ]
        },
        /*--------------------------------------------------------- 部门初评 -----------------------------------------------------------*/
        {
            path: 'department-preliminary-assessment',
            redirect: '/evaluate-analysis/department-preliminary-assessment/index',
            component: () => import('@/views/evaluate-analysis/index'),
            name: 'EADepartmentPreliminaryAssessment',
            meta: {
                title: 'eADepartmentPreliminaryAssessmentIndex',
                icon: 'department',
                isShowSlideBar: true,
                // activeMenu: '/evaluate-analysis/department-preliminary-assessment',
                fullPath:'/evaluate-analysis/department-preliminary-assessment/index'
            },
            children: [
                {
                    path: 'index',
                    component: () => import('@/views/evaluate-analysis/department-preliminary-assessment/list'),
                    name: 'EADepartmentPreliminaryAssessmentIndex',
                    hidden: true,
                    meta: {
                        title: '',
                        icon: 'department',
                        activeMenu: '/evaluate-analysis/department-preliminary-assessment',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/department-preliminary-assessment/index'
                    },
                },
                {
                    path: 'check-scale',
                    component: () => import('@/views/evaluate-analysis/department-preliminary-assessment/components/checkScale'),
                    name: 'EADepartmentPreliminaryAssessmentCheckScale',
                    hidden: true,
                    meta: {
                        title: 'eADepartmentPreliminaryAssessmentCheckScale',
                        icon: 'department',
                        activeMenu: '/evaluate-analysis/department-preliminary-assessment',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/department-preliminary-assessment/index'
                    }
                },
                {
                    path: 'application-form',
                    component: () => import('@/views/evaluate-analysis/department-preliminary-assessment/components/applicationForm'),
                    name: 'EADepartmentPreliminaryAssessmentApplicationForm',
                    hidden: true,
                    meta: {
                        title: 'eADepartmentPreliminaryAssessmentApplicationForm',
                        icon: 'department',
                        activeMenu: '/evaluate-analysis/department-preliminary-assessment',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/department-preliminary-assessment/index'
                    }
                },
                {
                    path: 'rating-form',
                    component: () => import('@/views/evaluate-analysis/department-preliminary-assessment/components/ratingForm'),
                    name: 'EADepartmentPreliminaryAssessmentRatingForm',
                    hidden: true,
                    meta: {
                        title: 'eADepartmentPreliminaryAssessmentRatingForm',
                        icon: 'department',
                        activeMenu: '/evaluate-analysis/department-preliminary-assessment',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/department-preliminary-assessment/index'
                    }
                }
            ]
        },
        /*--------------------------------------------------------- 等级核定 -----------------------------------------------------------*/
        {
            path: 'level-check',
            redirect: '/evaluate-analysis/level-check/index',
            component: () => import('@/views/evaluate-analysis/index'),
            name: 'EALevelCheck',
            meta: {
                title: 'eALevelCheckIndex',
                icon: 'level-check',
                isShowSlideBar: true,
                fullPath:'/evaluate-analysis/level-check/index'
            },
            children: [
                {
                    path: 'index',
                    component: () => import('@/views/evaluate-analysis/level-check/list'),
                    name: 'EALevelCheckIndex',
                    hidden: true,
                    meta: {
                        title: '',
                        icon: 'level-check',
                        activeMenu: '/evaluate-analysis/level-check',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/level-check/index'
                    }
                },
                {
                    path: 'check-scale',
                    component: () => import('@/views/evaluate-analysis/level-check/components/checkScale'),
                    name: 'EALevelCheckCheckScale',
                    hidden: true,
                    meta: {
                        title: 'eALevelCheckCheckScale',
                        icon: 'department',
                        activeMenu: '/evaluate-analysis/level-check',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/level-check/index'
                    }
                },
                {
                    path: 'application-form',
                    component: () => import('@/views/evaluate-analysis/level-check/components/applicationForm'),
                    name: 'EALevelCheckApplicationForm',
                    hidden: true,
                    meta: {
                        title: 'eALevelCheckApplicationForm',
                        icon: 'department',
                        activeMenu: '/evaluate-analysis/level-check',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/level-check/index'
                    }
                },
                {
                    path: 'rating-form',
                    component: () => import('@/views/evaluate-analysis/level-check/components/ratingForm'),
                    name: 'EALevelCheckRatingForm',
                    hidden: true,
                    meta: {
                        title: 'eALevelCheckRatingForm',
                        icon: 'department',
                        activeMenu: '/evaluate-analysis/level-check',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/level-check/index'
                    }
                }
            ]
        },
        /*--------------------------------------------------------- 考核档案 -----------------------------------------------------------*/
        {
            path: 'check-records',
            redirect: '/evaluate-analysis/check-records/index',
            component: () => import('@/views/evaluate-analysis/index'),
            name: 'EACheckRecords',
            meta: {
                title: 'eACheckRecordsIndex',
                icon: 'check-records',
                isShowSlideBar: true,
                fullPath:'/evaluate-analysis/check-records/index'
            },
            children: [
                {
                    path: 'index',
                    component: () => import('@/views/evaluate-analysis/check-records/list'),
                    name: 'EACheckRecordsIndex',
                    hidden: true,
                    meta: {
                        title: '',
                        icon: 'check-records',
                        activeMenu: '/evaluate-analysis/check-records',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/check-records/index'
                    }
                },
                {
                    path: 'check-scale',
                    component: () => import('@/views/evaluate-analysis/check-records/components/checkScale'),
                    name: 'EACheckRecordsCheckScale',
                    hidden: true,
                    meta: {
                        title: 'eACheckRecordsCheckScale',
                        icon: 'department',
                        activeMenu: '/evaluate-analysis/check-records',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/check-records/index'
                    }
                },
                {
                    path: 'application-form',
                    component: () => import('@/views/evaluate-analysis/check-records/components/applicationForm'),
                    name: 'EACheckRecordsApplicationForm',
                    hidden: true,
                    meta: {
                        title: 'eACheckRecordsApplicationForm',
                        icon: 'department',
                        activeMenu: '/evaluate-analysis/check-records',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/check-records/index'
                    }
                },
                {
                    path: 'rating-form',
                    component: () => import('@/views/evaluate-analysis/check-records/components/ratingForm'),
                    name: 'EACheckRecordsRatingForm',
                    hidden: true,
                    meta: {
                        title: 'eACheckRecordsRatingForm',
                        icon: 'department',
                        activeMenu: '/evaluate-analysis/check-records',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/check-records/index'
                    }
                }
            ]
        },
        /*--------------------------------------------------------- 考核指标 -----------------------------------------------------------*/
        {
            path: 'check-indicator',
            redirect: '/evaluate-analysis/check-indicator/index',
            component: () => import('@/views/evaluate-analysis/index'),
            name: 'EACheckIndicator',
            meta: {
                title: 'eACheckIndicatorIndex',
                icon: 'check-indicator',
                isShowSlideBar: true,
                fullPath:'/evaluate-analysis/check-indicator/index'
            },
            children: [
                {
                    path: 'index',
                    component: () => import('@/views/evaluate-analysis/check-indicator/list'),
                    name: 'EACheckIndicatorIndex',
                    hidden: true,
                    meta: {
                        title: '',
                        icon: 'check-indicator',
                        activeMenu: '/evaluate-analysis/check-indicator',
                        noCache: true,
                        isShowSlideBar: true,
                        fullPath:'/evaluate-analysis/check-indicator/index'
                    }
                },
            ]
        },
    ]
}

export default evaluateAnalysisRouter
