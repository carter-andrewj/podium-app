import React from 'react';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';

import LobbyInput from './input'



@inject("store")
@observer
class InputAlias extends LobbyInput {

	constructor() {

		super()

		// Settings
		this.name = "alias"
		this.placeholder = "@alias"
		this.caption = {
			empty: "create a unique alias",
			validating: "checking availability",
			valid: "alias available"
		}

	}

	get isVisible() {
		return super.isVisible && this.props.current < 6
	}

	@computed
	get format() {
		return this.value ? `@${this.value}` : undefined
	}


	sanitize(alias) {

		// Ignore empty values
		if (!alias) return undefined

		// Process alias
		let value = alias.trim().replace(this.validation.chars, "")

		// Remove illegal characters/whitespace and add markup
		if (value && value.length > 0) {
			return `@${value}`
		} else {
			return undefined
		}

	}


	async validate(alias) {

		// Skip if value has not changed
		if (alias && alias === this.lastValue) return true

		// Ensure alias is no shorter than the minimum length
		if (!alias || alias.length < this.validation.minLength)
			throw `Alias must have at least ${this.validation.minLength} ` +
				  `character${this.validation.minLength === 1 ? "" : "s"}`

		// Ensure alias is no longer than the maximum length
		if (alias.length > this.validation.maxLength)
			throw `Alias cannot be longer than ${this.validation.maxLength} characters`

		// Stop validation here for sign-in
		if (this.props.mode === "signin") return true

		// Ensure alias is not already owned
		let current = await this.nation
			.find(alias.substring(1))
			.catch(this.setInvalid)

		// Ignore if alias has changed during search
		if (this.value !== alias) return false

		// Check if entity is already taken
		if (current && current.length > 0) throw "Alias Unavailable"

		// Remember value
		this.lastValue = alias

		// Otherwise the alias is valid
		return true

	}


}

export default InputAlias;