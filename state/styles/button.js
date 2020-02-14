import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class ButtonStyle extends Style {


	constructor(...args) {

		super(...args)

		// Compile and autorun
		this.compileButton = this.compileButton.bind(this)
		autorun(this.compileButton)

	}


	compileButton() {

		// Unpack button config
		const { normal, large, icon } = this.config.settings.button

		// Extend layout
		this.layout.button = {
			normal: {
				height: Math.round(normal * this.layout.screen.width),
				fontSize: this.font.size.tiniest,
				iconSize: Math.round(icon * this.layout.screen.width),
			},
			large: {
				height: Math.round(large * this.layout.screen.width),
				fontSize: this.font.size.smaller
			},
		}

	}


	// Basic button style
	@computed
	get button() {
		return StyleSheet.create({

			// View container for the button
			container: {
				...this.container,
				...this.withHeight(this.layout.button.normal.height),
				minWidth: this.layout.button.normal.height,
				...this.withBorder("transparent")
			},

			// Formating of text label on the button
			label: {
				...this.text.body,
				width: "100%",
				fontSize: this.layout.button.normal.fontSize,
				marginBottom: Math.round(this.font.size.tiniest * this.config.settings.font.offset),
				color: this.colors.major,
				textAlign: "center",
			},

			// Formatting when the button is in loading state
			loading: {
				color: this.colors.neutral,
				backgroundColor: this.colors.white,
				borderColor: this.colors.white,
			},

			icon: {},

			overlay: {
				...this.container,
				...this.overlay,
			},

		})
	}


	// Rounded button style
	@computed
	get roundButton() {
		return StyleSheet.create({

			...this.button,

			container: {
				...this.button.container,
				borderRadius: this.layout.button.normal.height,
			},

		})
	}


	// Follow button style
	@computed
	get followButton() {
		return StyleSheet.create({

			...this.button,

			// Formatting when the active user
			// is following the subject user
			followOn: {
				backgroundColor: this.colors.major,
				borderColor: this.colors.major,
			},

			// Formatting when the active user
			// is not following the subject user
			followOff: {
				backgroundColor: this.colors.white,
				borderColor: this.colors.major,
			},

		})
	}



	@computed
	get captionButton() {
		return StyleSheet.create({

			container: {
				...this.row,
				...this.withHeight(this.layout.button.normal.height),
				...this.withWidth(this.layout.button.normal.height * 2),
				...this.withBorder("transparent"),
			},

			inner: {
				...this.container,
				...this.withSize(this.layout.button.normal.height),
			},

			caption: {
				...this.text.title,
				lineHeight: this.layout.button.normal.height,
				fontSize: this.font.size.smaller,
			},

		})
	}



}