import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class LobbyStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileLobby = this.compileLobby.bind(this)
		autorun(this.compileLobby)

	}


	compileLobby() {

		// Unpack data
		const { footerHeight } = this.settings.lobby
		const lobbyHeight = Math.round(this.layout.screen.height * (1.0 - footerHeight))
		const lobbyInset = this.layout.input.single.width - (2 * this.layout.screen.padding)
		const navigationMargin = this.layout.margin + this.layout.screen.padding
		const avatarButtonHeight = Math.round(0.5 * this.layout.input.single.height)

		// Extend layout
		this.layout.lobby = {
			footer: footerHeight,
			height: lobbyHeight,
			inset: lobbyInset,
			navigation: {
				height: this.layout.button.large.height + (2 * this.layout.margin),
				width: this.layout.screen.width - (2 * navigationMargin),
				margin: navigationMargin,
			},
			termsOfService: {
				height: lobbyHeight - this.layout.button.large.height - this.layout.screen.padding -
					(4 * this.layout.input.single.height) - (6 * this.layout.margin),
			},
			avatar: {
				size: lobbyInset,
				button: {
					height: avatarButtonHeight,
					offset: Math.round(0.5 * (lobbyInset - avatarButtonHeight)),
				},
				thumbnail: {
					size: this.layout.input.single.height - this.layout.margin,
				},
			},
		}

	}



	@computed
	get lobbyButton() {
		return {
			...this.container,
			flex: 0,
			width: null,
			padding: this.layout.margin,
			backgroundColor: this.colors.major,
			minWidth: this.layout.button.large.height,
			...this.withHeight(this.layout.button.large.height),
			borderRadius: this.layout.button.large.height,
		}
	}



	@computed
	get lobby() {

		const overlayItem = {
			...this.container,
			alignSelf: "flex-end",
			alignItems: "center",
			...this.withWidth(this.layout.input.single.height),
		}

		return StyleSheet.create({

			body: {
				...this.container,
				alignSelf: "stretch",
				backgroundColor: this.colors.white,
				paddingTop: this.layout.lobby.navigation.height,
			},

			container: {
				...this.container,
			},


			navigation: {
				...this.row,
				position: "absolute",
				top: this.layout.screen.padding,
				right: this.layout.lobby.navigation.margin,
				left: this.layout.lobby.navigation.margin,
				width: this.layout.lobby.navigation.width,
			},

			navigationLeft: {
				alignItems: "flex-start"
			},

			registerButton: {
				...this.lobbyButton,
				alignSelf: "flex-start",
			},

			navigationRight: {
				alignItems: "flex-end"
			},

			signInButton: {
				...this.lobbyButton,
				alignSelf: "flex-end",
			},

			navigationText: {
				...this.text.body,
				fontSize: this.font.size.small,
				color: this.colors.white,
				padding: this.layout.margin,
				paddingTop: 0,
				paddingBottom: 0,
			},



			inputContainer: {
				...this.container,
				justifyContent: "flex-start",
				flexBasis: "auto",
			},

			inputWrapper: {
				...this.container,
				justifyContent: "center",
				minHeight: this.layout.input.single.height + this.layout.margin,
				marginBottom: this.layout.margin,
			},

			singleInput: this.singleLineInput,

			multiInput: this.multiLineInput,

			caption: this.inputCaption,

			overlay: {
				...this.container,
				position: "absolute",
				right: this.layout.screen.padding,
				left: this.layout.screen.padding,
				height: this.layout.input.single.height,
				width: this.layout.input.single.width,
			},

			overlayLeft: {
				...overlayItem,
				alignSelf: "flex-start",
			},

			overlayRight: {
				...overlayItem,
				alignSelf: "flex-end",
			},

			overlayMulti: {
				...overlayItem,
				alignSelf: "flex-end",
				transform: [{ translateY: Math.round(0.5 *
					(this.layout.input.multi.height - this.layout.input.single.height + this.layout.margin)
				) }],
			},

			overlayText: {
				paddingTop: 0,
				margin: 0,
				color: this.colors.neutralDark,
			},

			nextButton: {
				transform: [{ translateX: this.layout.margin }],
			},



			submitButton: {
				...this.lobbyButton,
				...this.withWidth(this.layout.lobby.inset),
				margin: 2 * this.layout.screen.padding,
			},

			submitText: {
				...this.text.title,
				fontSize: this.font.size.large,
				color: this.colors.white,
				width: "100%",
				textAlign: "center",
			},


			heading: {
				...this.text.title,
				color: this.colors.major,
				paddingBottom: this.layout.screen.padding,
			},

			welcome: {
				...this.container,
				...this.withWidth(this.layout.lobby.inset),
				margin: this.layout.screen.padding,
				marginLeft: 2 * this.layout.screen.padding,
				marginRight: 2 * this.layout.screen.padding,
			},

		})
	}




	@computed
	get lobbyTermsOfService() {
		return StyleSheet.create({
			
			container: {
				...this.container,
				...this.withWidth(this.layout.input.single.width),
				...this.withHeight(this.layout.lobby.termsOfService.height),
				margin: this.layout.margin,
				marginLeft: this.layout.screen.padding,
				marginRight: this.layout.screen.padding,
				backgroundColor: this.colors.white,
				...this.withBorder(this.colors.neutralDark),
			},

			inner: {
				padding: 2 * this.layout.margin,
				paddingTop: 0,
			},

			agree: {
				...this.row,
				alignSelf: "center",
				justifyContent: "center",
				maxWidth: this.layout.input.single.width,
				...this.withHeight(this.layout.input.single.height),
				margin: this.layout.margin,
				marginLeft: this.layout.screen.padding,
				marginRight: this.layout.screen.padding,
			},

			check: {
				...this.container,
				alignSelf: "center",
				justifyContent: "center",
				...this.withSize(this.layout.input.single.height),
			},

			message: {
				justifyContent: "center",
				...this.withHeight(this.layout.input.single.height),
			},

			messageText: {
				...this.text.body,
				alignSelf: "flex-start",
				fontSize: this.font.size.small,
				color: this.colors.neutralDarkest,
			},

		})
	}



	@computed
	get lobbyAvatar() {
		return StyleSheet.create({

			container: {
				...this.container,
				alignSelf: "center",
				...this.withSize(this.layout.lobby.avatar.size),
				marginBottom: this.layout.margin * 2,
			},

			image: {
				...this.container,
				...this.withSize(this.layout.lobby.avatar.size),
				opacity: 0.5,
			},

			overlay: {
				...this.overlay,
				justifyContent: "flex-end",
			},

			button: {
				...this.container,
				...this.withSize(this.layout.lobby.avatar.button.height),
				transform: [
					{ translateX: this.layout.lobby.avatar.button.offset }
				],
			},

			thumbnailContainer: {
				...this.container,
				alignItems: "flex-start",
				position: "absolute",
				left: this.layout.screen.padding + Math.round(this.layout.margin * 0.5),
				top: -1 * Math.round(this.layout.input.single.height + this.layout.margin),
				width: this.layout.lobby.avatar.thumbnail.size,
				height: this.layout.lobby.avatar.thumbnail.size,
			},

			thumbnail: {
				...this.container,
				...this.withSize(this.layout.lobby.avatar.thumbnail.size),
			},

		})
	}




}