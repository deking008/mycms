'use strict';

import Base from './base.js';
import fs from 'fs';
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    init(http) {
        super.init(http);
        this.db = this.model("member");
        this.tactive = "user";
        this.pagenum = 10;
    }

    /**
     * 用户首页
     * @returns {*}
     */

    async indexAction() {
        let map = { 'status': ['>', -1] }

        let data = await this.db.where(map).page(this.get('page'), this.pagenum).order('id DESC').countSelect();
        let Pages = think.adapter("pages", "page"); //加载名为 dot 的 Template Adapter
        let pages = new Pages(this.http); //实例化 Adapter
        let page = pages.pages(data);
        // for(let v of data.data){
        //     console.log(await this.model("member_group").getgroup({groupid:v.groupid}));
        // }
        this.assign('pagerData', page); //分页展示使用
        this.assign('list', data.data);
        this.meta_title = "用户列表";
        return this.display();
    }
    async adduserAction() {
        if (this.isPost()) {
            let data = this.post();
            if (data.password != data.repassword) {
                return this.fail("两次输入密码不一致");
            }
            data.password = encryptPassword(data.password);
            data.reg_time = new Date().getTime();
            if (data.vip == 1) {
                data.overduedate = new Date(data.overduedate).getTime();
            } else {
                data.overduedate = think.isEmpty(data.overduedate) ? 0 : data.overduedate;
            }
            data.status = 1;
            let res = await this.db.add(data);
            if (res) {
                //添加角色
                if (data.is_admin == 1) {
                    await this.model("auth_user_role").add({ user_id: res, role_id: data.role_id });
                }
                return this.success({ name: "添加成功！" });
            } else {
                return this.fail("添加失败!")
            }

        } else {
            this.meta_title = "添加用户";
            return this.display();
        }
    }

    async userdelAction(){
        let id = this.param("ids");
        let res;
        let b;
        // 判断是否是管理员，如果是不能删除;
        if(await this.isadmin(id)){
            return this.fail("不能删管理员");
        }else{
            //res = await this.db.where({id: id}).delete();
            //逻辑删除
            res = await this.db.where({id:["IN",id]}).update({status:-1});
            if(res){
                 return this.success({name:"删除成功！"});
            }else{
                return this.fail("删除失败！");
            }
        }
    }
}
