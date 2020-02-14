import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class ComposeStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileCompose = this.compileCompose.bind(this)
		autorun(this.compileCompose)

	}


	compileCompose() {

		// Unpack settings
		const { referenceHeight, footerHeight } = this.settings.compose
		const referenceSize = Math.round(this.layout.screen.width * referenceHeight)
		const thumbnailHeight = 2 * referenceSize

		// Extend layout
		this.layout.compose = {
			content: {
				height: this.layout.post.body.height,
				padding: this.layout.margin,
			},
			media: {
				height: thumbnailHeight + (2 * this.layout.margin),
				thumbnail: thumbnailHeight,
			},
			reference: {
				height: referenceSize,
				corner: Math.floor(0.5 * (referenceSize - this.layout.margin + 1)),
			},
			footer: {
				height: referenceSize + (2 * this.layout.margin),
			},
		}

	}


	@computed
	get compose() {

		const input = {
			flex: 1,
			flexGrow: 1,
			...this.text.body,
			...this.overlay,
			padding: this.layout.compose.content.padding,
		}

		return StyleSheet.create({

			body: {
				...this.column,
				alignItems: "stretch",
				alignSelf: "flex-start",
				backgroundColor: this.colors.white,
			},

			wrapper: {
				...this.container,
				...this.withHeight(this.layout.post.height),
				alignSelf: "stretch",
			},



			sendButton: {
				margin: this.layout.margin,
			},




			content: {
				...this.row,
				alignItems: "stretch",
				alignSelf: "stretch",
				position: "relative",
			},

			input: {
				...input,
				backgroundColor: "transparent",
			},

			output: {
				...input,
				top: Math.round(-0.5 * this.layout.margin),
			},




			mediaHolder: {
				...this.row,
				...this.withHeight(this.layout.compose.media.height),
				alignSelf: "flex-end",
				justifyContent: "flex-start",
				minHeight: 0,
				width: "100%",
				padding: this.layout.margin,
				paddingLeft: this.layout.post.wing.left.overlap + (2 * this.layout.margin),
			},

			media: {
				...this.container,
				...this.withSize(this.layout.compose.media.thumbnail),
				margin: this.layout.margin,
			},

			mediaImage: {
				...this.withSize(this.layout.compose.media.thumbnail),
				resizeMode: "cover",
			},

			referenceHolder: {
				...this.container,
				flex: 0,
				alignSelf: "flex-end",
				minHeight: 0,
				width: "100%",
				padding: this.layout.margin,
				paddingLeft: this.layout.post.wing.left.overlap + (2 * this.layout.margin),
			},

			reference: {
				...this.row,
				...this.withHeight(this.layout.compose.reference.height),
			},






			footer: {
				...this.container,
				alignSelf: "flex-end",
				...this.withWidth(this.layout.screen.width),
				...this.withHeight(this.layout.compose.footer.height),
				marginBottom: this.layout.margin,
				...this.withBorder(this.colors.neutralPale, "Top"),
			},

			resultsBar: {
				...this.withWidth(this.layout.screen.width),
				alignItems: "flex-start",
			},

			resultsHeader: {
				...this.container,
				...this.withSize(this.layout.compose.reference.height),
			},

			resultsIcon: {
				...this.container,
				position: "absolute",
			},

			result: {
				...this.row,
				...this.withHeight(this.layout.compose.reference.height),
				backgroundColor: this.colors.major,
				margin: this.layout.margin,
				marginLeft: 0,
				borderBottomLeftRadius: this.layout.compose.reference.corner,
			},

			resultAvatar: {
				...this.container,
				...this.withSize(this.layout.compose.reference.height - Math.round(2.0 * this.layout.border)),
				margin: this.layout.border,
			},

			resultTitle: {
				...this.container,
				alignItems: "flex-start",
				marginLeft: Math.round(0.5 * this.layout.margin),
				marginRight: Math.round(0.5 * this.layout.margin),
			},

			resultName: {
				...this.text.name,
				color: this.colors.white,
			},

			resultAlias: {
				...this.text.alias,
				color: this.colors.white
			},

		})
	}


}