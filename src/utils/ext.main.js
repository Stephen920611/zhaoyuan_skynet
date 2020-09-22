/*公共方法的封装*/
import Vue from 'vue'
let $vue = new Vue();

export default {

  /*提示框：type="success"，表示是一条成功提示；type="warning"，表示是一条警告提示框；type="error"，表示是一条错误提示；type若是不传，或者null则是消息提示框；showClose:是否显示关闭按钮，默认为false*/
  notice:(text,type,showClose)=>{
    if(type){
      $vue.$message({
        message:text,
        type:type,
        showClose: showClose || false
      })
    }else{
      $vue.$message({
        message:text,
        showClose: showClose || false
      })
    }
  },

  /*查询使用：将没填写或者未选择过滤掉
   *formData[Object]：查询时传入的参数对象
   * */

  filterSearchParamFunc:(formData)=>{
    let params = {};
    let {keys, values, entries} = Object;
    for(let key of keys(formData)){
      if(formData[key] !== undefined &&formData[key] !== "undefined" && formData[key] !== "" &&formData[key] !==null){
        params[key] = formData[key]
      }
    }
    return params;
  },

  /*编辑回显使用
  *formData[Object]：是定义的回显参数
  * formData[infoData]:带参数值的详情信息
  * */
  editShowInfoFunc:(formData,infoData)=>{
    let {keys, values, entries} = Object;
    for(let key of keys(infoData)){
      if(formData.hasOwnProperty(key)){
        formData[key] = infoData[key]
      }
    }
  },

}
