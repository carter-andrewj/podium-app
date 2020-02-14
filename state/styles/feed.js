import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class FeedStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileFeed = this.compileFeed.bind(this)
		autorun(this.compileFeed)

	}


	compileFeed() {

		// Unpack settings
		const { backgroundIcon, loadingIcon } = this.settings.feed

		// Extend layout
		this.layout.feed = {
			separator: Math.round(2.0 * this.layout.border),
			notice: {
				spinner: Math.round(loadingIcon * this.layout.screen.width),
				icon: Math.round(backgroundIcon * this.layout.screen.width),
				height: this.layout.core.header.height,
			},
			button: {
				height: this.layout.core.header.height - (3 * this.layout.margin),
			},
		}

	}


	@computed
	get feed() {
		return StyleSheet.create({

			container: {
				...this.container,
				backgroundColor: this.colors.neutral,
			},

			list: {
				...this.column,
				...this.withWidth(this.layout.screen.width),
				paddingTop: this.layout.margin,
			},

			separator: {
				...this.container,
				...this.withHeight(this.layout.feed.separator),
			},

			spacer: {
				...this.container,
				...this.withWidth(this.layout.screen.width),
				...this.withHeight(this.layout.feed.notice.height),
			},

			notice: {
				...this.container,
				...this.withWidth(this.layout.screen.width),
				...this.withHeight(this.layout.feed.notice.height),
				justifyContent: "center",
				backgroundColor: "transparent",
			},

			noticeBackground: {
				...this.container,
				position: "absolute",
				top: 0,
				left: 0,
				justifyContent: "center",
				opacity: this.settings.feed.backgroundOpacity,
			},

			noticeText: {
				...this.text.title,
				color: this.colors.white,
				fontSize: this.font.size.normal,
			},

			button: {
				...this.roundButton.container,
				alignSelf: "center",
				marginTop: this.layout.margin,
				marginBottom: this.layout.margin,
				maxWidth: "60%",
				backgroundColor: this.colors.white,
				...this.withShadow(),
			},

			buttonText: {
				...this.text.title,
				fontSize: this.font.size.small,
			},

			glyph: {
				...this.withHeight(this.font.size.largest),
			},

		})
	}


}