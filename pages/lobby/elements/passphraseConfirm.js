import React from 'react';
import { inject, observer } from 'mobx-react';

import LobbyInput from './input';



@inject("store")
@observer
class InputPassphraseConfirm extends LobbyInput {

	constructor() {

		super()

		// Settings
		this.name = "confirm"
		this.placeholder = "confirm passphrase"
		this.secure = true
		this.caption = {
			empty: "just to be safe",
			validating: "validating",
			valid: "passphrases match"
		}

	}


	get passphrase() {
		return this.props.data.get("passphrase").get("value")
	}


	get isVisible() {
		return this.props.mode !== "signin" &&
			(this.props.current === this.props.index ||
			 this.props.focus === this.props.index)
	}


	async validate(confirm) {

		// Ensure an identity has been entered, if performing full validation
		if (confirm !== this.passphrase)
			throw "passphrases do not match"

		// Return valid
		return true

	}


}

export default InputPassphraseConfirm;