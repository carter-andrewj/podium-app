import React from 'react';
import { inject, observer } from 'mobx-react';

import LobbyInput from './input'



@inject("store")
@observer
class InputDisplayName extends LobbyInput {

	constructor() {

		super()

		// Settings
		this.name = "name"
		this.placeholder = "display name"
		this.capitalize = "words"
		this.skippable = true
		this.caption = {
			...this.caption,
			empty: "what should we call you?",
		}
		
	}

	get isVisible() {
		return super.isVisible && this.props.current < 9
	}


	async validate(name) {

		// Allow empty names
		if (!name) return true

		// Ensure name is no longer than the maximum length
		if (name.length > this.validation.maxLength)
			throw `Name cannot be longer than ${this.validation.maxLength} characters`

		// Otherwise the alias is valid
		return true

	}


}

export default InputDisplayName;