import { observable, computed } from 'mobx';

import Index from './index';


class FollowerIndex extends Index {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Followers"

	}



// GETTERS




}

export default FollowerIndex;