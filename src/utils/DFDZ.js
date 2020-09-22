/**
 * @description
 * @Version Created by Stephen on 2020/1/2.
 * @Author Stephen
 * @license dongfangdianzi
 */
import helper from './helper';
import lodash from 'lodash';
import moment from 'moment';

/**
 * @type {{helper, moment, lodash, }}
 */

const DFDZ = {
    //公共方法
    helper,

    //时间
    moment,

    // 说明文档:http://www.css88.com/doc/lodash/
    lodash: lodash,
};

export default DFDZ;
