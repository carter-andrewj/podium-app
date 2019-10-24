import { observable, computed } from 'mobx';

import Entity from './entity';



class Media extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Media"
		this.state = observable.Array()

	}



// GETTERS




}

export default Media;