import { observable, computed } from 'mobx';

import Entity from './entity';

import { placeholder } from './utils';



class Profile extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.type = "Profile"

		// Methods
		this.update = this.update.bind(this)

	}




// GETTERS

	@computed
	@placeholder("...")
	get name() {
		return this.state.get("displayName") || this.parent.placeholderName
	}

	@computed
	@placeholder("")
	get about() {
		return this.state.get("about")
	}

	@computed
	@placeholder(undefined)
	get avatar() {
		const address = this.state.get("picture")
		if (address) {
			const type = this.state.get("pictureType")
			return `${this.nation.mediaURL.get()}${address}.${type}`
		} else {
			return undefined
		}
	}



// ACTIONS

	update(newProfile) {
		return this.act("Update", "Updating Profile...", newProfile)
	}


}

export default Profile;