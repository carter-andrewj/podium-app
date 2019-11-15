import React from 'react';
import Page from '../../components/page';
import { Text, View, TextInput } from 'react-native';
import { action } from 'mobx';
import { inject, observer } from 'mobx-react';

import { Map } from 'immutable';

import Animator from '../../utils/animator';

import Screen from '../../components/screen';
import FadingView from '../../components/animated/fadingView';
import Button from '../../components/buttons/button';

import LobbyTitle from './elements/title';

import InputAlias from './elements/alias';
import InputPassphrase from './elements/passphrase';
import InputPassphraseConfirm from './elements/passphraseConfirm';
import TermsOfService from './elements/termsOfService';
import Register from './elements/register';

import InputDisplayName from './elements/displayName';
import InputPicture from './elements/picture';
import InputBio from './elements/bio';

import Welcome from './elements/welcome';

import styles from '../../styles/styles';
import settings from '../../settings';



@inject("store")
@observer
export default class Lobby extends Page {

	constructor() {

		super()

		// Initial state
		this.state = {
			mode: undefined,
			current: 0,
			focus: 0,
			lock: false,
			complete: false,
			nav: false,
			exit: false
		}

		// Refs
		this.references = Map()

		// Promises
		this.navTimer = undefined
		this.exitTimer = undefined
		this.registerTask = undefined

		// Animations
		this.animator = new Animator()

		// Methods
		this.next = this.next.bind(this)
		this.exit = this.exit.bind(this)

		this.register = this.register.bind(this)
		this.profile = this.profile.bind(this)
		this.signIn = this.signIn.bind(this)

		this.onError = this.onError.bind(this)

		this.setMode = this.setMode.bind(this)
		this.setFocus = this.setFocus.bind(this)
		this.clearFocus = this.clearFocus.bind(this)

		// Components
		this.order = [

			LobbyTitle,

			InputAlias,
			InputPassphrase,

			InputPassphraseConfirm,
			TermsOfService,
			Register,

			InputDisplayName,
			InputPicture,
			InputBio,

			Welcome

		]

	}


// GETTERS

	get data() {
		return this.session.registerData
	}




// LIFECYCLE

	pageDidMount() {

		// Only show the sign-in button after 4 seconds
		this.navTimer = setTimeout(
			() => this.updateState(state => state.set("nav", true)),
			settings.layout.lobbyNavDelay
		)

	}


	pageWillFocus() {

		// Set initial mode
		if (this.params && this.params.signIn) {
			this.setMode("signin")
		} else {
			this.setMode("register")
		}

	}


	pageDidFocus() {

		// Restore focus to current stage
		this.setFocus(this.state.current)

	}


	componentDidUpdate() {

		// Play any animations that were scheduled this update
		this.animator.play()

	}


	pageWillBlur() {

		// Clear focus from current element
		this.clearFocus()

	}


	pageWillUnmount() {

		// Dispose timers
		clearTimeout(this.navTimer)
		clearTimeout(this.exitTimer)

	}





// STAGES

	next(index) {

		// Show next component
		this.updateState(

			// Move to next stage
			state => state
				.set("focus", index)
				.update("current", current => Math.max(current, index)),

			// Trigger next steps
			() => {

				// Sign in
				if (this.state.mode === "signin") {

					// Start sign-in after password
					if (this.state.current === 3) this.signIn()

				// Register
				} else {

					// Start registration process after Submit
					if (this.state.current === 6) this.register()

					// Start profile update after bio
					if (this.state.current === 9) this.profile()

					// End registration
					if (this.state.current === 10) this.exit()

				}

			}

		)

	}


	exit() {
		this.updateState(

			// Set exit state
			state => state.set("exit", true),

			// Wait for exit transition
			() => this.exitTimer = setTimeout(
				() => this.updateState(

					// Clear mode
					state => state.set("mode", undefined),

					// Clean up
					() => {

						// Clear all data
						this.data.clear()

						// Navigate to core
						this.navigate("Core")

					}

				),
				settings.layout.transitionTime
			)

		)
	}




// ACTIONS

	async register() {

		// Hide the sign-in button
		this.updateState(state => state.set("nav", false))

		// Retreive register data
		let alias = this.data.get("alias").get("value").substring(1)
		let passphrase = this.data.get("passphrase").get("value")

		// Register user
		this.registerTask = this.session.register(alias, passphrase)

		// Wait for task to finish
		let result = await this.registerTask.catch(this.onError)

		// If successful
		if (result) {

			// Set registration as complete
			this.updateState(state => state.set("complete", true))

		} else {

			// Otherwise, restore nav and revert
			this.updateState(state => state
				.set("nav", true)
				.set("current", 2)
			)

		}

	}



	async profile() {

		// Wait for registration process to complete
		let result = await this.registerTask

		// Ignore if register failed
		if (!result) return

		// Retreive profile data
		let profile = {
			displayName: this.data.get("name").get("value"),
			//picture: this.data.get("picture").get("value"),
			about: this.data.get("about").get("value")
		}

		// Ignore if no profile values were set
		if (Object.keys(profile).length > 0) {

			// Update profile
			this.activeUser.profile.update(profile)

		}

	}


	async signIn() {

		// Hide navigation and lock inputs
		this.updateState(state => state
			.set("nav", false)
			.set("lock", true)
		)

		// Retreive credentials
		let alias = this.data.get("alias").get("value").substring(1)
		let passphrase = this.data.get("passphrase").get("value")

		// Navigate to core when authenticated
		let listener = this.session.authenticated.observe(({ newValue }) => {

			// When session is authenticated...
			if (newValue) {

				// Dispose of listener
				listener()

				// Navigate
				this.exit()

			}

		})

		// Sign user in
		let result = await this.session
			.signIn(alias, passphrase)
			.catch(this.onError)

		// Reset on failure
		if (!result) {

			// Dispose of listener
			listener()

			// Restore nav and unlock
			this.updateState(state => state
				.set("nav", true)
				.set("lock", false)
			)

		}

	}




// ERROR HANDLING

	onError(error) {
		this.updateState(

			// Reset to start
			state => state
				.set("current", 2)
				.set("focus", 1),

			// Set error and restor navigation
			() => this.setError(error.message)

		)
	}

	@action.bound
	setError(message) {
		let target = (this.state.mode === "register") ? "alias" : "passphrase"
		this.data.get(target).set("error", true)
		this.data.get(target).set("errorMessage", message)
	}






// MODE

	setMode(mode) {
		this.updateState(state => state.set("mode", mode))
	}





// REFERENCES

	setFocus(index) {
		this.updateState(state => state.set("focus", index))
	}


	clearFocus() {
		this.updateState(state => state.set("focus", undefined))
	}



// RENDER

	render() {

		return <Screen
			style={styles.lobby.body}
			offsetBottom={this.state.current < 3 ?
				settings.layout.lobbyFooter
				: null
			}>

			<View style={styles.lobby.nav}>

				<FadingView
					animator={this.animator}
					style={{ alignItems: "flex-start" }}
					show={this.state.nav &&
						this.state.mode === "signin" &&
						!this.state.exit
					}>
					<Button
						style={styles.lobby.registerButton}
						color={settings.colors.white}
						label="register"
						labelStyle={styles.lobby.navText}
						onPress={this.state.nav ? () => this.setMode("register") : null}
					/>
				</FadingView>

				<FadingView
					animator={this.animator}
					style={{ alignItems: "flex-end" }}
					show={this.state.nav &&
						this.state.mode === "register" &&
						!this.state.exit
					}>
					<Button
						style={styles.lobby.signInButton}
						color={settings.colors.white}
						label="sign in"
						labelStyle={styles.lobby.navText}
						onPress={this.state.nav ? () => this.setMode("signin") : null}
					/>
				</FadingView>

			</View>

			{this.state.mode ?
				this.order.map(
					(Component, i) => <Component

						key={`register-input-${i}`}

						mode={this.state.mode}
						exit={this.state.exit}

						index={i}
						current={this.state.current}
						focus={this.state.focus}
						lock={this.state.lock}

						animator={this.animator}

						setFocus={this.setFocus}
						clearFocus={this.clearFocus}

						data={this.data}
						next={this.next}
						complete={this.state.complete}

					/>
				)
				: null
			}

		</Screen>
	}


}