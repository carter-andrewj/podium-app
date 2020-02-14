import { observable, computed } from 'mobx';

import { Map } from 'immutable';

import Entity from './entity';
import TokenIndex from './indexes/tokenIndex';

import { placeholder } from './utils';



class Domain extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Domain"

	}



// GETTERS

	@computed
	@placeholder(TokenIndex)
	get tokenIndex() {
		return this.nation.get("tokenindex", this.attributes.get("Tokens"))
	}

	@computed
	@placeholder({})
	get tokens() {
		return this.tokenIndex.reduce(
			(result, address) => {
				let token = this.nation.get("token", address)
				if (token) result[token.name] = token
				return result
			},
			{}
		)
	}


}

export default Domain;