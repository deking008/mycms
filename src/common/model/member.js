export default class extends think.model.base {


	async signin(username, password, ip, type=1,login=0){
		let map = {};
		switch(type){
			case 1:
			    map.username = username;
			    break;
			case 2:
			    map.email = username;
			    break;
			case 3:
			    map.mobile = username;
			    break;
			case 4:
			    map.id = username;
			    break;
			case 5:
			    map = {
			    	username:username,
                    email:username,
                    mobile:username,
                    _logic: "OR"
			    };
			    break;
			default:
			    return 0; //参数错误
		}



		let user = await this.where(map).find();
		if(!think.isEmpty(user) && 1 == user.status) {
			if(login == 1){
				if(0 == user.is_admin){
					return -3;//不是管理用户，不能登陆后台
				}
			}
			/* 验证用户密码 */
			if(password === user.password){

				let userInfo = {
					'uid':  user.id,
					'username': user.username,
					'last_login_time': user.last_login_time,
				}

				return userInfo; //登录成功，返回用户信息

			}
			else{
				return -1; //用户不存在或被禁用
			}
		}
	}
}