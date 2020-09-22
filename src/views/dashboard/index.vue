<template>
    <div class="dashboard-container">
        <div class="info-container" style="display: flex; justify-content: center">
            <span style="font-size:20px;padding-top:20px;display:inline-block;"> 欢迎登录招远天网</span>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {getAllParams} from '@/api/public'

    export default {
        name: 'DashboardHomeIndex',
        components: {},
        data() {
            return {
                adapterType: '',
                width: 1980,
                height: 1020,
            }
        },
        computed: {
            ...mapGetters([
                'roles'
            ])
        },
        created() {
            this.changeAdapter();
            this.getGlobalParams();
        },
        methods: {
            /**
             * 改变适配方案
             */
            changeAdapter() {
                const clientWidth = document.body.clientWidth;
                const clientHeight = document.body.clientHeight;
                const xScale = clientWidth / this.width;
                const yScale = clientHeight / this.height;

                let realScreenInner = document.getElementById('dashboard-container');    // 内层div---真实宽高

                switch (this.adapterType) {
                    // 等比缩放，即大屏缩放比例和原始大屏宽高比例一样，完整显示在当前浏览器内
                    case 'stretch':
                        if (xScale * height > clientHeight) {
                            realScreenInner.style.transform = 'scale(' + yScale + ')';
                        } else {
                            realScreenInner.style.transform = 'scale(' + xScale + ')';
                        }
                        break;
                    case 'width':
                        // 适应宽度
                        realScreenInner.style.transform = 'scale(' + xScale + ')';
                        break;
                    case 'height':
                        // 适应高度
                        realScreenInner.style.transform = 'scale(' + yScale + ')';
                        break;
                    case 'normal':

                        break;
                    case 'pull':
                        // 全屏铺满
                        realScreenInner.style.transform = 'scale(' + xScale + ',' + yScale + ')';
                        break;
                    default:
                        break;
                }
            },

            /**
             * 获取全局参数
             */
            getGlobalParams(){
                getAllParams().then(res=>{
                    if(res.data && res.data.length>0){
                        res.data.map(item=>{
                            localStorage.setItem(item.code,item.value)
                        })
                    }

                })
            }
        },
    }
</script>
