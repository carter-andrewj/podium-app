import { observable, computed } from 'mobx';

import Entity from '../entity';


class OwnableIndex extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Ownables"
		this.state = observable.array()

	}



// GETTERS




}

export default OwnableIndex;