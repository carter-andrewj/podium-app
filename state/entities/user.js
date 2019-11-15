import { observable, computed } from 'mobx';

import Entity from './entity';



class User extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "User"
		this.state = observable.map()

	}


// ATTRIBUTES

	@computed
	get profile() {
		return this.session.entities.get(this.attributes.get("Profile"))
	}

	@computed
	get aliasEntity() {
		return this.session.entities.get(this.attributes.get("Alias"))
	}



// GETTERS

	@computed
	get alias() {
		return this.aliasEntity.label
	}

	@computed
	get displayName() {
		return this.profile.displayName
	}

	@computed
	get about() {
		return this.profile.about
	}


// ACTIONS

	signOut() {
		return this.act("signOut")
	}



}

export default User;