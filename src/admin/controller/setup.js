'use strict';
import Base from './base.js';
export default class extends Base {
    init(http) {
        super.init(http);
        this.db = this.model('setup');
        this.tactive = "setup";
    }

    //加载配置
    async loadsetup(){
        const fs = require('fs');
        let setup = await this.model("setup").lists();
        let path1 = think.getPath("common", "config");
        if(think.isDir(think.ROOT_PATH+'/src')){
            let data = "export default"+JSON.stringify(setup);
            fs.writeFileSync(think.ROOT_PATH+'/src/common/config/setup.js', data);
        }
        let data1 = "exports.__esModule = true;exports.default ="+JSON.stringify(setup);
        fs.writeFileSync(path1+'/setup.js', data1);
    }

    async indexAction() {
        let id = this.get('id') || 1;
        let type = this.setup.CONFIG_GROUP_LIST;

        this.assign({
            'meta_title': type[id] + "设置",
            'id': id
        });

        let list = await this.model("setup").where({ 'status': 1, 'group': id }).field('id,name,title,extra,value,remark,type').order('sort').select();
        if (list) {
            this.assign('list', list);
        }

        this.meta_title = '网站配置';
        return this.display();
    }

    async saveAction(){
        let post = this.post();
        for(let v in post){
            this.db.where({name: v}).update({value: post[v]});
        }
        think.cache("setup", null);
        await this.loadsetup();
        this.json(1)
    }

    async groupAction(){
        let map = {};
        map.status = 1;
        let data = await this.db.where(map).page(this.get('page'), 10).order('id DESC').countSelect();
        let Pages = think.adapter("pages", "page"); //加载名为 dot 的 Template Adapter
        let pages = new Pages(this.http); //实例化 Adapter
        let page = pages.pages(data);
        this.assign('pagerData', page); //分页展示使用
        this.assign('list', data.data);


        this.meta_title = '配置管理';
        return this.display();
    }
}
