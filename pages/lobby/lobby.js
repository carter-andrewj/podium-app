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
import InputAvatar from './elements/avatar';
import InputBio from './elements/bio';

import Welcome from './elements/welcome';




@inject("store")
@observer
export default class Lobby extends Page {

	constructor() {

		// State
		super({
			mode: undefined,
			current: 0,
			focus: 0,
			lock: false,
			complete: false,
			nav: false,
			exit: false
		})

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
			InputAvatar,
			InputBio,

			Welcome

		]

	}


// GETTERS

	get data() {
		return this.session.registerData
	}

	get mode() {
		return this.getState("mode")
	}

	get current() {
		return this.getState("current")
	}

	get focus() {
		return this.getState("focus")
	}

	get showNav() {
		return this.getState("nav")
	}

	get exiting() {
		return this.getState("exit")
	}

	get locked() {
		return this.getState("lock")
	}

	get complete() {
		return this.getState("complete")
	}




// LIFECYCLE

	async pageWillFocus() {

		// Set initial mode
		if (this.props.mode === "signin") {
			this.setMode("signin")
		} else {
			this.setMode("register")
		}

	}


	async pageDidFocus() {

		// Only show the sign-in button after 4 seconds
		this.navTimer = setTimeout(
			() => this.updateState(state => state.set("nav", true)),
			this.settings.lobby.navigationDelay
		)

		// Restore focus to current stage
		this.setFocus(this.current)

	}


	componentDidUpdate() {

		// Play any animations that were scheduled this update
		this.animator.play()

	}


	async pageWillBlur() {

		// Clear focus from current element
		this.clearFocus()

	}


	async pageDidBlur() {

		// Hide navigation
		this.updateState(state => state.set("nav", false))

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
				if (this.mode === "signin") {

					// Start sign-in after password
					if (this.current === 3) this.signIn()

				// Register
				} else {

					// Start registration process after Submit
					if (this.current === 6) this.register()

					// Start profile update after bio
					if (this.current === 9) this.profile()

					// End registration
					if (this.current === 10) this.exit()

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
						this.navigate.to("Core")

					}

				),
				this.timing.transition
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
			picture: this.data.get("avatar").get("value"),
			pictureType: this.data.get("avatar").get("type"),
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

		// Check where to display the error
		let target = (this.mode === "register") ? "alias" : "passphrase"

		// Set error
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
			style={this.style.lobby.body}
			offsetBottom={this.current < 3 ?
				this.layout.core.footer.height
				: null
			}>

			<View style={this.style.lobby.navigation}>

				<FadingView
					animator={this.animator}
					style={this.style.lobby.navigationLeft}
					show={this.showNav &&
						this.mode === "signin" &&
						!this.exiting
					}>
					<Button
						style={this.style.lobby.registerButton}
						color={this.colors.white}
						label="register"
						labelStyle={this.style.lobby.navigationText}
						onPress={this.showNav ? () => this.setMode("register") : null}
					/>
				</FadingView>

				<FadingView
					animator={this.animator}
					style={this.style.lobby.navigationRight}
					show={this.showNav &&
						this.mode === "register" &&
						!this.exiting
					}>
					<Button
						style={this.style.lobby.signInButton}
						color={this.colors.white}
						label="sign in"
						labelStyle={this.style.lobby.navigationText}
						onPress={this.showNav ? () => this.setMode("signin") : null}
					/>
				</FadingView>

			</View>

			{this.mode ?
				this.order.map(
					(Component, i) => <Component

						key={`register-input-${i}`}

						mode={this.mode}
						exit={this.exiting}

						index={i}
						current={this.current}
						focus={this.focus}
						lock={this.locked}

						animator={this.animator}

						setFocus={this.setFocus}
						clearFocus={this.clearFocus}

						data={this.data}
						next={this.next}
						complete={this.complete}

					/>
				)
				: null
			}

		</Screen>
	}


}