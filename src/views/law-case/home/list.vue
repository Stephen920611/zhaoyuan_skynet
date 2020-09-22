<template>
    <div id="main-content" class="main-content" style="width: 1920px; height: 1080px;">
            <div class="lt-wrap">
                <div class="comm-wrap top-info-content">
                    <div class="num-div">
                        <span class="num-w-font">警情总量</span>
                        <div class="num-blue-font"><span class="police-num" id="jqCount"><i class="fa fa-spinner fa-pulse"></i></span><span class="num-unit">条</span></div>
                    </div>
                    <div class="num-line"></div>
                    <div class="num-div">
                        <span class="num-w-font">案件总量</span>
                        <div class="num-blue-font"><span class="case-num" id="ajCount"><i class="fa fa-spinner fa-pulse"></i></span><span class="num-unit">条</span></div>
                    </div>
                    <div class="num-line"></div>
                    <div class="num-div">
                        <span class="num-w-font">串并案总量</span>
                        <div class="num-blue-font"><span class="unite-num" id="cbaCount"><i class="fa fa-spinner fa-pulse"></i></span><span class="num-unit">条</span></div>
                    </div>
                    <div class="num-line"></div>
                    <div class="num-div">
                        <span class="num-w-font">线索总量</span>
                        <div class="num-blue-font"><span class="clue-num" id="caseCount"><i class="fa fa-spinner fa-pulse"></i></span><span class="num-unit">条</span></div>
                    </div>
                </div>
                <div class="comm-wrap top-info-content">
                    <div class="num-div">
                        <span class="num-w-font">今日汇聚警情</span>
                        <div class="num-blue-font"><span class="today-police-num" id="jqTodayCount"><i class="fa fa-spinner fa-pulse"></i></span><span class="num-unit">条</span></div>
                    </div>
                    <div class="num-line"></div>
                    <div class="num-div">
                        <span class="num-w-font">今日汇聚案件</span>
                        <div class="num-blue-font"><span class="today-case-num" id="ajTodayCount"><i class="fa fa-spinner fa-pulse"></i></span><span class="num-unit">条</span></div>
                    </div>
                    <div class="num-line"></div>
                    <div class="num-div">
                        <span class="num-w-font">今日更新警情</span>
                        <div class="num-blue-font"><span class="today-update-police-num" id="jqTodayUpdateCount"><i class="fa fa-spinner fa-pulse"></i></span><span class="num-unit">条</span></div>
                    </div>
                    <div class="num-line"></div>
                    <div class="num-div">
                        <span class="num-w-font">今日上传线索</span>
                        <div class="num-blue-font"><span class="today-upload-clue-num" id="caseTodayCount"><i class="fa fa-spinner fa-pulse"></i></span><span class="num-unit">条</span></div>
                    </div>
                </div>
                <div class="statistic-content">
                    <div class="comm-wrap top-wrap">
                        <div class="case-title">
                            <div class="left-blue-div"></div>
                            <div class="title-con"><span>警情类型统计</span><span>ALARM TYPE STATISTICS</span></div>
                        </div>
                        <div class="s-content">
                            <div id="policeTypesPie"></div>
                        </div>
                    </div>
                    <div class="comm-wrap top-wrap">
                        <div class="case-title">
                            <div class="left-blue-div"></div>
                            <div class="title-con"><span>全市近半年日警情/案件趋势图</span><span>THE TREND OF THE CITY IN THE PAST SIX MONTHS</span></div>

                        </div>
                        <div class="s-content">
                            <div id="trendLine"></div>
                        </div>
                    </div>
                    <div class="comm-wrap bottom-wrap bottom-wrap-1">
                        <div class="case-title">
                            <div class="left-blue-div"></div>
                            <div class="title-con"><span>警情分区统计</span><span>POLICE CLASSIFICATION STATISTIC</span></div>
                        </div>
                        <div class="s-content">
                            <div id="policeZone"></div>
                        </div>
                    </div>
                    <div class="comm-wrap bottom-wrap">
                        <div class="case-title">
                            <div class="left-blue-div"></div>
                            <div class="title-con"><span>案件分区统计</span><span>CASE PARTITION STATISTIC</span></div>
                        </div>
                        <div class="s-content">
                            <div id="caseZone"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rt-wrap">
                <div class="nav-div">
                    <div class="nav-div-left to-this-page"  data-role="visible"><img class="img-icon rt-img active"/>数据可视化</div>
                    <div class="to-this-page" data-role="office"><img class="img-icon lt-img" />日常办公</div>
                </div>
                <div class="comm-wrap rt-top-wrap">
                    <div class="case-region">
                        <div class="case-title">
                            <div class="left-blue-div"></div>
                            <div class="title-con"><span>快捷导航</span><span>QUIKE NAVIGATION</span></div>
                        </div>
                        <div class="nav-btn-div">
                            <!--<div class="to-other-page" id="policeMg" data-index="1"><img src="../../static/img/case_nav.png" >警情库</div>-->
                            <!--<div class="to-other-page" id="policePool" data-index="2"><img src="../../static/img/case_nav.png" >情报池</div>-->
                            <!--<div class="to-other-page" id="caseMg" data-index="3"><img src="../../static/img/case_nav.png" >案件库</div>-->
                            <!--<div class="to-other-page" id="caseInfoMg" data-index="4"><img src="../../static/img/case_nav.png" >专案库</div>-->
                            <!--<div class="to-other-page" id="uniteCase" data-index="5"><img src="../../static/img/case_nav.png" >串并案库</div>-->
                            <!--<div class="to-other-page" id="caseClose" data-index="6"><img src="../../static/img/case_nav.png" >结案库</div>-->
                        </div>
                    </div>
                </div>
                <div class="comm-wrap clue-type-wrap">
                    <div class="case-title">
                        <div class="left-blue-div"></div>
                        <div class="title-con"><span>线索类型统计</span><span>LEAD TYPE STATISTICS</span></div>
                    </div>
                    <div class="s-content">
                        <div id="clueTypesPie"></div>
                    </div>
                </div>
                <div class="comm-wrap rt-bot-wrap">
                    <div class="case-title">
                        <div class="left-blue-div"></div>
                        <div class="title-con"><span>线索上传Top5</span><span>LEAD UPLOAD TOP5</span><!--<img title="线索上传统计" src="../../static/img/case_more.png">--></div>
                    </div>
                    <div class="case-content-div" id="controlAlarm"></div>
                </div>

            </div>
        </div>
</template>
<script>
    import D from '@/utils/DFDZ';
    export default {
        name: 'lawCaseHome',
        data() {
            return {
                adapterType: 'pull',
                width: 1980,
                height: 1020,
            }
        },
        computed: {},
        watch: {},
        created() {
        },
        mounted(){
            let self = this;
//            D.helper.changeAdapter('main-content', this.adapterType, this.width, this.height)
//            window.addEventListener('resize', this.$lodash.debounce(function () {
//                D.helper.changeAdapter('main-content', self.adapterType, self.width, self.height)
//            }, 300));
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    @import "@/styles/law-case/home/index.scss";
</style>
