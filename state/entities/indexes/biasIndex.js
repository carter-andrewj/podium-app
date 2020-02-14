import { observable, computed } from 'mobx';

import Index from './index';


class BiasIndex extends Index {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Bias"

	}



// GETTERS




}

export default BiasIndex;