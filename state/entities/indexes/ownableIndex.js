import { observable, computed } from 'mobx';

import Index from './index';


class OwnableIndex extends Index {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Ownables"

	}



// GETTERS




}

export default OwnableIndex;