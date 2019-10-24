import { observable, computed } from 'mobx';

import Entity from '../entity';


class FollowerIndex extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Followers"
		this.state = observable.array()

	}



// GETTERS




}

export default FollowerIndex;