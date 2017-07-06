export default class extends think.controller.base {

    async __before() {
        this.setup = await this.model("setup").getset();
    }

    async signinAction() {
        let is_login = await this.islogin();
        if (this.isPost()) {
            //todo
            //验证码
            if(1==this.setup.GEETEST_IS_ADMLOGIN){
                let Geetest = think.service("geetest"); //加载 commoon 模块下的 geetset service
                let geetest = new Geetest();
                let res = await geetest.validate(this.post());
                if("success" != res.status){
                    this.http.error = new Error("验证码不正确");
                    return think.statusAction(702, this.http);
                }
            }
            
            let username = this.post('username');
            let password = this.post('password');
            password = encryptPassword(password);

            let res = await this.model('member').signin(username,password,this.ip(),1,1);
            if(0<res.uid){
            	await this.session('userInfo',res);
            	this.redirect('/admin/index');
            } else {
            	//登录失败
                let fail;
                switch(res) {
                    case -1: fail = '用户不存在或被禁用'; break; //系统级别禁用
                    case -2: fail = '密码错误'; break;
                    case -3: fail = '您无权登陆后台！'; break;
                    default: fail = '未知错误';  // 0-接口参数错误（调试阶段使用）
                }
                this.http.error = new Error(fail);
                return think.statusAction(702, this.http);
            }
        } else {

            if (is_login) {
                this.redirect('/admin/index');
            } else {
                return this.display();
            }
        }


    }

    async logoutAction() {
        //退出登录
        let is_login = await this.islogin();
        if (is_login) {
            await this.session('userInfo', null);
            this.redirect('/admin/public/signin');
        } else {
            this.redirect('/admin/public/signin');
        }

    }

    async islogin() {
        let user = await this.session('userInfo');
        let res = think.isEmpty(user) ? false : true;
        return res;
    }
    //验证码
    async geetestAction(){
        let Geetest = think.service("geetest"); //加载 commoon 模块下的 geetset service
        let geetest = new Geetest();
        if(this.isPost()){
            let post =this.post();
            //console.log(post);
            let res = await geetest.validate(post);
            return this.json(res);
        }else {
            let res = await geetest.register(this.get('type'));
            //console.log(res);
            return this.json(res);
        }

    }
}
