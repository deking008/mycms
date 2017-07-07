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
                env.addFilter('get_member_group',async (groupid,callback)=>{
                    let data = await think.model("member_group",think.config("db")).getgroup({groupid:groupid});
                    callback(null,data[0]);
                },true);

        	}
        	

        }
    }
};
