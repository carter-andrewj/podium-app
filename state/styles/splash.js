import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class SplashStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileSplash = this.compileSplash.bind(this)
		autorun(this.compileSplash)

	}


	compileSplash() {

		// Unpack settings
		const { iconWidth } = this.settings.splash

		// Extend layout
		this.layout.splash = {
			icon: {
				width: Math.round(iconWidth * this.layout.screen.width),
			},
		}

	}


	@computed
	get splash() {
		return StyleSheet.create({

			body: {
				...this.container,
				backgroundColor: this.colors.white,
			},

			icon: {
				flex: 1,
				margin: "auto",
				width: this.layout.splash.icon.width,
				minHeight: this.layout.splash.icon.width,
				resizeMode: "contain",
			},

		})
	}

}