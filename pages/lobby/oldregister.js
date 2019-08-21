import React from 'react';
import Component from '../../utils/component';
import { Text, View, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react';
import * as ImagePicker from 'expo-image-picker';

import { fromJS } from 'immutable';

import { RoundButton, RoundStatefulButton } from '../../components/buttons';

import styles from '../../styles/styles';



const validationConfig = {
	identity: {
		maxLength: 20,
		chars: /[^A-Z0-9_-]/i
	},
	passphrase: {
		minLength: 7,
		maxLength: 40
	},
	delay: 1000
}



@inject("store")
@observer
class Register extends Component {

	constructor() {
		super()
		
		this.state = {

			step: 1,
			validating: false,

			profile: {
				identity: {
					value: "",
					error: false,
					validating: false,
					validating: false,
					placeholder: true
				},
				passphrase: {
					value: "",
					confirmValue: "",
					error: false,
					validating: false,
					placeholder: true,
					confirmPlaceholder: true
				},
				picture: {
					uri: null,
					value: "",
					extension: ""
				},
				name: "",
				bio: "",
			}

		}

		this.identity = null;
		this.passphrase = null;
		this.passphraseConfirm = null;

		this.selectIdentity = this.selectIdentity.bind(this)
		this.selectPassphrase = this.selectPassphrase.bind(this)
		this.selectPassphraseConfirm = this.selectPassphraseConfirm.bind(this)

		this.deselectIdentity = this.deselectIdentity.bind(this)
		this.deselectPassphrase = this.deselectPassphrase.bind(this)
		this.deselectPassphraseConfirm = this.deselectPassphraseConfirm.bind(this)

		this.typeIdentity = this.typeIdentity.bind(this)
		this.typePassphrase = this.typePassphrase.bind(this)
		this.typePassphraseConfirm = this.typePassphraseConfirm.bind(this)
		this.typeName = this.typeName.bind(this)
		this.typeBio = this.typeBio.bind(this)

		this.checkIdentity = null;
		this.checkPassphrase = null;
		this.checkPassphraseConfirm = null;

		this.validateIdentity = this.validateIdentity.bind(this)
		this.validatePassphrase = this.validatePassphrase.bind(this)
		this.validatePassphraseConfirm = this.validatePassphrase.bind(this)
		this.validateStepOne = this.validateStepOne.bind(this)

		this.toStep = this.toStep.bind(this)
		this.toStepTwo = this.toStepTwo.bind(this)

		this.register = this.register.bind(this)

	}




// IDENTITY ENTRY

	selectIdentity() {
		this.updateState(state => state
			.setIn(["profile", "identity", "placeholder"], false)
		)
	}

	deselectIdentity() {
		this.updateState(
			state => state
				.setIn(["profile", "identity", "placeholder"], false),
			() => this.validateIdentity(true)
		)
	}

	typeIdentity(id) {
		const identity = id.trim()
			.replace(validationConfig.identity.chars, "")
		this.updateState(
			state => state
				.setIn(["profile", "identity", "value"], identity)
				.setIn(["profile", "identity", "error"], undefined)
				.setIn(["profile", "identity", "validating"], true)
				.setIn(["profile", "identity", "validated"], undefined),
			() => this.validateIdentity()
		)
	}

	validateIdentity(forced=false) {
		clearTimeout(this.checkIdentity)
		return new Promise((resolve, reject) => {

			// Get id
			let identity = this.getState("profile", "identity", "value")

			// Ignore empty IDs
			if (identity.length === 0 && !forced) {
				resolve()
			} else {
				this.checkIdentity = setTimeout(
					() => {

						let error;

						// Ensure an identity has been entered, if performing full validation
						if (identity.length === 0) {
							error = "Please enter an Identity"

						// Ensure username is no greater than the maximum length
						} else if (identity.length >= validationConfig.identity.maxLength) {
							error = "ID cannot be longer than " +
								`${validationConfig.identity.maxLength} characters`
						
						}

						// Check if an error has been found
						if (error) {
							this.updateState(
								state => state
									.setIn(["profile", "identity", "validated"], false)
									.setIn(["profile", "identity", "error"], error),
								() => resolve(false)
							)

						// Ensure username is not already taken
						} else {

							// Create task to check identity
							const task = this.props.store.api.isUser(identity, resolve, reject)
							
							// Update state
							this.updateState(
								state => state
									.setIn(["profile", "identity", "task"], task)
									.setIn(["profile", "identity", "validating"], true),
								() => {
									task.subscribe()
										.then(result => {
											if (this.getState("profile", "identity", "value") !== identity) {
												resolve()
											} else if (result) {
												this.updateState(
													state => state
														.setIn(["profile", "identity", "validating"], false)
														.setIn(["profile", "identity", "validated"], false)
														.setIn(["profile", "identity", "error"], "Identity Unavailable"),
													() => resolve(false)
												)
											} else {
												this.updateState(
													state => state
														.setIn(["profile", "identity", "validating"], false)
														.setIn(["profile", "identity", "validated"], true),
													() => resolve(true)
												)
											}
										})
										.catch(reject)
								}
							)

						}

					},
					forced ? 0 : validationConfig.delay
				)
			}
		})
	}




// PASSWORD ENTRY

	selectPassphrase() {
		this.updateState(state => state
			.setIn(["profile", "passphrase", "placeholder"], false)
		)
	}

	deselectPassphrase() {
		this.updateState(
			state => state
				.setIn(["profile", "passphrase", "placeholder"], true),
			() => this.validatePassphrase(true)
		)
	}

	typePassphrase(passphrase) {
		this.updateState(
			state => state
				.setIn(["profile", "passphrase", "value"], passphrase)
				.setIn(["profile", "passphrase", "error"], undefined)
				.setIn(["profile", "passphrase", "validated"], undefined),
			() => this.validatePassphrase()
		)
	}

	validatePassphrase(forced=false) {
		clearTimeout(this.checkPassphrase)
		return new Promise((resolve, reject) => {

			// Get passphrase
			const passphrase = this.getState("profile", "passphrase", "value")

			// Don't flag empty passphrases unless forced
			if (passphrase.length === 0 && !forced) {
				resolve()
			} else {

				this.checkPassphrase = setTimeout(
					() => {

						const minLength = validationConfig.passphrase.minLength
						const maxLength = validationConfig.passphrase.maxLength

						// Validate
						let error;
						if (passphrase.length === 0) {
							error = "Please enter a Passphrase"
						} else if (passphrase.length < minLength) {
							error = `Passphrase must have at least ${minLength} characters`
						} else if (passphrase.length > maxLength) {
							error = `Passphrase cannot have more than ${maxLength} characters`
						}

						// Report errors
						if (error) {
							this.updateState(
								state => state
									.setIn(["profile", "passphrase", "error"], error)
									.setIn(["profile", "passphrase", "validated"], false),
								() => resolve(false)
							)
						} else {
							this.updateState(
								state => state
									.setIn(["profile", "passphrase", "error"], undefined)
									.setIn(["profile", "passphrase", "validated"], true),
								() => this.validatePassphraseConfirm(true)
									.then(resolve)
									.catch(reject)
							)
						}

					},
					forced ? 0 : validationConfig.delay
				)
				
			}
		})
	}




// PASSWORD CONFIRMATION

	selectPassphraseConfirm() {

		// Switch to passphrase entry if passphrase is currently empty
		if (this.getState("profile", "passphrase", "value").length === 0) {
			this.passphrase.focus()

		// Otherwise remove placeholder
		} else {
			this.updateState(state => state
				.setIn(["profile", "passphrase", "confirmPlaceholder"], false)
			)
		}

	}

	deselectPassphraseConfirm() {
		this.updateState(
			state => state
				.setIn(["profile", "passphrase", "confirmPlaceholder"], true),
			() => this.validatePassphraseConfirm(true)
		)
	}

	typePassphraseConfirm(passphraseConfirm) {
		this.updateState(
			state => state
				.setIn(["profile", "passphrase", "confirmValue"], passphraseConfirm)
				.setIn(["profile", "passphrase", "error"], false)
				.setIn(["profile", "passphrase", "validated"], undefined),
			() => this.validatePassphraseConfirm()
		)
	}

	validatePassphraseConfirm(forced=false) {
		clearTimeout(this.checkPassphraseConfirm)
		return new Promise((resolve, reject) => {

			// Get current confirmation value
			const confirm = this.getState("profile", "passphrase", "confirmValue")

			// Get current passphrase validation state
			const current = this.getState("profile", "passphrase", "validated")

			console.log("confirm", confirm, current)

			// Ignore unless existing passphrase is valid
			if (!current) {
				resolve()

			// And ignore if confirm value is empty, unless forced
			} else if (confirm.length === 0 && !forced) {
				resolve()

			} else {
				this.checkPassphraseConfirm = setTimeout(
					() => {

						// Get current passphrase
						const passphrase = this.getState("profile", "passphrase", "value")

						let error;

						console.log("compare", confirm, passphrase)

						// Ensure confirm value has been entered
						if (confirm.length === 0) {
							error = "Please confirm your Passphrase"
						
						// Ensure passphrases match
						} else if (passphrase !== confirm) {
							error = "Passphrases do not match"
						}

						// Check if an error was found
						if (error) {
							this.updateState(
								state => state
									.setIn(["profile", "passphrase", "validated"], false)
									.setIn(["profile", "passphrase", "error"], error),
								() => resolve(false)
							)
						} else {
							this.updateState(
								state => state
									.setIn(["profile", "passphrase", "validated"], true)
									.setIn(["profile", "passphrase", "error"], undefined),
								() => resolve(true)
							)
						}

					},
					forced ? 0 : validationConfig.delay
				)
			}

		})
	}




// TRANSITION STEPS

	toStep(x) {
		this.updateState(state => state.set("step", x))
	}




// TRANSITION TO STEP TWO

	get stepOneValid() {
		const identity = this.getState("profile", "identity", "validated")
		const passphrase = this.getState("profile", "passphrase", "validated")
		if (identity === undefined || passphrase === undefined) {
			return undefined
		} else {
			return identity && passphrase
		}
	}


	validateStepOne() {
		return new Promise((resolve, reject) => {
			if (this.stepOneValid) {
				resolve(true)
			} else {
				Promise
					.all([
						this.validateIdentity(true),
						this.validatePassphrase(true)
					])
					.then(([identity, passphrase]) =>
						resolve(identity && passphrase)
					)
					.catch(reject)
			}
		})
	}


	toStepTwo() {
		this.validateStepOne()
			.then(result => {
				if (result) { this.toStep(2) }			
			})
			.catch(console.error)
	}



// PICTURE ENTRY

	selectPicture() {
		this.store
			.permitCamera()
			.then(permission => {
				if (permission) {
					ImagePicker
						.launchImageLibraryAsync({
							mediaTypes: "Images",
							allowsEditing: true,
							aspect: [1, 1],
							base64: true,
							exif: true
						})
						.then(({ cancelled, uri, base64 }) => {
							if (!cancelled) {
								this.updateState(state => state.setIn(
									["profile", "picture"],
									{
										uri: uri,
										value: base64
									}
								))
								console.log(uri, type)
							}
						})
				}
			})
			.catch(console.error)
	}




// NAME ENTRY

	typeName(name) {
		this.updateState(
			state => state.setIn(["profile", "name"], name)
		)
	}




// BIO ENTRY

	typeBio(bio) {
		this.updateState(
			state => state.setIn(["profile", "bio"], bio)
		)
	}





// SUBMIT

	register() {
		this.toStep(3)
		this.props.store.session
			.register(
				this.getState("profile", "identity", "value"),
				this.getState("profile", "passphrase", "value"),
				this.getState("profile", "name"),
				this.getState("profile", "bio"),
				this.getState("profile", "picture", "value"),
				this.getState("profile", "picture", "extention")
			)
	}




// RENDER

	render() {

		const step = this.getState("step")
		const profile = this.getState("profile").toJS()
		const task = this.getState("task")

		const title = <Text style={styles.text.heading}>
			New Account
		</Text>

		return <View style={styles.container}>
			
			{step === 1 ?
				<View style={styles.container}>

					<View style={styles.spacer} />
					{title}

					<TextInput

						style={styles.input.oneLine}
						autoCapitalize="none"
						
						ref={ref => { this.identity = ref }}
						placeholder={
							profile.identity.placeholder ? 
								"@Identity"
								: null
						}
						onChangeText={this.typeIdentity}
						value={
							profile.identity.value.length > 0 ?
								`@${profile.identity.value}` :
								""
						}

						onFocus={this.selectIdentity}
						onBlur={this.deselectIdentity}

						onSubmitEditing={() => {
							this.validateIdentity(true)
							this.passphrase.focus()
						}}
						returnKeyType="next"

					/>
					<View style={styles.input.caption}>
						{profile.identity.task ?
							profile.identity.task.error ?
								<Text style={styles.text.error}>
									{profile.identity.task.error}
								</Text>
								:
								profile.identity.task.complete ?
									profile.identity.task.output === false ?
										<Text style={styles.text.success}>
											Identity Available
										</Text>
										:
										<Text style={styles.text.error}>
											Identity Unavailable
										</Text>
									:
									<Text style={styles.text.info}>
										Checking Availability
									</Text>
							:
							profile.identity.error ?
								<Text style={styles.text.error}>
									{profile.identity.error}
								</Text>
								:
								profile.identity.validating ?
									<Text style={styles.text.info}>
										Validating...
									</Text>
									:
									<Text style={styles.text.info}>
										What do you want to call yourself?
									</Text>
						}
					</View>

					<TextInput

						style={styles.input.oneLine}
						autoCapitalize="none"
						secureTextEntry={true}
						
						ref={ref => { this.passphrase = ref }}
						placeholder={
							profile.passphrase.placeholder ?
								"passphrase"
								: null
						}
						value={profile.passphrase.value}
						onChangeText={this.typePassphrase}

						onFocus={this.selectPassphrase}
						onBlur={this.deselectPassphrase}

						onSubmitEditing={() => {
							this.validatePassphrase(true)
							this.passphraseConfirm.focus()
						}}
						returnKeyType="next"
						
					/>
					<TextInput

						style={styles.input.oneLine}
						autoCapitalize="none"
						secureTextEntry={true}
						
						ref={ref => { this.passphraseConfirm = ref }}
						placeholder={
							profile.passphrase.confirmPlaceholder ?
								"confirm passphrase"
								: null
						}
						onChangeText={this.typePassphraseConfirm}
						value={profile.passphrase.confirmValue}

						onFocus={this.selectPassphraseConfirm}
						onBlur={this.deselectPassphraseConfirm}

						onSubmitEditing={this.toStepTwo}
						returnKeyType="go"

					/>
					<View style={styles.input.caption}>
						{profile.passphrase.validated ?
							<Text style={styles.text.success}>
								Passphrase Accepted
							</Text>
							:
							profile.passphrase.error ?
								<Text style={styles.text.error}>
									{profile.passphrase.error}
								</Text>
								:
								<Text style={styles.text.info}>
									Choose a passphrase to
									protect your account
								</Text>
						}
					</View>

					<View style={styles.spacer} />
					<View style={[styles.containerRow, styles.lobby.buttonBox]}>
						<RoundButton
							onPress={this.props.toSignIn}
							icon="arrow-left"
						/>
						<RoundStatefulButton
							active={this.stepOneValid}
							onPress={this.toStepTwo}
							onPressNull={this.validateStepOne}
							iconOn="arrow-right"
							iconNull="arrow-right"
						/>
					</View>
					<View style={styles.spacer} />
				</View>


			: step === 2 ?
				<View style={styles.container}>
					<View style={styles.spacer} />
					{title}
					<TouchableOpacity onPress={this.selectPicture}>
						<Image
							style={styles.lobby.profilePic}
							source={{ uri: profile.picture.uri }}
						/>
					</TouchableOpacity>
					<TextInput
						autoCapitalize="words"
						style={styles.input.oneLine}
						placeholder="Display Name"
						onChangeText={this.typeName}
						value={profile.name.value}
					/>
					<TextInput
						autoCapitalize="sentences"
						style={styles.input.multiLine}
						placeholder="Bio"
						onChangeText={this.typeBio}
						value={profile.bio.value}
					/>
					<View style={styles.containerRow}>
						<RoundButton
							onPress={() => this.toStep(1)}
							icon="arrow-left"
						/>
						<RoundStatefulButton
							active={true}
							onPress={() => this.register()}
							iconOn="rocket"
							inconNull="rocket"
						/>
					</View>
					<View style={styles.spacer} />
				</View>


			: step === 3 ?

				<View style={[styles.container, styles.background]}>
					<Text style={[styles.text.heading, styles.text.white]}>
						Creating Account
					</Text>
					<Text style={[styles.text.body, styles.text.white]}>
						{task ?
							`${task.status} - ${task.step}`
							:
							"nope"
						}
					</Text>
				</View>


			: null}

		</View>
	}

}

export default Register;