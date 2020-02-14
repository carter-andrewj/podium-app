import { observable, computed } from 'mobx';

import Index from './index';



class TransactionIndex extends Index {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Transactions"

	}



// GETTERS




}

export default TransactionIndex;