import React from 'react';
import Page from '../../utils/page';
import { Text, View, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react';

import Button from '../../components/button';

import settings from '../../settings';
import styles from '../../styles/styles';




@inject("store")
@observer
class SignIn extends Page {

	constructor() {
		super()
		
		this.state = {
			identity: "",
			passphrase: "",
			error: false,
			loading: false,
			show: false
		}

		this.identity = null;
		this.passphrase = null;

		this.typeIdentity = this.typeIdentity.bind(this)
		this.typePassphrase = this.typePassphrase.bind(this)

		this.submit = this.submit.bind(this);

		this.toggleShow = this.toggleShow.bind(this)

	}


	pageWillFocus(params) {
		this.updateState(state => state
			.set("error", params.error || false)
			.set("identity", params.identity || ""),
			params.identity ?
				this.passphrase.focus :
				this.identity.focus
		)
	}

	pageWillBlur() {
		this.props.navigation.setParams({
			error: undefined
		})
	}

	pageDidBlur() {
		this.updateState(state => state.set("error", false))
	}


	typeIdentity(id) {
		const identity = id.trim()
			.replace(this.props.store.config.validation.identity.chars, "")
		this.updateState(state => state
			.set("identity", identity)
			.set("error", undefined)
		)
	}

	typePassphrase(passphrase) {
		this.updateState(state => state
			.set("passphrase", passphrase)
			.set("error", undefined)
		)
	}

	submit() {

		// Unpack form data
		let identity = this.state.identity;
		let passphrase = this.state.passphrase;

		// Get validation config
		const val = this.props.store.config.validation

		// Validate entries
		let error;
		if (!identity) {
			error = "please enter your podium @ identity"
		} else if (
				identity < val.identity.minLength ||
				identity > val.identity.maxLength
			) {
			error = "invalid identity"
		} else if (!passphrase) {
			error = "please enter your passphrase"
		} else if (
				passphrase.length < val.passphrase.minLength ||
				passphrase.length > val.passphrase.maxLength
			) {
			error = "invalid passphrase"
		}

		// Handle errors
		if (error) {
			this.updateState(state => state.set("error", error))
		
		// Otherwise, sign in
		} else {

			// Create sign-in task
			let task = this.props.store.session
				.signIn(null, identity, passphrase)

			// Navigate to welcome screen
			this.props.navigation.navigate(
				"Welcome",
				{
					task: {
						promise: task,
						message: `Signing in @${identity}`
					}
				}
			)

		}

	}


	toggleShow() {
		this.updateState(state => state.update("show", s => !s))
	}



// RENDER

	render() {

		return <View style={styles.lobby.container}>

			<View style={styles.keyboard.above}>

				<View style={styles.lobby.header}>

					<View style={[
							styles.containerRow,
							{ justifyContent: "flex-start" }
						]}>
						<Button
							onPress={() => this.props.navigation.navigate("Register")}
							icon="arrow-left"
							iconColor={settings.colors.major}
							round={true}
						/>
					</View>

				</View>

				<View style={styles.spacer} />

				<Text style={styles.lobby.heading}>
					Welcome Back
				</Text>

				<TextInput

					ref={ref => { this.identity = ref }}

					style={styles.input.oneLine}
					autoFocus={true}
					autoCorrect={false}
					autoCapitalize="none"
					
					onChangeText={this.typeIdentity}
					value={this.state.identity.length > 0 ?
						`@${this.state.identity}` :
						""
					}
					placeholder="@identity"

					returnKeyType="next"
					onSubmitEditing={() => this.passphrase.focus()}
					
				/>

				<TextInput

					ref={ref => { this.passphrase = ref }}

					style={styles.input.oneLine}
					secureTextEntry={!this.state.show}
					autoCapitalize="none"
					autoCorrect={false}
					
					onChangeText={this.typePassphrase}
					value={this.state.passphrase}
					placeholder="passphrase"

					returnKeyType="go"
					onSubmitEditing={this.submit}
					
				/>

				<View style={styles.input.caption}>
					{
						this.state.error ?
							<Text style={styles.text.error}>
								{this.state.error}
							</Text>
						:
						this.state.loading ?
							<Text style={styles.text.info}>
								signing in
							</Text>
						:
						<Text style={styles.text.info}>
							{" "}
						</Text>
					}
				</View>

				<View style={[
						styles.containerRow,
						{ justifyContent: "flex-end" }
					]}>
					<Button
						visible={this.state.passphrase.length > 0}
						style={styles.lobby.showBelow}
						onPress={this.toggleShow}
						color="transparent"
						label={this.state.show ? "hide" : "show"}
						labelStyle={styles.lobby.showButtonText}
					/>
				</View>

				<View style={styles.spacer} />

			</View>

			<View style={styles.keyboard.below} />

		</View>
		
	}

}

export default SignIn;