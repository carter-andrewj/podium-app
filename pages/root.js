import React from 'react';
import Page from '../components/page';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';

import { Animated, Easing, View, Image, Text } from 'react-native';
import Screen from '../components/screen';

import styles from '../styles/styles';
import settings from '../settings';


const loader = {
	fade: 500,
	duration: 6000,
	delay: 1000
}


@inject("store")
@observer
class Root extends Page {

	constructor() {

		super()

		this.state = {
			error: undefined
		}

		this.fader = new Animated.Value(1.0)
		this.rotator = new Animated.Value(0)
		this.spinGlyph = this.spinGlyph.bind(this)
		
	}




// ANIMATIONS

	spinGlyph() {
		Animated
			.sequence([
				Animated.timing(
					this.rotator,
					{
						toValue: 0,
						duration: loader.delay * 0.5
					}
				),
				Animated.timing(
					this.rotator,
					{
						toValue: 0.5,
						duration: loader.duration - loader.delay,
						easing: Easing.elastic(10)
					}
				),
				Animated.timing(
					this.rotator,
					{
						toValue: 0.5,
						duration: loader.delay * 0.5
					}
				),
				Animated.timing(
					this.rotator,
					{
						toValue: 0,
						duration: 1
					}
				),
			])
			.start(({ finished }) => finished ? this.spinGlyph() : null)
	}

	showGlyph(callback) {
		Animated
			.timing(this.fader, {
				toValue: 1.0,
				duration: loader.fade
			})
			.start(({ finished }) => {
				if (finished) {

					// Start spinning
					this.spinGlyph()

					// Run callback, if provided
					if (callback) callback()

				}
			})
	}

	hideGlyph(callback) {
		Animated
			.timing(
				this.fader,
				{
					toValue: 0.0,
					duration: loader.fade
				}
			)
			.start(({ finished }) => {
				if (finished) {

					// Stop spinning and then reset
					this.rotator.stopAnimation(
						() => this.rotator.setValue(0.0)
					)

					// Run callback, if provided
					if (callback) callback()

				}
			})
	}




// LIFECYCLE

	pageDidMount() {

		// Load Fonts
		Promise
			.all([
				this.store.loadAccount(),
				this.store.loadNation(),
				this.store.loadFonts(),
			])
			.then(async ([ credentials ]) => {

				//Check if existing credentials were found
				if (credentials && credentials.nation === this.nation.name.get()) {

					// Unpack credentials
					const { keyPair, passphrase } = credentials

					// Generate a sign-in task
					await this.session.keyIn(keyPair, passphrase)

					// Navigate to core UI
					this.navigate("Core")

				// Otherwise, load the lobby
				} else {
					this.navigate("Lobby")
				}

			})
			.catch(error => this.updateState(state => state
				.set("error", error)
				.set("status", "error")
			))
	
	}


	pageDidFocus() {

		// Start loading animation
		this.showGlyph()

		// Handle sign-out
		if (this.session.authenticated.get()) {

			// Sign ot
			this.session
				.signOut()
				.then(() => this.navigate("Lobby", { signIn: true }))

		}

	}


	navigate(to, params) {
		this.hideGlyph(() => super.navigate(to, params))
	}


	render() {

		const spin = this.rotator.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '360deg']
		})

		return <Screen
			hideTasks={true}
			offsetBottom={settings.layout.lobbyFooter}
			style={styles.splash.body}>

			<View style={styles.splash.iconBox}>
				{this.state.error ?
					<Text style={{
							color: "red",
							backgroundColor: "white",
							padding: 10
						}}>
						{`ERROR: ${this.state.error.message}`}
					</Text>
					:
					<Animated.Image
						style={{
							...styles.splash.icon,
							transform: [{ rotate: spin }],
							opacity: this.fader
						}}
						source={require("../assets/glyph.png")}
					/>
				}
			</View>

		</Screen>

	}



}

export default Root;