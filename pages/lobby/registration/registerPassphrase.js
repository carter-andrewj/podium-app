import React from 'react';
import Component from '../../../utils/component';
import { Text, View, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../../styles/styles';

import Button from '../../../components/button';

import RegisterWrapper from './registerWrapper';



@inject("store")
@observer
class RegisterPassphrase extends Component {

	constructor() {
		super()
		
		this.state = {
			value: "",
			confirm: "",
			error: undefined,
			confirmError: undefined,
			validating: false,
			valid: false,
			show: false
		}

		this.value = React.createRef();
		this.confirm = React.createRef();

		this.typePassphrase = this.typePassphrase.bind(this)
		this.typeConfirm = this.typeConfirm.bind(this)
		this.validate = this.validate.bind(this)
		this.submit = this.submit.bind(this)
		this.toggleShow = this.toggleShow.bind(this)

	}



	componentDidMount() {
		const passphrase = this.props.navigation.getParam("passphrase")
		if (passphrase) {
			this.updateState(
				state => state.set("value", passphrase),
				this.validate
			)
		}
	}



	typePassphrase(passphrase) {
		this.updateState(
			state => state
				.set("value", passphrase)
				.set("error", undefined)
				.set("conformError", undefined)
				.set("validating", true)
				.set("valid", undefined),
			this.validate
		)
	}

	typeConfirm(confirm) {
		this.updateState(
			state => state
				.set("confirm", confirm)
				.set("error", undefined)
				.set("conformError", undefined)
				.set("validating", true)
				.set("valid", undefined),
			this.validate
		)
	}

	validate(forced=false) {
		clearTimeout(this.timer)
		return new Promise((resolve, reject) => {

			// Check if current value has already been validated
			if (this.state.valid) {
				this.updateState(
					state => state.set("validating", false),
					() => resolve(true)
				)
			} else {
				this.timer = setTimeout(
					() => {

						// Get id
						let passphrase = this.getState("value")
						let confirm = this.getState("confirm")

						// Ignore empty IDs
						if (passphrase.length === 0 && !forced) {
							resolve()
						} else {

							let error;

							const minLength = this.props.store.config.validation.passphrase.minLength
							const maxLength = this.props.store.config.validation.passphrase.maxLength;

							// Ensure an identity has been entered, if performing full validation
							if (passphrase.length === 0) {
								error = "Please enter a Passphrase"

							// Ensure username is greater than the minimum length
							} else if (passphrase.length < minLength) {
								error = `Passphrase must be at least ${minLength} characters`

							// Ensure username is no greater than the maximum length
							} else if (passphrase.length > maxLength) {
								error = `Passphrase cannot be longer than ${maxLength} characters`
							}

							// Check if an error has been found
							if (error) {
								this.updateState(
									state => state
										.set("valid", false)
										.set("validating", false)
										.set("error", error),
									() => resolve(false)
								)

							// Check if passphrase has not been confirmed
							} else if (confirm.length > 0 && passphrase !== confirm) {
								this.updateState(
									state => state
										.set("valid", false)
										.set("validating", false)
										.set("confirmError", "Passphrases do not match"),
									() => resolve(false)
								)

							// Otherwise, password is valid
							} else {
								this.updateState(
									state => state
										.set("valid", true)
										.set("validating", false),
									() => resolve(true)
								)
							}

						}

					},
					forced ? 0 : this.props.store.config.validation.delay
				)
			}

		})
	}


	submit() {
		this.validate(true)
			.then(valid => {
				if (valid) {
					this.props.navigation.navigate(
						"Terms",
						{
							...this.props.navigation.state.params,
							passphrase: this.state.value,
						}
					)
				}
			})
			.catch(console.error)
	}



	toggleShow() { 
		this.updateState(state => state.update("show", s => !s))
	}



// RENDER

	render() {

		return <RegisterWrapper
			keyboard={true}
			navigation={this.props.navigation}>

			<Button
				style={styles.lobby.showButton}
				onPress={this.toggleShow}
				label={this.state.show ? "hide" : "show"}
				labelStyle={styles.lobby.showButtonText}
			/>

			<TextInput

				ref={this.value}
				key="passphrase"

				style={styles.input.oneLine}
				autoFocus={true}
				secureTextEntry={!this.state.show}
				autoCapitalize="none"
				
				onChangeText={this.typePassphrase}
				value={this.state.value}
				placeholder="passphrase"

				returnKeyType="next"
				onSubmitEditing={() => this.confirm.current.focus()}
				
			/>

			<TextInput

				ref={this.confirm}
				key="confirm"

				style={styles.input.oneLine}
				secureTextEntry={!this.state.show}
				autoCapitalize="none"
				
				onChangeText={this.typeConfirm}
				value={this.state.confirm}
				placeholder="confirm passphrase"

				returnKeyType="next"
				onSubmitEditing={this.submit}
				
			/>

			<View style={styles.input.caption}>
				{
					this.state.validating ?
						<Text>{" "}</Text>
					:
					this.state.error ?
						<Text style={styles.text.error}>
							{this.state.error}
						</Text>
					:
					this.state.value.length === 0 ?
						<Text style={styles.text.white}>
							choose a passphrase to secure your account
						</Text>
					:
					this.state.confirm.length === 0 ?
						<Text style={styles.text.white}>
							please confirm your passphrase
						</Text>
					:
					this.state.confirmError ?
						<Text style={styles.text.error}>
							{this.state.confirmError}
						</Text>
					:
					<Text style={styles.text.white}>
						passphrase confirmed
					</Text>
				}
			</View>

		</RegisterWrapper>
		
	}


}


export default RegisterPassphrase;