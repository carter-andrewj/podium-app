import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class InputStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileInput = this.compileInput.bind(this)
		autorun(this.compileInput)

	}


	compileInput() {

		// Unpack settings
		const { singleHeight, multiHeight, checkbox } = this.settings.inputs
		const checkSize = Math.round(this.layout.screen.width * checkbox.size)

		// Extend layout
		this.layout.input = {
			single: {
				width: this.layout.screen.width - (2 * this.layout.screen.padding),
				height: Math.round(this.layout.screen.width * singleHeight),
			},
			multi: {
				width: this.layout.screen.width - (2 * this.layout.screen.padding),
				height: Math.round(this.layout.screen.width * multiHeight),
			}
		}
		this.layout.checkbox = {
			size: checkSize,
			icon: checkSize * checkbox.icon,
			corners: Math.round(0.1 * checkSize),
		}

	}


	@computed
	get singleLineInput() {
		return {

			flex: 1,

			width: this.layout.input.single.width,
			...this.withHeight(this.layout.input.single.height),

			backgroundColor: this.colors.white,

			...this.withBorder(this.colors.neutralDark),

			margin: this.layout.screen.padding,
			marginTop: 0,
			marginBottom: 0,

			...this.text.body,
			color: this.colors.black,
			fontSize: this.font.size.large,
			textAlign: "center",

		}
	}


	@computed
	get multiLineInput() {
		return {

			...this.text.body,

			flex: 1,

			width: this.layout.input.multi.width,
			...this.withHeight(this.layout.input.multi.height),

			backgroundColor: this.colors.white,

			// NOTE: due to a bug in react native, multiline
			// inputs ignore vertical padding unless specified
			// directly as paddingTop/paddingBottom, so the
			// duplication here is necessary until said bug is fixed.
			padding: this.layout.margin * 2,
			paddingTop: this.layout.margin * 2,
			paddingBottom: this.layout.margin * 2,
			
			...this.withBorder(this.colors.neutralDark),

			margin: this.layout.screen.padding,
			marginTop: 0,
			marginBottom: Math.round(0.5 * this.layout.margin),

			fontSize: this.font.size.normal,
			textAlign: "left",

		}
	}


	@computed
	get inputCaption() {
		return {
			...this.container,
			transform: [{ translateY: Math.round(-1.5 * this.layout.margin) }]
		}
	}


	@computed
	get checkbox() {
		return StyleSheet.create({

			container: {
				...this.container,
				alignSelf: "center",
				...this.withSize(this.layout.checkbox.size),
				backgroundColor: this.colors.white,
				...this.withBorder(this.colors.neutralDark),
				borderRadius: this.layout.checkbox.corners,
			},

			icon: {},

			check: {},

		})
	}


}