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
        this.db=this.model("member");
        this.tactive = "user";
        this.pagenum = 5;
    }

     /**
     * 用户首页
     * @returns {*}
     */
     
     async indexAction(){
     	let map = {'status': ['>', -1]}
         
        let data = await this.db.where(map).page(this.get('page'),this.pagenum).order('id DESC').countSelect();
        let Pages = think.adapter("pages", "page"); //加载名为 dot 的 Template Adapter
        let pages = new Pages(this.http); //实例化 Adapter
        let page = pages.pages(data);
        // for(let v of data.data){
        //     console.log(await this.model("member_group").getgroup({groupid:v.groupid}));
        // }
        this.assign('pagerData', page); //分页展示使用
        this.assign('list', data.data);
        this.meta_title="用户列表";
     	return this.display();
     }
     async changPageNum(){
     	
     }
}