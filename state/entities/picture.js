import { observable, computed } from 'mobx';

import Media from './media';



class Picture extends Media {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Picture"

	}




}

export default Picture;