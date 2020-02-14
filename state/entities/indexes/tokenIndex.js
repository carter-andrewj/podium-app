import { observable, computed } from 'mobx';

import Index from './index';



class TokenIndex extends Index {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Tokens"

	}



// GETTERS




}

export default TokenIndex;