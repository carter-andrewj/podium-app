import { observable, computed } from 'mobx';

import Index from './index';


class FollowingIndex extends Index {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Following"

	}



// GETTERS




}

export default FollowingIndex;