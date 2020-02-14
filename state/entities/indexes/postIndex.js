import { observable, computed } from 'mobx';

import Index from './index';



class PostIndex extends Index {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Posts"


	}



// GETTERS





}

export default PostIndex;