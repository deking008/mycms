'use strict';

export default class extends think.controller.base {
    init(http) {
            super.init(http);
        }
    /**
     * some base method in here
     */
    async __before() {
        let is_login = await this.islogin();
        if (!is_login) {
           return this.redirect('/admin/public/signin');
        }
        this.user = await this.session('userInfo');
        this.assign("userinfo", this.user);
        
        this.setup = await this.model("setup").getset();

        this.adminmenu = await this.model('menu').getallmenu(this.user.uid,true);
        
        this.assign("setup", this.setup);

    }

    /**
     * 判断是否登录
     * @returns {boolean}
     */
    async islogin() {
        //判断是否登录
        let user = await this.session('userInfo');
        let res = think.isEmpty(user) ? false : user.uid;
        return res;

    }

}
