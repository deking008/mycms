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
    }

     /**
     * 用户首页
     * @returns {*}
     */

     async indexAction(){

     	return this.display();
     }
}