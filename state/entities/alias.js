import { observable, computed } from 'mobx';

import Entity from './entity';



class Alias extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Alias"
		this.state = observable.map()

	}



// GETTERS

	@computed
	get label() {
		return this.id ? `@${this.id}` : super.label
	}

	@computed
	get id() {
		return this.state.get("id")
	}

	@computed
	get owner() {
		return this.state.get("owner")
	}


}

export default Alias;