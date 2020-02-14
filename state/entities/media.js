import { observable, computed } from 'mobx';

import Entity from './entity';

import { placeholder } from './utils';



class Media extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Media"

	}



// GETTERS

	@computed
	@placeholder()
	get mediaType() {
		return this.state.get("type")
	}

	@computed
	@placeholder()
	get uri() {
		return `${this.nation.mediaURL.get()}${this.address}.${this.mediaType}`
	}


}

export default Media;