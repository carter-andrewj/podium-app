import React from 'react';
import Page from '../components/page';
import { inject, observer } from 'mobx-react';

import { Animated, Easing, View, Image, Text } from 'react-native';
import Screen from '../components/screen';



@inject("store")
@observer
export default class Loader extends Page {

	constructor() {

		super()

		// Animations
		this.fader = new Animated.Value(0.0)
		this.rotator = new Animated.Value(0.0)
		this.ingress = undefined

		// Methods
		this.showGlyph = this.showGlyph.bind(this)
		this.spinGlyph = this.spinGlyph.bind(this)
		this.hideGlyph = this.hideGlyph.bind(this)

	}




// LIFECYCLE

	async pageWillFocus() {
		await new Promise(resolve => this.showGlyph(resolve))
	}

	async pageWillBlur() {
		await new Promise(resolve => this.hideGlyph(resolve))
	}




// ANIMATIONS

	showGlyph(callback) {
		Animated
			.timing(this.fader, {
				toValue: 1.0,
				duration: this.timing.fade
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


	spinGlyph() {
		Animated
			.sequence([
				Animated.timing(
					this.rotator,
					{
						toValue: 0,
						duration: this.timing.pause * 0.5
					}
				),
				Animated.timing(
					this.rotator,
					{
						toValue: 0.5,
						duration: this.timing.spin - this.timing.pause,
						easing: Easing.elastic(this.settings.splash.spinElasticity)
					}
				),
				Animated.timing(
					this.rotator,
					{
						toValue: 0.5,
						duration: this.timing.pause * 0.5
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


	hideGlyph(callback) {

		// Stop current animation
		this.fader.stopAnimation()

		// Hide
		Animated
			.timing(
				this.fader,
				{
					toValue: 0.0,
					duration: this.timing.fade
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





// RENDER

	render() {

		const spin = this.rotator.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '360deg']
		})

		return <Screen
			hideFooter={true}
			offsetBottom={this.layout.lobby.footer}
			style={this.style.splash.body}>

			<View style={this.style.splash.iconBox}>
				{this.getState("error") ?
					<Text style={{
							color: "red",
							backgroundColor: "white",
							padding: 10
						}}>
						{`ERROR: ${this.getState("error").name}\n`}
						{this.getState("error").message}
					</Text>
					:
					<Animated.Image
						style={{
							...this.style.splash.icon,
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