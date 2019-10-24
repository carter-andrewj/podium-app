import { observable, computed } from 'mobx';

import Entity from './entity';



class Domain extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Domain"
		this.state = observable.map()

	}



// GETTERS




}

export default Domain;