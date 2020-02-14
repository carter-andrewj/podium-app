import { observable, computed } from 'mobx';

import Entity from './entity';

import { placeholder } from './utils';



class Token extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Token"

	}



// GETTERS

	@computed
	@placeholder("...")
	get name() {
		return this.state.get("designation").name
	}

	@computed
	@placeholder("")
	get symbol() {
		return this.state.get("designation").symbol
	}

	@computed
	@placeholder(new Map())
	get pricing() {
		return this.state.get("pricing")
	}


}

export default Token;