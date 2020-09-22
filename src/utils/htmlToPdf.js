/**
 * @description
 * @Version Created by Stephen on 2020/7/19.
 * @Author Stephen
 * @license dongfangdianzi
 */
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
    install(Vue, options) {
        Vue.prototype.getPdf = function (dom) {
            let url;
            //-----------------------------------下面的操作都是为了兼容textarea只显示一行-----------------------------------
            //原来的dom
            let targetDom = document.querySelector(dom);
            //全部克隆一份出来
            let copyDom = targetDom.cloneNode(true);
            //插入dom
            $('.app-main').append(copyDom);
            //获取所有textarea
            let textAreaList = copyDom.getElementsByTagName("textarea");
            for (let i=0; i<textAreaList.length; i++){
                //获取当前textarea的值
                let currentValue = textAreaList[i].value;
                //获取爷爷节点
                let parent = textAreaList[i].parentNode.parentNode;
                //将父亲节点删除，并且插入造好的div
                let div = document.createElement('div');
                div.innerHTML = currentValue;
                div.className= 'textarea-div';
                parent.removeChild(textAreaList[i].parentNode)
                parent.appendChild(div);
            }
            
            //单选按钮打印界面样式偏移，打印样式修改
            let elRadioList = copyDom.getElementsByClassName("elRadio");
            //给所有的单选按钮dom元素添加自定义的text-class类
            for(let j = 0;j < elRadioList.length;j++){
                elRadioList[j].classList.add("text-class");
            }
            
            //-----------------------------------上面的操作都是为了兼容textarea只显示一行---------------------------------------
            html2Canvas(copyDom, {
                allowTaint: true,   //允许污染
            }).then(function (canvas) {
                //成功转为成canvas后需要移除复制的dom节点
                copyDom.remove();
                //html页面生成的canvas具体内容的宽度和高度
                let contentWidth = canvas.width;
                let contentHeight = canvas.height;
                //a4纸的尺寸[595.28,841.89],也就是pdf大小每页的大小
                let A4PageWidth = 595.28;
                let A4PageHeight = 841.89;
                //html页面生成的canvas在pdf中图片的宽高(将html页面转化成a4纸大小的高度)
                let pdfImgHeight = contentHeight * A4PageWidth / contentWidth;
                //同pdfImgHeight数值，因为需要计算多少页，所以找一个单独变量接收
                let leftHeight = contentHeight * A4PageWidth / contentWidth ;
                //页面偏移
                let position = 30;
                //将canvas转化成图片
                let pageData = canvas.toDataURL('image/jpeg', 1.0);
                let PDF = new JsPDF('', 'pt', 'a4');
                //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < A4PageHeight) {
                    // 0, 40, 控制文字距离左边，与上边的距离
                    PDF.addImage(pageData, 'JPEG', 0, position, A4PageWidth, pdfImgHeight)
                } else {
                    while (leftHeight > 0) {
                        PDF.addImage(pageData, 'JPEG', 0, position, A4PageWidth, pdfImgHeight);
                        //计算分页
                        leftHeight -= A4PageHeight;
                        position -= A4PageHeight;
                        if (leftHeight > 0) {
                            PDF.addPage()
                        }
                    }
                }
    
                //原来的代码
                /*//html页面生成的canvas具体内容的宽度和高度
                let contentWidth = canvas.width;
                let contentHeight = canvas.height;
                //一页pdf显示html页面生成的canvas高度（也就是将a4纸等比放大到跟canvas宽度一样的大小）
                let pdfPageHeight = contentWidth / 595.28 * 841.89;
                //未生成pdf的html页面总高度
                let leftHeight = contentHeight;
                //页面偏移
                let position = 20;
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                let imgWidth = 595.28;
                let imgHeight = imgWidth / contentWidth * contentHeight;
                //将canvas转化成图片
                let pageData = canvas.toDataURL('image/jpeg', 1.0);
                let PDF = new JsPDF('', 'pt', 'a4');
                //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < pdfPageHeight) {
                    // 0, 40, 控制文字距离左边，与上边的距离
                    PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                } else {
                    while (leftHeight > 0) {
                        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                        leftHeight -= pdfPageHeight;
                        position -= 841.89;
                        if (leftHeight > 0) {
                            PDF.addPage()
                        }
                    }
                }*/
                
                //新标签打开生成的pdf
                window.open(PDF.output('bloburl'))
            })
        }
    }
}