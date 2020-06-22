import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';

import { Map } from 'immutable';


export default Style => class TextStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileText = this.compileText.bind(this)
		autorun(this.compileText)

	}


	compileText() {

		// Configure fonts
		this.font = {

			...this.settings.font,

			size: Map(this.settings.font.size)
				.map(size => size * this.layout.screen.width)
				.toJS(),

		}

	}


	@computed
	get text() {

		const title = {
			fontFamily: this.font.titles,
			fontSize: this.font.size.large,
			color: this.colors.major,
			textAlign: "center",
			padding: 0,
			margin: 0,
		}

		const body = {
			fontFamily: this.font.body,
			color: this.colors.black,
			textAlign: "left",
			padding: 0,
			margin: 0,
		}

		return StyleSheet.create({

			title: title,

			body: body,

			paragraph: {
				...body,
				fontSize: this.font.size.smaller,
				textAlign: "justify",
				paddingTop: 2 * this.layout.margin,
			},

			good: {
				...body,
				color: this.colors.good,
			},

			bad: {
				...body,
				color: this.colors.bad,
			},

			neutral: {
				...body,
				color: this.colors.neutralDark,
			},

			hide: {
				...body,
				color: "transparent",
			},

			name: {
				...title,
				fontSize: this.font.size.small,
			},

			alias: {
				...body,
				color: this.colors.neutralDark,
			},

			about: {
				...body,
				fontSize: this.font.size.smaller,
				textAlign: "justify",
				fontStyle: "italic",
			},

			mention: {
				...body,
				color: this.colors.mention,
			},

			topic: {
				...body,
				color: this.colors.topic,
			},

			domain: {
				...body,
				color: this.colors.domain,
			},

			link: {
				...body,
				color: this.colors.link,
				textDecorationLine: "underline",
			},

		})

	}

}