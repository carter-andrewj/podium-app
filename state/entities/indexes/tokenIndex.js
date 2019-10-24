import { observable, computed } from 'mobx';

import Entity from '../entity';



class TokenIndex extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Tokens"
		this.state = observable.array()

	}



// GETTERS




}

export default TokenIndex;