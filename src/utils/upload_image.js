import $axios from './request'

/**
 * 上传压缩图片
 * @param file0
 * @returns {Promise}
 */
export function compressImage(file0) {
    // file0.status = 'uploading';
    // file0.message = '上传中...';
    return new Promise((resolve, reject) => {
        
        // 计算图片宽高
        calcuImage(file0).then(file1 => {
            //处理图片压缩
            dealImage(file1).then(file2 => {
                // file2.status = 'success';
                // file2.message = '上传成功';
                resolve(file2)
            })
        })
    })
}

/**
 * 计算图片宽高
 * @param {*} file
 */
function calcuImage(file) {
    return new Promise((resolve, reject) => {
        var arr = file.content.split(',');
        var mime = arr[0].match(/:(.*?);/)[1]
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        var f = new Blob([u8arr], {type: mime})
        var reader = new FileReader()
        reader.onload = function (e) {
            var data = e.target.result
            // 加载图片获取图片真实宽度和高度
            var image = new Image()
            image.onload = function () {
                file.width = image.width
                file.height = image.height
                file.size = f.size
                resolve(file)
            }
            image.src = data
        }
        reader.readAsDataURL(f)
    })
}

/**
 * 压缩照片
 *
 *
 *  在IOS中，canvas绘制图片是有两个限制的：
 * 首先是图片的大小，如果图片的大小超过两百万像素，图片也是无法绘制到canvas上的，调用drawImage的时候不会报错，但是你用toDataURL获取图片数据的时候获取到的是空的图片数据。
 * 再者就是canvas的大小有限制，如果canvas的大小大于大概五百万像素（即宽高乘积）的时候，不仅图片画不出来，其他什么东西也都是画不出来的。
 * 应对第一种限制，处理办法就是瓦片绘制了。瓦片绘制，也就是将图片分割成多块绘制到canvas上，我代码里的做法是把图片分割成100万像素一块的大小，再绘制到canvas上。
 * 而应对第二种限制，我的处理办法是对图片的宽高进行适当压缩，我代码里为了保险起见，设的上限是四百万像素，如果图片大于四百万像素就压缩到小于四百万像素。四百万像素的图片应该够了，算起来宽高都有2000X2000了。
 * 如此一来就解决了IOS上的两种限制了。
 * 除了上面所述的限制，还有两个坑，一个就是canvas的toDataURL是只能压缩jpg的，当用户上传的图片是png的话，就需要转成jpg，也就是统一用canvas.toDataURL(‘image/jpeg', 0.1) ， 类型统一设成jpeg，而压缩比就自己控制了。
 * 另一个就是如果是png转jpg，绘制到canvas上的时候，canvas存在透明区域的话，当转成jpg的时候透明区域会变成黑色，因为canvas的透明像素默认为rgba(0,0,0,0)，所以转成jpg就变成rgba(0,0,0,1)了，也就是透明背景会变成了黑色。解决办法就是绘制之前在canvas上铺一层白色的底色。
 *
 *
 *
 * @param {*} file
 */
function dealImage(file) {
    return new Promise((resolve, reject) => {
        // 大于1MB的图片都缩小像素上传
        if (file.file.size > 1000000) {
            // 创建Canvas对象(画布)
            const canvas = document.createElement('canvas')
            // 获取对应的CanvasRenderingContext2D对象(画笔)
            const context = canvas.getContext('2d')
            //瓦片
            let tCanvas = document.createElement("canvas");
            let tctx = tCanvas.getContext("2d");

            // 创建新的图片对象
            const img = new Image()
            // 指定图片的DataURL(图片的base64编码数据)
            img.src = file.content
            // 监听浏览器加载图片完成，然后进行进行绘制
            img.onload = () => {
                // 指定canvas画布大小，该大小为最后生成图片的大小
                /*const scale = file.width / file.height
                 // canvas.width = 375
                 canvas.width = 1125
                 // canvas.height = 375 / scale
                 canvas.height = 1125 / scale*/


                let width = img.width;
                let height = img.height;
                //如果图片大于一百五万像素，计算压缩比并将大小压至150万以下
                let ratio;
                if ((ratio = (width * height) / 1500000) > 1) {
                    ratio = Math.sqrt(ratio);
                    width /= ratio;
                    height /= ratio;
                } else {
                    ratio = 1;
                }
                canvas.width = width;
                canvas.height = height;

                //铺底色--因为canvas的透明像素默认为rgba(0,0,0,0)，所以转成jpg就变成rgba(0,0,0,1)了，也就是透明背景会变成了黑色。解决办法就是绘制之前在canvas上铺一层白色的底色
                context.fillStyle = "#fff";
                context.fillRect(0, 0, canvas.width, canvas.height);
                //如果图片像素大于100万则使用瓦片绘制
                let count;
                if ((count = (width * height) / 1000000) > 1) {
                    count = ~~(Math.sqrt(count) + 1); //计算要分成多少瓦片，~~在这里表示取整
                    //计算每块瓦片的宽高
                    let nw = ~~(width / count);
                    let nh = ~~(height / count);
                    tCanvas.width = nw;
                    tCanvas.height = nh;
                    for (let i = 0; i < count; i++) {
                        for (let j = 0; j < count; j++) {
                            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio,nh * ratio, 0, 0, nw,nh);
                            context.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                        }
                    }
                } else {
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                }


                /* drawImage画布绘制的方法。(0,0)表示以Canvas画布左上角为起点，400，300是将图片按给定的像素进行缩小。
                 如果不指定缩小的像素图片将以图片原始大小进行绘制，图片像素如果大于画布将会从左上角开始按画布大小部分绘制图片，最后的图片就是张局部图。 */
                //context.drawImage(img, 0, 0, canvas.width, canvas.height)

                // 将绘制完成的图片重新转化为base64编码，file.file.type为图片类型，0.92为默认压缩质量
                file.content = canvas.toDataURL(file.file.type, 0.92)
                // 转为base64显示---测试
                const fileTemp = dataURLtoFile(file.content, file.file.name)
                file.file = fileTemp;
                console.log("压缩后的照片：",file.file);
                resolve(file)
            }
        } else {
            resolve(file)
        }
    })
}

/**
 * 将base64转换为File
 * @param {*} dataurl
 * @param {*} filename
 */
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(',')
    var mime = arr[0].match(/:(.*?);/)[1]
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {type: mime})
}

/**
 * 上传照片
 * @param url
 * @param formdata
 * @returns {Promise}
 */
export function uploadImage(url, formdata, uploader) {
    return new Promise((resolve, reject) => {
        // 设置请求头
        const config = {
            headers: {'Content-Type': 'multipart/form-data'},
            onUploadProgress: progressEvent => {
                let percent= ( (progressEvent.loaded / progressEvent.total * 100) === 100 ? 99 : (progressEvent.loaded / progressEvent.total * 100)) | 0
                //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
                uploader.onProgress({percent:percent})
            }
        };
        $axios.post(url, formdata, config).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err);
        })
    })
}
