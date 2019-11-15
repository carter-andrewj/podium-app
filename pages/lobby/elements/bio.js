import React from 'react';
import { inject, observer } from 'mobx-react';

import LobbyInput from './input'



@inject("store")
@observer
class InputBio extends LobbyInput {

	constructor() {

		super()

		// Settings
		this.name = "about"
		this.placeholder = "I am..."
		this.capitalize = "sentences"
		this.skippable = true
		this.multiline = true
		this.caption = {
			...this.caption,
			empty: "tell us about yourself",
		}
		
	}

	get isVisible() {
		return super.isVisible && this.props.current < 9 &&
			this.props.focus !== 7
	}


	async validate(about) {

		// Allow empty bios
		if (!about) return true

		// Ensure bio is no longer than the maximum length
		if (about.length > this.validation.maxLength)
			throw `Bio cannot be longer than ${this.validation.maxLength} characters`

		// Otherwise the alias is valid
		return true

	}


}

export default InputBio;