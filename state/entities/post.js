import { observable, computed } from 'mobx';

import Entity from './entity';



class Post extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Post"
		this.state = observable.map()

	}



// GETTERS

	@computed
	get origin() {
		return this.state.get("origin")
	}

	@computed
	get parent() {
		return this.state.get("parent")
	} 




}

export default Post;