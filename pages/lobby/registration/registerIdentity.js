import React from 'react';
import Page from '../../../utils/page';
import { Text, View, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../../styles/styles';

import RegisterWrapper from './registerWrapper';



@inject("store")
@observer
class RegisterIdentity extends Page {

	constructor() {
		super()
		
		this.state = {
			value: "",
			error: false,
			validating: false,
			valid: false
		}

		this.timer = null;
		this.input = null;

		this.type = this.type.bind(this)
		this.validate = this.validate.bind(this)
		this.submit = this.submit.bind(this)

	}


	pageWillFocus(params) {
		if (params.identity) {
			this.updateState(
				state => state.set("value", params.identity),
				this.validate
			)
		}
	}


	type(id) {
		const identity = id.trim()
			.replace(this.props.store.config.validation.alias.chars, "")
		this.updateState(
			state => state
				.set("value", identity)
				.set("error", undefined)
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

				// Get id
				let identity = this.state.value

				// Unpack config
				const minLength = this.props.store.config.validation.alias.minLength;
				const maxLength = this.props.store.config.validation.alias.maxLength;

				// Ignore empty IDs
				if (identity.length === 0 && !forced) {
					resolve()
				} else {
					this.timer = setTimeout(
						() => {

							let error;

							// Ensure an identity has been entered, if performing full validation
							if (identity.length < minLength) {
								error = `Identity must have at least ${minLength} ` +
										`character${minLength === 1 ? "" : "s"}`

							// Ensure username is no greater than the maximum length
							} else if (identity.length > maxLength) {
								error = `Identity cannot be longer than ${maxLength} characters`
							
							}

							// Check if an error has been found
							if (error) {
								this.updateState(
									state => state
										.set("valid", false)
										.set("error", error),
									() => resolve(false)
								)

							// Ensure username is not already taken
							} else {
								
								// Update state
								this.updateState(
									state => state.set("validating", true),
									() => this.props.store.session
										.search(identity)
										.then(result => {
											if (this.state.value !== identity) {
												resolve()
											} else if (result && result.length > 0) {
												this.updateState(
													state => state
														.set("validating", false)
														.set("valid", false)
														.set("error", "this identity is already owned"),
													() => resolve(false)
												)
											} else {
												this.updateState(
													state => state
														.set("validating", false)
														.set("valid", true),
													() => resolve(true)
												)
											}
										})
										.catch(reject)
								)

							}

						},
						forced ? 0 : this.props.store.config.validation.delay
					)
				}

			}

		})
	}


	submit() {
		this.validate(true)
			.then(valid => {
				if (valid) {
					this.props.navigation.navigate(
						"Passphrase",
						{
							...this.props.navigation.state.params,
							identity: this.state.value
						}
					)
				}
			})
			.catch(console.error)
	}




// RENDER

	render() {

		return <RegisterWrapper
			action={() => this.props.navigation.navigate("SignIn")}
			actionLabel="sign in"
			hideBack={true}
			keyboard={true}
			navigation={this.props.navigation}>

			<Text style={styles.lobby.heading}>
				Welcome to Podium
			</Text>

			<TextInput

				ref={ref => { this.input = ref }}
				key="identity"

				style={styles.input.oneLine}
				autoFocus={true}
				autoCorrect={false}
				autoCapitalize="none"
				
				onChangeText={this.type}
				value={this.state.value.length > 0 ?
					`@${this.state.value}` :
					""
				}
				placeholder="@alias"

				returnKeyType="next"
				onSubmitEditing={this.submit}
				
			/>

			<View style={styles.input.caption}>
				{
					this.state.value.length === 0 ?
						<Text style={styles.text.white}>
							create your identity
						</Text>
					:
					this.state.validating ?
						<Text style={styles.text.white}>
							checking availability
						</Text>
					:
					this.state.error ?
						<Text style={styles.text.error}>
							{this.state.error}
						</Text>
					:
					<Text style={styles.text.white}>
						identity available
					</Text>
				}
			</View>

		</RegisterWrapper>
		
	}

}

export default RegisterIdentity;