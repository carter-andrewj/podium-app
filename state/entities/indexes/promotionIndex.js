import { observable, computed } from 'mobx';

import Index from './index';


class PromotionIndex extends Index {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Promotion"

	}



// GETTERS




}

export default PromotionIndex;