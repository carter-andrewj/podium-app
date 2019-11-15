import React from 'react';
import { action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';

import LobbyInput from './input';



@inject("store")
@observer
class InputPassphrase extends LobbyInput {

	constructor() {

		super()

		// Settings
		this.name = "passphrase"
		this.placeholder = "passphrase"
		this.secure = true
		this.caption = {
			empty: "choose a passphrase",
			validating: "validating passphrase",
			valid: "passphrase accepted"
		}

	}


	get isVisible() {
		return super.isVisible && this.props.current < 6
	}


	get returnKeyType() {
		// NOTE - This does not currently take effect due to a bug
		// in react native itself that caches the returnKeyType
		// on initial render of a TextInput, but does not update
		// it thereafter.
		return (this.isFocus && this.props.mode === "signin") ? "go" : "next"
	}


	get confirm() {
		return this.props.data.get("confirm")
	}


	get next() {
		// Always proceed to passphrase confirmation unless
		// both are already valid
		if (this.value && this.value === this.confirm.get("value")) {
			return super.next
		} else {
			return this.props.index + 1
		}
	}



	@action.bound
	clearConfirm() {
		this.confirm.set("value", undefined)
		this.confirm.set("valid", false)
		this.confirm.set("validating", false)
		this.confirm.set("error", undefined)
	}


	sanitize(passphrase) {

		// Reset the password confirmation whenever this value changes
		if (passphrase !== this.confirm.get("value")) this.clearConfirm()

		// Return passphrase unchanged
		return passphrase

	}


	async validate(passphrase) {

		// Ensure username is greater than the minimum length
		if (passphrase.length < this.validation.minLength)
			throw `passphrase must be at least ${this.validation.minLength} characters`

		// Ensure username is no greater than the maximum length
		if (passphrase.length > this.validation.maxLength)
			throw `passphrase cannot be longer than ${this.validation.maxLength} characters`

		// Return valid
		return true

	}


}

export default InputPassphrase;