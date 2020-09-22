<template>
    <div class="login">
        <div class="title">
            <div class="logo"><img src="../../assets/image/logo.png"></div>
            <div class="subtitle">
                <div class="system">{{sysName}}</div>
            </div>
        </div>
        <div class="login-container blur">
            <div class="login-title">管理员登录</div>
            <el-form
                    ref="loginForm"
                    :model="loginForm"
                    :rules="rules"
                    class="login-form"
                    auto-complete="on"
                    label-position="left"
                    style="margin-top:40px"
            >
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input
                            ref="username"
                            v-model="loginForm.username"
                            placeholder="请输入用户名"
                            name="username"
                            type="text"
                            tabindex="1"
                            auto-complete="on"
                    />
                    <span class="svg-container">
                        <svg-icon icon-class="user"/>
                    </span>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input
                            :key="passwordType"
                            ref="password"
                            v-model="loginForm.password"
                            :type="passwordType"
                            placeholder="请输入密码"
                            name="password"
                            tabindex="2"
                            auto-complete="on"
                    />
                    <span class="show-pwd" @click="showPwd">
                        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
                    </span>
                </el-form-item>
                <el-form-item class="yanzheng" prop="verifyCode">
                    <el-input v-model="loginForm.vertifyCode" placeholder="请输入验证码" auto-complete="on"/>
                </el-form-item>
                <img :src="verifyCodeBase64" class="vertify-image" @click="getVerifyImage">
                <!-- 按钮 -->
                <el-button
                        :loading="loading"
                        type="primary"
                        style="width:100%;margin-bottom:20px;"
                        @click.native.prevent="handleLogin"
                >登录
                </el-button>
            </el-form>
        </div>
        <!--<div class="four">Copyright © 2018 &nbsp;&nbsp; 技术支持：东方电子股份有限公司</div>-->
    </div>
</template>

<script>
    import {validUsername} from '@/utils/validate'
    import {getVerify, getRoleMenuAuth} from '@/api/user'
    import {getSysName} from '@/api/public'
    import {setStorage, removeStorage, getStorage} from '@/utils/storage'
    import {getSystemNameAsync} from '@/utils/sysName'
    import LangSelect from '@/components/LangSelect'
    import SocialSign from './components/SocialSignin'

    export default {
        name: 'Login',
        components: {LangSelect, SocialSign},
        data() {
            const validateUsername = (rule, value, callback) => {
                if (!validUsername(value)) {
                    callback(new Error('Please enter the correct user name'))
                } else {
                    callback()
                }
            }
            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('密码不能少于6位数'))
                } else {
                    callback()
                }
            }
            return {
                verifyCodeBase64: 'base64',
                loginForm: {
                    username: '',
                    password: '',
                    vertifyCode: '',
                    uuid: '',
                },
                rules: {
                    username: [{required: true, message: '必填', trigger: 'change'}],
                    password: [{required: true, trigger: 'blur', validator: validatePassword}],
                    vertifyCode: [{required: true, message: '必填', trigger: 'change'}]
                },
                passwordType: 'password',
                capsTooltip: false,
                loading: false,
                showDialog: false,
                redirect: undefined,
                otherQuery: {},
                sysName:'',
            }
        },
        watch: {
            $route: {
                handler: function (route) {
                    const query = route.query
                    if (query) {
                        this.redirect = query.redirect
                        this.otherQuery = this.getOtherQuery(query)
                    }
                },
                immediate: true
            }
        },
        created() {
            this.getSystemName();
            this.getVerifyImage()
        },
        mounted() {
            if (this.loginForm.username === '') {
                this.$refs.username.focus()
            } else if (this.loginForm.password === '') {
                this.$refs.password.focus()
            }
        },
        destroyed() {
            // window.removeEventListener('storage', this.afterQRScan)
        },
        methods: {
            //获取系统名
            async getSystemName(){
                if(!localStorage.getItem('system_name')){
                    //若没有则请求接口，存储到缓存中
                    this.sysName =  await getSystemNameAsync();
                }else{
                    this.sysName = localStorage.getItem('system_name')
                }
            },
            // 获取验证码
            getVerifyImage() {
                let self = this;
                getVerify().then(res => {
                    this.verifyCodeBase64 = res.data.code;
                    self.loginForm.uuid = res.data.uuid;
                })
            },

            checkCapslock(e) {
                const {key} = e
                this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
            },
            showPwd() {
                if (this.passwordType === 'password') {
                    this.passwordType = ''
                } else {
                    this.passwordType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.password.focus()
                })
            },
            // 登录
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        //去掉两端空格
                        let keys = this.$lodash.keys(this.loginForm);
                        keys.map( val => {
                            this.loginForm[val] = this.loginForm[val].trim();
                        });
                        this.$store.dispatch('user/login', this.loginForm)
                            .then(resp => {
                                //登录获取角色菜单权限
                                getRoleMenuAuth({roleId: resp.user.roleId}).then(res => {
                                    if (res.code === 1000) {
                                        //TODO res.data是线上的，因为临时搭建写成固定的，以后再删掉
                                        let userInfo = {
//                                            roles: res.data,
                                            roles: [
                                                "/dashboard/index",
                                                "/law-case",
                                                "/law-case/home/index",
                                                "/law-case/map",
                                                "/video-monitor/index",
                                                "/map-monitor/index",
                                                "/course-monitor",
                                                "/course-monitor/handling-process",
                                                "/course-monitor/handling-process/operation-process/index",
                                                "/course-monitor/handling-process/historical-alarm-query/index",
                                                "/course-monitor/handling-process/rectification-notice/index",
                                                "/course-monitor/import-export",
                                                "/course-monitor/import-export/record-search/index",
                                                "/course-monitor/import-export/car-bayonet-manage/index",
                                                "/course-monitor/import-export/verification-query/index",
                                                "/course-monitor/import-export/info-management/index",
                                                "/course-monitor/import-export/info-management-company/index",
                                                "/course-monitor/import-export/car-search/index",
                                                "/course-monitor/import-export/person-search/index",
                                                "/course-monitor/import-export/record-search-company/index",
                                                "/course-monitor/alarm-synthesis",
                                                "/course-monitor/alarm-synthesis/alarm-synthesis-search/index",
                                                "/evaluate-analysis",
                                                "/evaluate-analysis/enterprise-self-assessment/index",
                                                "/evaluate-analysis/department-preliminary-assessment/index",
                                                "/evaluate-analysis/level-check/index",
                                                "/evaluate-analysis/check-records/index",
                                                "/evaluate-analysis/check-indicator/index",
                                                "/industry-info",
                                                "/industry-info/electronic-waybill",
                                                "/industry-info/electronic-waybill/waybill-manager/index",
                                                "/industry-info/base-info",
                                                "/industry-info/base-info/administrate-region/index",
                                                "/industry-info/base-info/danger-directory/index",
                                                "/industry-info/base-info/road-code-info/index",
                                                "/industry-info/base-info/restricted-road/index",
                                                "/industry-info/base-info/tunnel-information/index",
                                                "/industry-info/base-info/bridge-information/index",
                                                "/industry-info/base-info/parking-information/index",
                                                "/industry-info/base-info/inlet-outlet/index",
                                                "/industry-info/base-info/loading-unloading/index",
                                                "/industry-info/base-info/enterprise-label/index",
                                                "/industry-info/enterprise-management",
                                                "/industry-info/enterprise-management/enterprise-info/index",
                                                "/industry-info/enterprise-management/personnel-info/index",
                                                "/industry-info/enterprise-management/vehicle-info/index",
                                                "/industry-info/loading-management",
                                                "/industry-info/loading-management/loading-management-search/index",
                                                "/company-industry-info",
                                                "/company-industry-info/electronic-waybill",
                                                "/company-industry-info/electronic-waybill/waybill-manager/index",
                                                "/company-industry-info/base-info",
                                                "/company-industry-info/base-info/administrate-region/index",
                                                "/company-industry-info/base-info/danger-directory/index",
                                                "/company-industry-info/base-info/road-code-info/index",
                                                "/company-industry-info/base-info/restricted-road/index",
                                                "/company-industry-info/base-info/tunnel-information/index",
                                                "/company-industry-info/base-info/bridge-information/index",
                                                "/company-industry-info/base-info/parking-information/index",
                                                "/company-industry-info/base-info/inlet-outlet/index",
                                                "/company-industry-info/base-info/loading-unloading/index",
                                                "/company-industry-info/base-info/enterprise-label/index",
                                                "/company-industry-info/enterprise-management",
                                                "/company-industry-info/enterprise-management/enterprise-info/index",
                                                "/company-industry-info/enterprise-management/personnel-info/index",
                                                "/company-industry-info/enterprise-management/vehicle-info/index",
                                                "/company-industry-info/enterprise-management/management-goods/index",
                                                "/company-industry-info/company-loading-management",
                                                "/company-industry-info/company-loading-management/company-loading-management-search/index",
                                                "/statistic-analysis",
                                                "/system-manage",
                                                "/system-manage/alarm-configuration",
                                                "/system-manage/alarm-configuration/alarm-manager/index",
                                                "/system-manage/global-parameter",
                                                "/system-manage/global-parameter/parameter-configuration/index",
                                                "/emergency-management",
                                                "/emergency-management/emergency-home/index",
                                                "/emergency-management/emergency-plan-management",
                                                "/emergency-management/emergency-resource-management",
                                                "/emergency-management/emergency-resource-management/material-reserve/index",
                                                "/emergency-management/emergency-resource-management/emergency-team/index",
                                                "/emergency-management/emergency-resource-management/emergency-personnel/index",
                                                "/emergency-management/emergency-resource-management/emergency-resources/index",
                                                "/emergency-management/emergency-resource-management/external-resources/index",
                                                "/emergency-management/emergency-resource-management/expert-database/index",
                                                "/emergency-management/training-exercises",
                                                "/emergency-management/training-exercises/training/index",
                                                "/emergency-management/training-exercises/exercise/index",
                                                "/emergency-management/hazard-module",
                                                "/emergency-management/hazard-module/tank-management-department/index",
                                                "/emergency-management/hazard-module/tank-management-company/index",
                                                "/emergency-management/hazard-module/hazard-management-company/index",
                                                "/emergency-management/hazard-module/hazard-management-department/index",
                                                "/emergency-management/hazard-module/alarm-rules/index"
                                            ],
                                            ...resp.user
                                        };
                                        setStorage('userInfo', userInfo);    //登录成功后将userInfo存在localStorage
                                        //异步筛选出符合权限设定的路由
                                        this.$store.dispatch('permission/generateRoutes', res.data).then( routes => {
                                            let accessedRoutes = routes;
                                            //登录后，跳转到第一个模块的首页，并且面包屑也要根据第一个路由来确定
                                            this.$store.dispatch({
                                                type: 'app/toggleShowBreadcrumb',
                                                isShowBreadcrumb: !(accessedRoutes[0].children[0].meta && accessedRoutes[0].children[0].meta.hasOwnProperty('isShowBreadcrumb') && !accessedRoutes[0].children[0].meta.isShowBreadcrumb)
                                            });
//                                            this.$router.push({path: this.redirect || (accessedRoutes[0] && accessedRoutes[0].redirect) || "dashboard", query: this.otherQuery}) // 登录成功之后重定向到首页
                                            this.$router.push({path: (accessedRoutes[0] && accessedRoutes[0].redirect) || "dashboard", query: this.otherQuery}) // 登录成功之后重定向到首页

                                            this.loading = false
                                        }).catch( err => {
                                            console.log(err,'err');
                                        });
                                    }
                                }).catch(err => {
                                    this.loading = false
                                    console.log(err,'err');
                                })
//                                this.$router.push({path: this.redirect || '/dashboard', query: this.otherQuery}) // 登录成功之后重定向到首页
//                                this.loading = false
                            })
                            .catch((err) => {
                                // 公共方法有，所以不需要加提示了
                                // this.$message.error(err.msg)
//                                this.getVerifyImage();
                                this.loading = false
                            })
                    } else {
                        console.log('错误的提交!!')
                        return false
                    }
                })
            },
            getOtherQuery(query) {
                return Object.keys(query).reduce((acc, cur) => {
                    if (cur !== 'redirect') {
                        acc[cur] = query[cur]
                    }
                    return acc
                }, {})
            }
            // afterQRScan() {
            //   if (e.key === 'x-admin-oauth-code') {
            //     const code = getQueryObject(e.newValue)
            //     const codeMap = {
            //       wechat: 'code',
            //       tencent: 'code'
            //     }
            //     const type = codeMap[this.auth_type]
            //     const codeName = code[type]
            //     if (codeName) {
            //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
            //         this.$router.push({ path: this.redirect || '/' })
            //       })
            //     } else {
            //       alert('第三方登录失败')
            //     }
            //   }
            // }
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/styles/common.scss";
    /* 修复input 背景不协调 和光标变色 */
    /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

    $bg: #283443;
    $light_gray: #606266;
    $cursor: #fff;

    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
        .login-container .el-input input {
            color: $cursor;
        }
    }

    .login {
        width: 100%;
        height: 100%;
        background-image: url('../../assets/image/logo_compress.jpg');
        background-repeat: no-repeat;
        background-position: center top;
        position: relative;
        background-size: cover;
        .title {
            @media screen and (max-width: $screen-xl) {
                /*height: 100px;*/
            }
            height: 25%;
            min-height: 100px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            //position: absolute;
            //top: 35%;
            .logo {
                margin-right: 20px;
                img {
                    @media screen and (max-width: $screen-xl) {
                        width: 48px;
                    }
                    width: 40px;
                }
            }
            .subtitle {
                font-family: MicrosoftYaHei-Bold;
                text-shadow: #2d6bb4 1px 0 0, #2d6bb4 0 4px 0, #2d6bb4 -1px 0 0, #2d6bb4 0 -1px 0;
                color: #ffffff;
                position: relative;
                top: -4px;
                font-weight: 600;
                .system {
                    @media screen and (max-width: $screen-xl) {
                        font-size: 32px;
                    }
                    font-size: 40px;
                }
            }

        }

        /*.blur{*/
        /*-webkit-filter: blur(5px); !* Chrome, Opera *!*/
        /*-moz-filter: blur(5px);*/
        /*-ms-filter: blur(5px);*/
        /*filter: blur(5px);*/
        /*}*/

        .login-container {
            /*margin: 0 auto;*/
            position: absolute;
            top: 25%;
            left: 50%;
            z-index: 2;
            margin-left: -215px;
            width: 430px;
            border-radius: 8px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
            overflow: hidden;
            box-sizing: border-box;
            background-color: #ffffff;
            /*box-shadow: 0 32px 62px 0 #013260;*/
            padding: 30px 50px;
            .el-button--primary {
                background-color: #0865bc;
                margin-top: 10px;
            }
            /deep/ .el-input input {
                caret-color: #606266;
            }
            /deep/ .el-input {
                display: inline-block;
                height: 47px;
                width: 90%;

                input {
                    background: transparent;
                    border: 0;
                    -webkit-appearance: none;
                    border-radius: 0;
                    color: $light_gray;
                    height: 40px;
                    &:-webkit-autofill {
                        box-shadow: 0 0 0 1000px $cursor inset !important;
                        -webkit-text-fill-color: #606266 !important;
                    }
                }
            }
            .password {
                color: #999999;
                font-size: 14px;
                cursor: pointer;
                .el-checkbox__label {
                    color: #999999;
                    font-size: 14px;
                }
                .left {
                    float: left;
                }
                .right {
                    float: right;
                }
            }
            .login-title {
                color: #eee;
                font-size: 24px;
                text-align: center;
                font-family: MicrosoftYaHei-Bold;
            }
            .yanzheng {
                width: 64%;
                display: inline-block;
            }
            .el-form-item {
                height: 42px;
                background-color: #ffffff;
                border: solid 1px #cccccc;
                border-radius: 5px;
                color: #454545;
            }
            .vertify-image {
                position: relative;
                top: 8px;
                margin-left: 10px;
                border: 1px solid #B0B0B0;
                transform: scale(1.1, 1.4);
            }
        }
        .login-container::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            -webkit-filter: blur(20px);
            -moz-filter: blur(20px);
            -ms-filter: blur(20px);
            -o-filter: blur(20px);
            filter: blur(20px);
            z-index: -3;
            margin: -30px;
            background-image: url('../../assets/image/logo_compress.jpg');
            background-position: center top;
            background-size: cover;
            background-attachment: fixed;
        }
    }

</style>


