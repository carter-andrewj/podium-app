import { observable, computed } from 'mobx';

import Entity from '../entity';



class PostIndex extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Post"
		this.state = observable.array()

	}



// GETTERS





}

export default PostIndex;