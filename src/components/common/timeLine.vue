<template>
    <div class="time-line-wrap" v-show="isCurrent">
        <canvas ref="timeLineContainer" id="timeLine" :width="canvansW" :height="canvansH"
                style="border:1px solid #2b2f33;background-color: #2b2f33;"
                @contextmenu.prevent="contextmenuFunc()"
                ondragstart="return false;">
        </canvas>
        <!-- <br>
         &lt;!&ndash;<button v-on:click="setTimeMoveFunc()" id="setTimeMove">setTimeMove</button>&ndash;&gt;
         &lt;!&ndash;<button v-on:click="stopTimeMoveFunc()" id="stopTimeMove">stopTimeMove</button>&ndash;&gt;
         &lt;!&ndash;<button v-on:click="toggleCellFunc()" id="toggleCell">toggleCell</button>&ndash;&gt;
         &lt;!&ndash;<button v-on:click="setSpecialTimeFunc()" id="setTime">setTime</button>&ndash;&gt;

         <button v-on:click="markStartTimeFunc()" id="markStartTime">标记开始时间</button>
         <button v-on:click="markEndTimeFunc()" id="markEndTime">标记结束时间</button>
         <button v-on:click="clearMarkFunc()" id="markClear">清除标记</button>
         <button v-on:click="pauseFunc()" id="pause">暂停</button>
         <button v-on:click="playFunc()" id="play">播放</button>

         &lt;!&ndash;<input v-model="inputTimeValue" type="text" id="setTimeValue"/>&ndash;&gt;

         <ul class="clickRightMenu" id="clickRightMenu">
             <li id="">标记开始时间</li>
             <li>标记结束时间</li>
             <li>清除标记</li>
         </ul>-->
    </div>
</template>
<script>
    import passParam from '../../utils/ext.passParam';
    import D from './../../utils/DFDZ';

    export default {
        data() {
            return {
                timeLineContainer: null,
                ctx: null,
                canvansW: 300,  //默认值
                canvansH: 62,   //默认值
                timecell: [],
                inputTimeValue: '', //特定时间的输入框的值

                //默认的当前天的0点
                default_start_time: new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime(),
                //默认的当前天的23点59分59秒
                default_end_time: new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime(),

                minutes_per_step: [1, 2, 5, 10, 15, 20, 30, 60, 120, 180, 240, 360, 720, 1440], // min/格
                graduation_step: 20,//刻度间最小宽度，单位px
                hours_per_ruler: 24,//时间轴显示24小时
                defaultMaxZoom: 48,//最大缩放比例
                //start_timestamp : new Date().getTime() - 12*60*60*1000,
                //1毫秒的长度
                px_per_ms: this.canvansW / (this.hours_per_ruler * 60 * 60 * 1000), // px/ms
                //用来计算当前缩放等级最左侧的时间
                ms_per_px: (this.hours_per_ruler * 3600 * 1000) / this.canvansW, // ms/px
                start_timestamp: new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime(),       //开始时间
                end_timestamp: new Date('2020-01-05 23:59:59').getTime(),//结束时间
                current_time: new Date().getTime(),   //当前时间
                clickTime: null,        //点击时间
                returnTime: 0,       //mouseup返回时间
                minTime: new Date('2020-01-05 00:00:00').getTime(), //刻度尺最小的时间
                maxTime: new Date('2020-01-06 23:59:59').getTime(), //刻度尺最大的时间

                markType: 0,//默认是标记开始时间,1-标记开始时间，2-标记结束时间
                markedStartTime: null,//已标记的开始时间
                markedEndTime: null,//已标记的结束时间

                distance_between_gtitle: 80,
                //缩放等级
                zoom: 24,
                mouseType: 0,    //0是鼠标左键；1是规定鼠标中键；2是鼠标右键
                g_isMousedown: false,//拖动mousedown标记
                g_isMousemove: false,//拖动mousemove标记
                g_mousedownCursor: null,//拖动mousedown的位置

                on_before_click_ruler_callback: null,

                setTimeMove: null,      //定时器每秒刷新
            }
        },
        props: {
            isCurrent: {
                type: Boolean,
                default: true
            },
            width: {
                type: Number,
                default: 1300
            },
            height: {
                type: Number,
                default: 62
            },
            startTime: {
                type: Number,
                default: new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24 * 2,
            },
            endTime: {
                type: Number,
                default: new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1,
            },
            currentTime: {
                type: Number,
                default: new Date().getTime(),
            },
            hoursPerRuler: {
                type: Number,
                default: 72,        //默认三天显示
            },
            //是否支持鼠标滚轮
            hasMouseWheel: {
                type: Boolean,
                default: true
            },
        },
        computed: {
            changeMsPerPx() {
                return (this.hours_per_ruler * 3600 * 1000) / this.canvansW
            },
            changePxPerMs() {
                return this.canvansW / (this.hours_per_ruler * 60 * 60 * 1000)
            },
        },
        watch: {
            changeMsPerPx(newValue, oldValue) {
                this.ms_per_px = newValue
            },
            changePxPerMs(newValue, oldValue) {
                this.px_per_ms = newValue
            },
            'width': {
                handler(newVal) {
                    //传入的canvas宽度发生变化时，重新赋值
                    this.canvansW = newVal;
                    this.setTimeMoveFunc(true)

                }
            },
            'hoursPerRuler': {
                handler(newVal) {
                    this.hours_per_ruler = newVal;
                    this.zoom = newVal;
                    this.defaultMaxZoom = newVal;
                    this.clearCanvas();
//                    console.log(D.helper.dateFormat(this.start_timestamp), 'this.start_timestamp');
//                    console.log(D.helper.dateFormat(this.end_timestamp), 'this.end_timestamp');
//                    console.log(D.helper.dateFormat(this.returnTime), 'this.returnTime');
//                    console.log(D, this.timecell, this.end_timestamp, this.returnTime,'this.start_timestamp, this.timecell, this.end_timestamp, this.returnTime');
                    this.initCanvas(this.start_timestamp, this.timecell, this.end_timestamp, this.returnTime)
                }
            },
            'startTime': {
                handler(newVal) {
//                    console.log(D.helper.dateFormat(newVal), 'newVal');
                    this.minTime = newVal;
                    this.start_timestamp = newVal
                }
            },
            'endTime': {
                handler(newVal) {
                    this.maxTime = newVal;
                    this.end_timestamp = newVal
                }
            }
        },
        mounted() {
            //实例化
            this.timeLineContainer = this.$refs.timeLineContainer;
            this.ctx = this.timeLineContainer.getContext("2d");
            //赋值宽和高
            this.canvansW = this.width;
            this.canvansH = this.height;
            //时间设置
            this.start_timestamp = this.startTime;
            this.minTime = this.startTime;
//            this.returnTime = this.startTime;
            this.current_time = this.currentTime;
            this.end_timestamp = this.endTime;
            this.maxTime = this.endTime;
            this.hours_per_ruler = this.hoursPerRuler;
            this.zoom = this.hoursPerRuler;
            this.defaultMaxZoom = this.hoursPerRuler;
            //添加鼠标事件
            this.add_events();

            //是否自动播放--初始化canvas
            //this.setTimeMoveFunc(false);
        },
        destroyed() {
            //清空定时器
            this.pauseFunc();
        },
        methods: {
            /**
             * 初始化
             * @param {*} start_timestamp 最左侧时间
             * @param {*} timecell 录像段数组
             * @param {*} end_timestamp 最右侧时间
             * @param {*} returnTime
             * @param {*} flag:true为不加标记线，初始化
             */
            initCanvas: function (start_timestamp, timecell, end_timestamp, returnTime, flag = true) {
                this.timecell = timecell;
                this.start_timestamp = start_timestamp;
                this.end_timestamp = end_timestamp;
                //绘制录像块背景
                this.drawCellBg();
                //绘制添加最左侧刻度
                this.add_graduations(start_timestamp);
                //添加录像段
                this.add_cells(timecell);
                //画线
                this.drawLine(0, this.canvansH, this.canvansW, this.canvansH, "rgb(151, 158, 167)", 1); //底线
                //默认播放时间线从头开始
                this.ctx.fillStyle = "rgb(64, 196, 255)";
                if (flag) {
                    this.drawLine(this.canvansW * ((returnTime - start_timestamp) / (end_timestamp - start_timestamp)), 0, this.canvansW * ((returnTime - start_timestamp) / (end_timestamp - start_timestamp)), 33, "rgb(64, 196, 255", 2);
                    //画刻度线标记的时间值（文本）
                    this.ctx.fillText(this.changeTime(returnTime), this.canvansW * ((returnTime - start_timestamp) / (end_timestamp - start_timestamp)) - 60, 50);
                }

                if (this.markedStartTime !== null) { //绘制标记的开始时间
                    this.drawMarkPoint(this.markedStartTime, 1);
                }

                if (this.markedEndTime !== null && this.markedEndTime > this.markedStartTime) { //绘制标记的结束时间
                    this.drawMarkPoint(this.markedEndTime, 2);
                }
            },
            /**
             * 更新timeCell录像块数据
             *
             */
            updateTimeCell(value) {
                this.timecell = value;
            },
            /**
             * 更新returnTime
             *
             */
            updateReturnTime(value) {
                this.returnTime = value;
            },

            /**
             * 鼠标右击事件
             */
            contextmenuFunc: function (event) {
                this.markPoint(event);
            },
            /**
             * 自动变化时间
             * @param flag:false表示只为了初始化canvas，true为自动播放
             * @param isClose 是否关闭功能，true为关闭，false为暂停功能
             */
            setTimeMoveFunc: function (flag, isClose = true) {
                let self = this;
                clearInterval(this.setTimeMove);   //先清除定时器后开启
                //默认移动到当前位置
                self.move_to_return_time(this.start_timestamp, this.returnTime, this.end_timestamp, this.timecell, isClose ? flag : true);
                if (flag) {
                    self.setTimeMove = setInterval(function () {
                        //因为在定时器前先移动的，所以加1秒钟需要放到移动的前面
                        self.returnTime = self.returnTime + 1000;
                        self.move_to_return_time(self.start_timestamp, self.returnTime, self.end_timestamp, self.timecell);
                        //判断定时走的时长超出了录像的结束时间，则停止定时器，停止播放录像
                        const flag = self.judgeInsideTimeCell(self.returnTime);
                        if (!flag) {
                            //判断是否存在断点，是否存在后面的录像块, true后面没有录像，false为有
                            const flag1 = self.judgeOverTimeCell(self.returnTime);
                            if (flag1) {
                                clearInterval(self.setTimeMove);
                                self.setTimeMove = null;
                                self.$emit('click-stop-video');
                            }
                        }
                    }, 1000)
                }

            },

            toggleCellFunc: function () {
                this.clearCanvas();
                let _timecell = [
                    {
                        "beginTime": this.default_start_time + 4 * 3600 * 1000,
                        "endTime": this.default_start_time + 1 * 3600 * 1000
                    },
                    {
                        "beginTime": this.default_start_time + 7 * 3600 * 1000,
                        "endTime": this.default_start_time + 9 * 3600 * 1000
                    },
                    {
                        "beginTime": this.default_start_time + 12.8 * 3600 * 1000,
                        "endTime": this.default_start_time + 15.6 * 3600 * 1000
                    }
                ];
                this.initCanvas(this.default_start_time, _timecell);
            },

            /**
             * 设置特定时间
             */
            setSpecialTimeFunc: function () {
                this.set_time_to_middle(this.inputTimeValue);
            },

            /**
             * 标记开始时间
             */
            markStartTimeFunc: function () {
                this.setMarkType(1)
            },
            /**
             * 标记结束时间
             */
            markEndTimeFunc: function () {
                this.setMarkType(2)
            },
            /**
             * 清除标记
             */
            clearMarkFunc: function () {
                this.clearMark();
            },

            /**
             * 暂停功能
             */
            pauseFunc: function () {
                clearInterval(this.setTimeMove);
            },

            /**
             * 播放功能
             */
            playFunc: function (callback) {
                this.setTimeMoveFunc(true);
                this.$emit('node-click', callback && callback())
            },

            /**
             * 绘制添加刻度
             * @param {*} start_timestamp 最左侧时间
             */
            add_graduations: function (start_timestamp) {
                let _this = this;
                let px_per_min = this.canvansW / (this.hours_per_ruler * 60); // px/min
                let px_per_ms = this.canvansW / (this.hours_per_ruler * 60 * 60 * 1000); // px/ms
                let px_per_step = this.graduation_step;  // px/格 默认最小值20px
                let min_per_step = px_per_step / px_per_min; // min/格

                for (let i = 0; i < this.minutes_per_step.length; i++) {
                    if (min_per_step <= this.minutes_per_step[i]) { //让每格时间在minutes_per_step规定的范围内
                        min_per_step = this.minutes_per_step[i];
                        px_per_step = px_per_min * min_per_step;
                        break;
                    }
                }

                let medium_step = 30;
                for (let i = 0; i < this.minutes_per_step.length; i++) {
                    if (this.distance_between_gtitle / px_per_min <= this.minutes_per_step[i]) {
                        medium_step = this.minutes_per_step[i];
                        break;
                    }
                }

                let num_steps = this.canvansW / px_per_step; //总格数
                let graduation_left;
                let graduation_time;
                let caret_class;
                let lineH;
                let ms_offset = this.ms_to_next_step(start_timestamp, min_per_step * 60 * 1000);//开始的偏移时间 ms
                let px_offset = ms_offset * px_per_ms; //开始的偏移距离 px
                let ms_per_step = px_per_step / px_per_ms; // ms/step

                //画
                for (let i = 0; i < num_steps; i++) {
                    graduation_left = px_offset + i * px_per_step; // 距离=开始的偏移距离+格数*px/格
                    graduation_time = start_timestamp + ms_offset + i * ms_per_step; //时间=左侧开始时间+偏移时间+格数*ms/格
                    let date = new Date(graduation_time);
                    if (date.getUTCHours() == 0 && date.getUTCMinutes() == 0) {
                        caret_class = 'big';
                        lineH = 25;
                        let big_date = this.graduation_title(date);
                        this.ctx.fillText(big_date, graduation_left - 20, 30);
                        this.ctx.fillStyle = "rgba(151,158,167,1)";
                    } else if (graduation_time / (60 * 1000) % medium_step == 0) {
                        caret_class = 'middle';
                        lineH = 15;
                        let middle_date = this.graduation_title(date);
                        this.ctx.fillText(middle_date, graduation_left - 20, 30);
                        this.ctx.fillStyle = "rgba(151,158,167,1)";
                    } else {
                        lineH = 10;
                    }
                    // drawLine(graduation_left,0,graduation_left,lineH,"rgba(151,158,167,0.4)",1);
                    this.drawLine(graduation_left, 0, graduation_left, lineH, "rgba(151,158,167,1)", 1);
                }
            },
            /**
             * 绘制线
             * @param {*} beginX
             * @param {*} beginY
             * @param {*} endX
             * @param {*} endY
             * @param {*} color
             * @param {*} width
             */
            drawLine: function (beginX, beginY, endX, endY, color, width) {
                this.ctx.beginPath();
                this.ctx.moveTo(beginX, beginY);
                this.ctx.lineTo(endX, endY);
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = width;
                this.ctx.stroke();
            },
            /**
             * 添加录像段
             * @param {*} cells 录像数组
             */
            add_cells: function (cells) {
                cells.forEach(cell => {
                    this.draw_cell(cell)
                });
            },

            /**
             * 绘制录像块
             * @param {*} cell cell包括beginTime ms;endTime ms;style
             */
            draw_cell: function (cell) {
                let px_per_ms = this.canvansW / (this.hours_per_ruler * 60 * 60 * 1000); // px/ms
                let beginX = (cell.beginTime - this.start_timestamp) * px_per_ms;
                let cell_width = ( cell.endTime - cell.beginTime) * px_per_ms;
                if (cell.style) {
                    this.ctx.fillStyle = cell.style.background;
                } else {
                    this.ctx.fillStyle = "rgba(0, 255, 78, 0.6)";
                }

                this.ctx.fillRect(beginX, 0, cell_width, 15);
            },

            /**
             * 绘制录像块背景
             */
            drawCellBg: function () {
                this.ctx.fillStyle = "rgba(69, 72, 76, 0.5)";
                this.ctx.fillRect(0, 0, this.canvansW, 15);
            },
            /**
             * 时间轴事件
             */
            add_events: function () {
                if (this.timeLineContainer.addEventListener) {
                    if(this.hasMouseWheel){
                        this.timeLineContainer.addEventListener('mousewheel', this.mousewheelFunc.bind(this));
                    }
                    this.timeLineContainer.addEventListener('mousedown', this.mousedownFunc.bind(this));
                    this.timeLineContainer.addEventListener('mousemove', this.mousemoveFunc.bind(this));
//                    document.addEventListener('mouseup', this.mouseupFunc.bind(this));
                    this.timeLineContainer.addEventListener('mouseup', this.mouseupFunc.bind(this));
                    this.timeLineContainer.addEventListener('mouseout', this.mouseoutFunc.bind(this));
//                    this.timeLineContainer.addEventListener('dblclick', this.dblclickFunc.bind(this));
                    //this.timeLineContainer.addEventListener('click', this.clickFunc.bind(this));
                }
            },
            /**
             * 点击事件
             */
            clickFunc: function (e) {
                this.g_isMousedown = false;
                let posx = this.get_cursor_x_position(e); //鼠标距离 px
                let ms_per_px = (this.zoom * 3600 * 1000) / this.canvansW; // ms/px
                //当前点击的时间，但是如果超出最大时间，则没有录像，不赋值
                let temporaryTime = this.start_timestamp + posx * ms_per_px;
                if (this.end_timestamp > temporaryTime) {
                    this.returnTime = this.start_timestamp + posx * ms_per_px;
                    clearInterval(this.setTimeMove);
                    this.setTimeMoveFunc(true);
                } else {
                    this.$message({message: "当前时间无录像", type: 'warning'})
                }
            },
            /**
             * 双击事件
             */
            dblclickFunc: function (e) {
                let posx = this.get_cursor_x_position(e); //鼠标距离 px
                let ms_per_px = (this.zoom * 3600 * 1000) / this.canvansW; // ms/px
                this.returnTime = this.start_timestamp + posx * ms_per_px;
                alert(D.helper.dateFormat(new Date(this.returnTime)));
            },
            /**
             * 拖动/点击 mousedown事件
             */
            mousedownFunc: function (e) {
                //判断是什么时间
                this.mouseType = e.button;
                this.g_isMousedown = true;
                this.g_mousedownCursor = this.get_cursor_x_position(e);//记住mousedown的位置
//                clickRightHtml.style.display = "none";//每次右键都要把之前显示的菜单隐藏哦
            },
            /**
             * 拖动/鼠标hover显示 mousemove事件
             */
            mousemoveFunc: function (e) {
                //获取鼠标posx
                let pos_x = this.get_cursor_x_position(e);
                let px_per_ms = this.canvansW / (this.hours_per_ruler * 60 * 60 * 1000); // px/ms
                this.clearCanvas();

                if (this.g_isMousedown) {
                    //鼠标拖动
                    let diff_x = pos_x - this.g_mousedownCursor;
                    this.start_timestamp = this.start_timestamp - Math.round(diff_x / px_per_ms);
                    this.end_timestamp = this.start_timestamp + (this.hours_per_ruler * 3600 * 1000);
                    if (this.start_timestamp < this.minTime) {
                        this.end_timestamp = this.minTime + (this.hours_per_ruler * 3600 * 1000);
                        this.initCanvas(this.minTime, this.timecell, this.end_timestamp, this.returnTime);
                    }
                    if (this.end_timestamp > this.maxTime) {
                        this.end_timestamp = this.maxTime;
                        this.start_timestamp = this.maxTime - (this.hours_per_ruler * 3600 * 1000);
                        this.initCanvas(this.start_timestamp, this.timecell, this.end_timestamp, this.returnTime);
                    }
                    if (this.start_timestamp > this.minTime && this.end_timestamp < this.maxTime) {
                        this.initCanvas(this.start_timestamp, this.timecell, this.end_timestamp, this.returnTime);
                    }

                    //this.markedTime = null;//已标记的时间
                    //this.markedPosx = null;
                    if (diff_x != 0) {  //产生位移才赋值
                        this.g_isMousemove = true;
                    }

                    this.g_mousedownCursor = pos_x;

                } else {
                    //鼠标滑动
                    let time = this.start_timestamp + pos_x / px_per_ms;
                    //保持绘制的线
                    this.initCanvas(this.start_timestamp, this.timecell, this.end_timestamp, this.returnTime);
                    //画鼠标当前的提示线
                    this.drawLine(pos_x, 0, pos_x, 50, "rgb(194, 202, 215)", 1);
                    this.ctx.fillStyle = "rgb(194, 202, 215)";
                    this.ctx.fillText(this.changeTime(time), pos_x - 50, 60);
                }
            },

            /**
             * 滚轮放大缩小，以时间轴中心为准 mousewheel事件
             */
            mousewheelFunc: function (event) {
                if (event && event.preventDefault) {
                    event.preventDefault()
                } else {
                    window.event.returnValue = false;
                    return false;
                }

                let e = window.event || event;

                //IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”，FF浏览器使用的是detail,其值为“正负3”
                //因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理，所以下面是容错处理，获取滚轮是放大还是缩小，向上滚动是放大，向下滚动是缩小
                let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

                //获取鼠标posx
                let pos_x = this.get_cursor_x_position(e);
                //获取当前时间
                let currentTime = this.start_timestamp + pos_x * this.ms_per_px;

                // let middle_time = _this.start_timestamp + (_this.hours_per_ruler * 3600 * 1000) / 2; //ms 记住当前中间的时间
                //delta<0是向下滚动，>0是向上滚动
                if (delta < 0) {
                    this.zoom = this.zoom + 4;
                    if (this.zoom >= this.defaultMaxZoom) {
                        this.zoom = this.defaultMaxZoom;//放大最大为多少小时
                    }
                    this.hours_per_ruler = this.zoom;
                } else if (delta > 0) {// 放大
                    this.zoom = this.zoom - 4;
                    if (this.zoom <= 1) {
                        this.zoom = 1;//缩小最小1小时
                    }
                    this.hours_per_ruler = this.zoom;
                }
                this.ms_per_px = (this.hours_per_ruler * 3600 * 1000) / this.canvansW;
                //清空canvas
                this.clearCanvas();
                //更新当前时间
                this.start_timestamp = this.hours_per_ruler >= this.defaultMaxZoom ? this.minTime : (currentTime - (pos_x * this.ms_per_px)) < this.minTime ? this.minTime : (currentTime - (pos_x * this.ms_per_px)); //start_timestamp = 鼠标悬停的当前时间 - 当前缩放等级下每个px的ms数 * 鼠标x坐标]
                this.end_timestamp = (this.start_timestamp + this.hours_per_ruler * 3600 * 1000) > this.maxTime ? this.maxTime : (this.start_timestamp + this.hours_per_ruler * 3600 * 1000);
                this.initCanvas(this.start_timestamp, this.timecell, this.end_timestamp, this.returnTime)
            },

            /**
             * 鼠标移出隐藏时间 mouseout事件
             * @param {*} e
             */
            mouseoutFunc: function (e) {
                this.clearCanvas();
                this.initCanvas(this.start_timestamp, this.timecell, this.end_timestamp, this.returnTime);
            },
            /**
             * 拖动/点击 mouseup事件
             */
            mouseupFunc: function (e) {
                if (this.g_isMousemove) { //拖动 事件
                    this.g_isMousemove = false;
                    this.g_isMousedown = false;
                    //之前的代码是将竖线始终保持在中间，所以需要下面这个代码
//                    this.returnTime = this.start_timestamp + (this.hours_per_ruler * 3600 * 1000) / 2;
                } else { // click 事件
                    //这里的click事件是需要通过鼠标down事件来区分左键右键的，否则有bug
                    this.g_isMousedown = false;
                    if (this.mouseType === 0) {
                        let posx = this.get_cursor_x_position(e); //鼠标距离 px
                        let ms_per_px = (this.zoom * 3600 * 1000) / this.canvansW; // ms/px
                        //当前点击的时间，但是如果超出最大时间，则没有录像，不赋值
                        let temporaryTime = this.start_timestamp + posx * ms_per_px;
                        console.log(D.helper.dateFormat(this.current_time), 'this.current_time');
                        console.log(D.helper.dateFormat(temporaryTime), 'temporaryTime.temporaryTime');
                        const flag = this.judgeInsideTimeCell(temporaryTime);
                        if (flag) {
                            this.returnTime = this.start_timestamp + posx * ms_per_px;
                            clearInterval(this.setTimeMove);
                            //this.setTimeMoveFunc(true);
                            //点击后的回调函数
                            this.$emit('click-bar', this.changeTime(this.returnTime));
                        } else {
                            //this.$message({message: "当前时间无录像", type: 'warning'})
                        }
                    }


//                    alert(D.helper.dateFormat(new Date(this.returnTime)));
//                    this.drawLine(this.canvansW * ((this.returnTime - this.start_timestamp) / (this.end_timestamp - this.start_timestamp)), 0, this.canvansW * ((this.returnTime - this.start_timestamp) / (this.end_timestamp - this.start_timestamp)), 33, "rgb(64, 196, 255", 2);
                    //this.set_time_to_middle(this.returnTime);
                }
            },
            /**
             *  判断点击的位置是否在录像块的内部
             *
             */
            judgeInsideTimeCell(clickTime) {
                const self = this;
                let flag = false;
                self.timecell.forEach(item => {
                    if (item.beginTime <= clickTime && item.endTime >= clickTime) {
                        flag = true;
                    }
                })
                return flag;
            },
            //判断是否播放到最后一个录像块，若是后面还有录像块并存在断点，则自动跳到下一个录像块
            judgeOverTimeCell(clickTime) {
                const self = this;
                let flag = false;
                const total = self.timecell.length;
                self.timecell.forEach((item, index) => {
                    if (!(item.endTime >= clickTime && item.beginTime <= clickTime)) {
                        if (total == 1) {
                            flag = true
                        } else if (total > 1) {
                            if (index < total - 1) {
                                //若后面还有录像块，则自动跳过，定位到下一段录像的开始时间
                                self.returnTime = self.timecell[index + 1].beginTime;
                                //播放对应的视频录像
                                self.$parent.handleClickBar(self.changeTime(self.returnTime));

                                flag = false;
                            } else {
                                flag = true
                            }
                        }
                    }
                })
                return flag;
            },


//            //右键添加部门-弹框的确定按钮or修改部门-保存
//            contextmenuFunc: function (e) {
//                let _this = this;
//                let posx = _this.get_cursor_x_position(e); //鼠标距离 px
//                let ms_per_px = (_this.zoom * 3600 * 1000) / _this.canvansW; // ms/px
//                _this.returnTime = _this.start_timestamp + posx * ms_per_px;
//
//                //_this.set_time_to_middle(_this.returnTime);
//
//                _this.ctx.beginPath();
//                _this.ctx.arc(100, 50, 40, 0, 2 * Math.PI);
//                //ctx.arc(posx,this.canvansH,5,0,2*Math.PI);
//                _this.ctx.fillStyle = "red";
//                _this.ctx.fill();
//                _this.ctx.stroke();
//            },
            /**
             * 设置时间点类型
             */
            setMarkType: function (type) {
                this.markType = type;
            },
            /**
             * 清除标记的时间点
             */
            clearMark: function () {
                this.markedStartTime = null;
                this.markedEndTime = null;
                this.clearCanvas();
                clearInterval(this.setTimeMove);
                this.markType = 0;
                this.setTimeMoveFunc(true);
            },
            /**
             * 标记时间点
             */
            markPoint: function (e) {
                let posx = this.get_cursor_x_position(e); //鼠标距离 px
                let ms_per_px = (this.zoom * 3600 * 1000) / this.canvansW; // ms/px

                if (this.markType === 1) {

                    this.markedStartTime = this.start_timestamp + posx * ms_per_px;
                    this.drawMarkPoint(this.markedStartTime, 1);
                    if (this.markedEndTime !== null && this.markedEndTime <= this.markedStartTime) {
                        this.markedEndTime = null;
                    }
                }

                if (this.markType === 2) {
                    if (!this.markedStartTime) {
                        alert('请先标记开始时间！');
                    } else {
                        this.markedEndTime = this.start_timestamp + posx * ms_per_px;
                        if (this.markedEndTime <= this.markedStartTime) {
                            alert('结束时间不得小于或等于结束时间！');
                        } else {
                            this.drawMarkPoint(this.markedEndTime, 2);
                        }

                    }
                }
            },

            /**
             * 画开始时间和结束时间的刻度线
             * @param markedTime 标记的时间
             * @param type 1表示开始时间，2表示结束时间
             */
            drawMarkPoint: function (markedTime, type) {
                let diff = markedTime - this.start_timestamp;
                let ms_per_px = (this.zoom * 3600 * 1000) / this.canvansW; // ms/px

                let posx = null;
                if (diff > 0) {
                    posx = diff / ms_per_px;
                    if (type === 1) {
                        this.drawLine(posx, 0, posx, 50, "rgb(60, 255, 0)", 1);
                        this.ctx.fillStyle = "rgb(60, 255, 0)";
                        this.ctx.fillText(this.changeTime(markedTime), posx - 50, 60);
                    }
                    if (type === 2) {
                        this.drawLine(posx, 0, posx, 50, "rgb(255, 144, 0)", 1);
                        this.ctx.fillStyle = "rgb(255, 144, 0)";
                        this.ctx.fillText(this.changeTime(markedTime), posx - 50, 60);
                    }

                }
            },
            /**
             * 获取鼠标posx
             * @param {*} e
             */
            get_cursor_x_position: function (e) {
                let posx = 0;

                if (!e) {
                    e = window.event;
                }

                if (e.pageX || e.pageY) {
                    posx = e.offsetX;
//                    posx = e.pageX;
                } else if (e.clientX || e.clientY) {
                    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                }

                return posx;
            },

            /**
             * 返回时间轴上刻度的时间
             * @param {*} datetime new Date 格式
             */
            graduation_title: function (datetime) {
                if (datetime.getHours() === 0 && datetime.getMinutes() === 0 && datetime.getMilliseconds() === 0) {
                    return ('0' + datetime.getDate().toString()).substr(-2) + '.' +
                        ('0' + (datetime.getMonth() + 1).toString()).substr(-2) + '.' +
                        datetime.getFullYear();
                }
                return datetime.getHours() + ':' + ('0' + datetime.getMinutes().toString()).substr(-2);
            },
            /**
             * 返回 2018-01-01 10:00:00 格式时间
             * @param {*} time
             */
            changeTime: function (time) {
                let newTime = new Date(time);
                let year = newTime.getFullYear();
                let month = newTime.getMonth() + 1;
                if (month < 10) {
                    month = "0" + month;
                }
                let date = newTime.getDate();
                if (date < 10) {
                    date = "0" + date;
                }
                let hour = newTime.getHours();
                if (hour < 10) {
                    hour = "0" + hour;
                }
                let minute = newTime.getMinutes();
                if (minute < 10) {
                    minute = "0" + minute;
                }
                let second = newTime.getSeconds();
                if (second < 10) {
                    second = "0" + second;
                }
                return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
            },

            /**
             * 左侧开始时间的偏移，返回单位ms
             * @param {*} timestamp
             * @param {*} step
             */
            ms_to_next_step: function (timestamp, step) {
                let remainder = timestamp % step;
                return remainder ? step - remainder : 0;
            },

            /**
             * 设置时间，让这个时间点跳到中间红线处
             *  @param {*} time 单位ms
             *  @param {*} timecell 单位ms
             */
            set_time_to_middle: function (time, timecell) {
                this.clearCanvas();
                this.start_timestamp = time - (this.hours_per_ruler * 60 * 60 * 1000) / 2;
                this.initCanvas(this.start_timestamp, timecell)
            },

            /**
             * 默认显示当天时间，如果传时间就按照传的时间来增加
             * @param start_time
             * @param current_time
             * @param end_time
             * @param timecell 单位ms
             */
            move_to_current_time: function (start_time, current_time, end_time, timecell) {
                this.clearCanvas();
                this.start_timestamp = start_time;
                this.end_timestamp = end_time;
                this.initCanvas(this.start_timestamp, timecell, this.end_timestamp, this.returnTime)
            },

            /**
             * 默认从头加载，如果鼠标点击就按照鼠标点击的来
             * @param start_time
             * @param returnTime 鼠标点击时间
             * @param end_time
             * @param timecell 单位ms
             */
            move_to_return_time: function (start_time, returnTime, end_time, timecell, flag) {
                this.clearCanvas();
                this.start_timestamp = start_time;
                this.end_timestamp = end_time;
                this.initCanvas(this.start_timestamp, timecell, this.end_timestamp, returnTime, flag)
            },

            /**
             * 返回点击或者拖动的时间点
             */
            returnMouseupTime: function (callback) {
                let _this = this;
                if (_this.returnTime != null) {
                    if (callback) {
                        callback(_this.returnTime);
                    }
                }
            },

            /**
             * 清除canvas 每次重新绘制需要先清除
             */
            clearCanvas: function () {
                this.ctx.clearRect(0, 0, this.canvansW, this.canvansH);
            },

            /**
             * 插件设置
             * @param {*} options
             * @param {number} start_time 开始时间戳
             * @param {number} end_time 结束时间戳
             * @param {Array} cell 时间块数组
             *                  {
                        "beginTime":new Date().getTime()-0.5*3600*1000,
                        "endTime":new Date().getTime(),
                        "style": {
                            "background":"rgba(132, 244, 180, 0.498039)"
                        }
                    },
             * @param {*} callback
             */
//            Plugin: function (options, start_time, current_time, end_time, cell, callback) {
//                return this.each(function () {
//                    let _this = $(this);
//                    let _thisId = this.id;
//                    let data = _this.data('timeslider');
//                    if (!data) {
//                        _this.data('timeslider', new TimeSlider(_thisId, options));
//                    }
//                    else {
//                        if (typeof options == 'string') {
//                            switch (options) {
//                                case 'clearMark':
//                                    data.clearMark();
//                                    break;
//                                case 'setMarkType':
//                                    data.setMarkType(start_time);
//                                    break;
//                                case 'markPoint':
//                                    data.markPoint();
//                                    break;
//                                case 'set_time_to_middle':
//                                    data.set_time_to_middle(start_time, cell);
//                                    break;
//                                case 'move_to_current_time':
//                                    data.move_to_current_time(start_time, current_time, end_time, cell);
//                                    break;
//                                case 'returnMouseupTime':
//                                    data.returnMouseupTime(callback);
//                                    break;
//                                case 'initCanvas':
//                                    data.clearCanvas();
//                                    data.initCanvas(start_time, cell);
//                                    break;
//                            }
//                        }
//                        else {
//                            // data.set_options(options);
//                        }
//                    }
//                });
//            },
        }
    }
</script>
<style lang="less">
    @import "./style/timeLine.less";
</style>
