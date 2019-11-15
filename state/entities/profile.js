import { observable, computed } from 'mobx';

import Entity from './entity';



class Profile extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Profile"
		this.state = observable.map()

		// Methods
		this.update = this.update.bind(this)

	}




// GETTERS

	@computed
	get displayName() {
		return this.state.get("name")
	}

	@computed
	get about() {
		return this.state.get("about")
	}



// ACTIONS

	update(newProfile) {
		console.log("profile", newProfile)
		return this.act("Update", "Updating Profile...", newProfile)
	}


}

export default Profile;