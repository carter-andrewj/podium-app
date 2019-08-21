import React from 'react';
import Component from '../utils/component';
import { inject, observer } from 'mobx-react';

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
				this.props.store.loadFonts(),
				this.props.store.loadLedger(),
				this.props.store.loadAccounts(),
				new Promise(resolve => setTimeout(resolve, loader.duration))
			])
			.then(([font, ledger, credentials]) => {

				console.log("credentials", credentials)

				// Check if existing credentials were found
				if (credentials) {

					// Generate a sign-in task
					return this.props.store.session.signIn(
						credentials.identity,
						credentials.passphrase
					)

				// Otherwise, load the lobby
				} else {
					return false
				}

			})
			.then(result => {
				if (result) {
					this.props.navigation.navigate("Feed")
				} else {
					this.props.navigation.navigate("Register")
				}
			})
			.catch(error => {
				console.error(error)
				this.updateState(
					state => state
						.set("error", error)
						.set("status", "error"),
					() => this.props.navigation.navigate("Register")
				)
			})
	
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

			{this.props.store.loaded && this.props.store.session.identity ?
				<View>
					<Text style={[styles.text.title, styles.text.white]}>
						Welcome Back
					</Text>
					<Text style={[styles.text.subtitle, styles.text.white]}>
						{`@${this.props.store.api.identity}`}
					</Text>
				</View>
				: null
			}

		</Screen>
	}



}

export default Root;