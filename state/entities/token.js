import { observable, computed } from 'mobx';

import Entity from './entity';



class Token extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Token"
		this.state = observable.Map()

	}



// GETTERS




}

export default Token;