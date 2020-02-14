import { observable, computed } from 'mobx';

import Index from './index';


class ReactionIndex extends Index {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Reactions"

	}



// GETTERS




}

export default ReactionIndex;