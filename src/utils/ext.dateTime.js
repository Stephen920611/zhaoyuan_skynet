/**
 * @description
 * @Version Created by luzaibao on 2019/12/18.
 * @Author luzaibao
 * @license dongfangdianzi
 */
const dateTime = {};
const _this = dateTime;
_this.curentDate = ()=>{
  return _this.curentTime().substr(0, 10);
};
_this.curentTime = ()=>{
  const now = new Date();
  return _this.dateFormat(now);
};
_this.dateFormat = (dateString)=> {
  const now = new Date(dateString);
  const year = now.getFullYear();       //年
  const  month = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1);     //月
  const day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();            //日
  const  hh = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();            //时
  const mm = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();          //分
  const ss = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();           //秒
  return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
};
//获取指定时间的指定时间,如获取2018-10-10 10:10:10的前30秒,传('2018-10-10 10:10:10',-30*1000)
_this.getTimeSelecttTime = (time, number) =>{
  let d = new Date(time);
  d = +d + number;
  const now = new Date(d);
  return _this.dateFormat(now);
};
//计算结束时间与开始时间相差几天
_this.getSeveralDays =  (start, end)=> {
  start = new Date(start).getTime()
  end = new Date(end).getTime()
  let time = 0
  if (start > end) {
    // alert('结束时间需要大于开始时间2！')
    return false
  } else {
    time = end - start
  }
  return Math.floor(time / 86400000) + 1;
};

export default dateTime
