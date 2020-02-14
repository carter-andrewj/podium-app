import { StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';

import settings from '../settings';
import general from './general';
import text from './text';
import input from './input';




const layout = settings.layout

const screenWidth = Dimensions.get("window").width
const screenHeight = Math.round(
	(Dimensions.get("window").height - Constants.statusBarHeight) *
	(1.0 - layout.lobbyFooter)
)

const margin = Math.round(screenWidth * layout.margin)
const edge = Math.round(screenWidth * layout.screenMargin)

const signInMargin = edge + margin

const buttonSize = Math.round(screenWidth * layout.largeButton)
const navSize = buttonSize + (2 * margin) 

const inputHeight = Math.round(layout.inputHeight * screenWidth)
const inputWidth = Math.round(screenWidth - (2.0 * edge))
const multilineHeight = Math.round(layout.multilineHeight * screenWidth)

const tosHeight = screenHeight - navSize - edge -
	(4 * inputHeight) - (8 * margin)

const insetWidth = inputWidth - (2 * edge)

const imageCorner = Math.round(insetWidth * layout.corner)
const imageButtonHeight = Math.round(0.5 * inputHeight)

const thumbnailWidth = inputHeight - margin
const thumbnailCorner = Math.round(thumbnailWidth * layout.corner)



const button = {
	...general.container,
	flex: 0,
	width: null,
	padding: margin,
	backgroundColor: settings.colors.major,
	minHeight: buttonSize,
	minWidth: buttonSize,
	maxHeight: buttonSize,
	borderRadius: buttonSize,
}


const overlayItem = {
	...general.container,
	alignSelf: "flex-end",
	alignItems: "center",
	minWidth: inputHeight,
	maxWidth: inputHeight,
}


const lobby = StyleSheet.create({


	body: {
		...general.container,
		alignSelf: "stretch",
		backgroundColor: settings.colors.white,
		paddingTop: navSize,
	},

	container: {
		...general.container,
	},

	heading: {
		...text.heading,
		color: settings.colors.major,
		paddingBottom: edge
	},




	nav: {
		...general.container,
		flexDirection: "row",
		position: "absolute",
		top: edge,
		right: signInMargin,
		left: signInMargin,
		width: screenWidth - (2 * signInMargin),
	},

	navButton: button,

	signInButton: {
		...button,
		alignSelf: "flex-end"
	},

	registerButton: {
		...button,
		alignSelf: "flex-start"
	},

	navText: {
		...text.body,
		fontSize: settings.fontsize.smallish,
		color: settings.colors.white,
		padding: margin,
		paddingTop: 0,
		paddingBottom: 0,
	},




	inputContainer: {
		...general.container,
		justifyContent: "flex-start",
		flexBasis: "auto",
	},

	inputWrapper: {
		...general.container,
		justifyContent: "center",
		minHeight: inputHeight + margin,
		marginBottom: margin
	},

	overlay: {
		...general.container,
		position: "absolute",
		right: edge,
		left: edge,
		height: inputHeight,
		width: inputWidth,
	},

	overlayItem: overlayItem,

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
		transform: [{ translateY: Math.round(0.5 * (multilineHeight - inputHeight + margin)) }]
	},

	overlayText: {
		paddingTop: 0,
		margin: 0,
		color: settings.colors.neutralDark
	},

	nextButton: {
		transform: [{ translateX: Math.round(0.5 * margin) }]
	},




	tos: {
		...general.container,
		minWidth: inputWidth,
		maxWidth: inputWidth,
		minHeight: tosHeight,
		maxHeight: tosHeight,
		margin: margin,
		marginLeft: edge,
		marginRight: edge,
		backgroundColor: settings.colors.white,
		borderColor: settings.colors.neutralDark,
		borderWidth: layout.border,
	},

	tosHolder: {
		padding: 2 * margin,
		paddingTop: 0,
	},

	tosAgree: {
		...general.containerRow,
		alignSelf: "center",
		justifyContent: "center",
		maxWidth: inputWidth,
		minHeight: inputHeight,
		maxHeight: inputHeight,
		margin: margin,
		marginLeft: edge,
		marginRight: edge,
	},

	tosCheck: {
		alignSelf: "center",
		justifyContent: "center",
		minHeight: inputHeight,
		maxHeight: inputHeight,
	},

	tosMessage: {
		justifyContent: "center",
		minHeight: inputHeight,
		maxHeight: inputHeight,
		marginLeft: edge
	},

	tosText: {
		...text.neutral,
		alignSelf: "flex-start",
		fontSize: settings.fontsize.smallish,
		color: settings.colors.neutralDarkest
	},



	submitButton: {
		...button,
		minWidth: insetWidth,
		maxWidth: insetWidth,
		margin: 2 * edge,
	},

	submitText: {
		...text.title,
		fontSize: settings.fontsize.largish,
		color: settings.colors.white,
		width: "100%",
		textAlign: "center",
	},



	profilePicHolder: {
		...general.container,
		alignSelf: "center",
		minWidth: insetWidth,
		maxWidth: insetWidth,
		minHeight: insetWidth,
		maxHeight: insetWidth,
		marginBottom: margin * 2,
		
	},

	profilePic: {
		...general.container,
		minWidth: insetWidth,
		maxWidth: insetWidth,
		minHeight: insetWidth,
		maxHeight: insetWidth,
	},

	profilePicOverlay: {
		...general.container,
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	},

	profilePicButton: {
		...general.container,
		minWidth: inputHeight,
		maxWidth: inputHeight,
		minHeight: imageButtonHeight,
		maxHeight: imageButtonHeight,
		transform: [
			{ translateY: Math.round(0.5 * (insetWidth - imageButtonHeight)) },
			{ translateX: Math.round(0.5 * (insetWidth - imageButtonHeight)) }
		],
	},




	thumbnailContainer: {
		...general.container,
		alignItems: "flex-start",
		position: "absolute",
		left: edge + Math.round(margin * 0.5),
		top: -1 * Math.round(inputHeight + margin),
		width: thumbnailWidth,
		height: thumbnailWidth,
	},

	thumbnail: {
		...general.container,
		minWidth: thumbnailWidth,
		maxWidth: thumbnailWidth,
		minHeight: thumbnailWidth,
		maxHeight: thumbnailWidth,
	},




	welcome: {
		...general.container,
		minWidth: insetWidth,
		maxWidth: insetWidth,
		margin: margin,
		marginLeft: edge + margin,
		marginRight: edge + margin,
	},



});

export default lobby;
