'use strict';
/**
 * template config
 */
export default {
    type: 'nunjucks',
    content_type: 'text/html',
    file_ext: '.html',
    file_depr: '_',
    root_path: think.ROOT_PATH + '/view',
    adapter: {
        nunjucks: {
            prerender: (nunjucks, env) => {
            	/**
                 * 获取用户组
                 */
                env.addFilter('get_member_group',async(groupid,callback)=>{
                    let data = await think.model("member_group",think.config("db")).getgroup({groupid:groupid});
                    callback(null,data[0]);
                },true);

                /**
                 * moment
                 * YYYY-MM-DD HH:mm:ss
                 * lll
                 */
                env.addFilter("moment",function (time,config) {
                    let moment = require('moment');
                    moment.locale('zh-cn');
                    if(think.isEmpty(config)){
                        return moment(time).fromNow();
                    }else {
                        return moment(time).format(config);
                    }
                })

                /**
                 * 数字转ip
                 */
                env.addFilter("int2ip",function (int) {
                    return _int2iP(int);
                })

                env.addFilter("in_Array", function (str, arr) {
                    arr= arr||0;
                    if (!think.isArray(arr)) {
                        if(think.isNumber(arr)){
                            arr = "'"+arr+"'";
                        }
                        arr = arr.split(",");
                    }
                    //console.log(arr);
                    return in_array(str, arr);
                })

                /**
                 *分析枚举类型配置值 格式 a:名称1,b:名称2
                 */
                env.addFilter("parse_config_attr", function (str) {
                    return parse_config_attr(str)
                })

            }
        }
    }
};
