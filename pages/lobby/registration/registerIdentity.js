import React from 'react';
import Component from '../../../utils/component';
import { Text, View, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../../styles/styles';

import RegisterWrapper from './registerWrapper';



@inject("store")
@observer
class RegisterIdentity extends Component {

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


	componentDidMount() {
		const identity = this.props.navigation.getParam("identity")
		if (identity) {
			this.updateState(
				state => state.set("value", identity),
				this.validate
			)
		}
	}


	type(id) {
		const identity = id.trim()
			.replace(this.props.store.config.validation.identity.chars, "")
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
				let identity = this.getState("value")

				// Unpack config
				const maxLength = this.props.store.config.validation.identity.maxLength;

				// Ignore empty IDs
				if (identity.length === 0 && !forced) {
					resolve()
				} else {
					this.timer = setTimeout(
						() => {

							let error;

							// Ensure an identity has been entered, if performing full validation
							if (identity.length === 0) {
								error = "Please enter an Identity"

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
									() => this.props.store.users
										.is(identity)
										.then(result => {
											if (this.getState("value") !== identity) {
												resolve()
											} else if (!result) {
												this.updateState(
													state => state
														.set("validating", false)
														.set("valid", false)
														.set("error", "Identity Unavailable"),
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
			hideBack={true}
			keyboard={true}
			navigation={this.props.navigation}>

			<Text style={[styles.text.heading, styles.lobby.heading]}>
				Welcome to Podium
			</Text>

			<TextInput

				ref={ref => { this.input = ref }}
				key="identity"

				style={styles.input.oneLine}
				autoFocus={true}
				autoCapitalize="none"
				
				onChangeText={this.type}
				value={this.state.value.length > 0 ?
					`@${this.state.value}` :
					""
				}
				placeholder="@identity"

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
							Checking Availability
						</Text>
					:
					this.state.error ?
						<Text style={styles.text.error}>
							{this.state.error}
						</Text>
					:
					<Text style={styles.text.white}>
						Identity Available
					</Text>
				}
			</View>

		</RegisterWrapper>
		
	}

}

export default RegisterIdentity;