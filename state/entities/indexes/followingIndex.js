import { observable, computed } from 'mobx';

import Entity from '../entity';


class FollowingIndex extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Following"
		this.state = observable.array()

	}



// GETTERS




}

export default FollowingIndex;