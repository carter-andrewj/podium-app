import React from 'react';
import Component from '../utils/component';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';

import { Animated, Easing, View, Image, Text } from 'react-native';
import Screen from './screen';

import styles from '../styles/styles';


const loader = {
	duration: 6000,
	delay: 1000
}


@inject("store")
@observer
class Root extends Component {

	constructor() {

		super()

		this.state = {
			status: "loading"
		}

		this.rotator = new Animated.Value(0)
		this.spinGlyph = this.spinGlyph.bind(this)
		
	}


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
			.start(event => {
				if (event.finished) {
					this.spinGlyph()
				}
			})
	}


	componentDidMount() {

		// Start loading animation
		this.spinGlyph()

		// Load Fonts
		Promise
			.all([
				this.store.loadAccounts(),
				this.store.loadNation(),
				this.store.loadFonts(),
			])
			.then(([ credentials ]) => {

				// Check if existing credentials were found
				if (credentials && credentials.nation === this.nation.name) {

					// Unpack credentials
					const { keyPair, passphrase } = credentials

					// Generate a sign-in task
					let signIn = this.session
						.keyIn(keyPair, passphrase)

					// Navigate to welcome screen
					this.navigate(
						"Welcome",
						{
							task: {
								promise: signIn,
								message: `Signing In`
							}
						}
					)

				// Otherwise, load the lobby
				} else {
					this.navigate("Register")
				}

			})
			.catch(error => this.updateState(
				state => state
					.set("error", error)
					.set("status", "error"),
				() => this.navigate("Register")
			))
	
	}



	render() {
		const spin = this.rotator.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '360deg']
		})
		return <Screen style={styles.splash.background}>

			<View style={styles.splash.iconBox}>
				<Animated.Image
					style={[
						styles.splash.icon,
						{ transform: [{ rotate: spin }] }
					]}
					source={require("../assets/glyph.png")}
				/>
			</View>

		</Screen>
	}



}

export default Root;