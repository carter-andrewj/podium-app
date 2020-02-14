import { observable, computed } from 'mobx';

import Entity from './entity';

import { placeholder } from './utils';




class Alias extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Alias"
	}



// GETTERS
	
	@computed
	get alias() {
		return `@${this.id}`
	}

	@computed
	@placeholder("...")
	get id() {
		return this.state.get("id")
	}
	
	@computed
	@placeholder()
	get owner() {
		return this.state.get("owner", false)
	}


}

export default Alias;