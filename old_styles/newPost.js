import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';



const layout = settings.layout
const screenWidth = Dimensions.get("window").width

const referenceHeight = Math.round(screenWidth * layout.refHeight)

const footerSize = Math.round(screenWidth * layout.footerSize)

const margin = Math.round(screenWidth * layout.margin)


const inputText = {
	fontFamily: "Varela",
	fontSize: settings.fontsize.small,
	textAlign: "left",
}

const inputContainer = {
	flex: 1,
	flexGrow: 1,
	position: "absolute",
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	padding: margin,
}


const newPost = StyleSheet.create({

	container: {
		...general.container,
		alignItems: "stretch",
		alignSelf: "flex-start",
		backgroundColor: settings.colors.white,
	},

	content: {
		...general.containerRow,
		alignItems: "stretch",
		alignSelf: "stretch",
		position: "relative",
	},

	input: {
		...inputContainer,
		...inputText,
		backgroundColor: "transparent",
		color: "transparent",
	},

	output: {
		...inputContainer,
		top: -3,
		backgroundColor: settings.colors.white,
	},

	text: {
		...inputText,
	},

	mention: {
		...inputText,
		color: settings.colors.major,
	},

	topic: {
		...inputText,
		color: settings.colors.minor
	},

	group: {
		...inputText,
		color: settings.colors.note
	},

	url: {
		...inputText,
		color: settings.colors.info,
		textDecorationLine: "underline"
	},

	sendButton: {
		margin: margin,
	},

	referenceHolder: {
		...general.container,
		alignContent: "stretch",
		minHeight: 0,
		width: "100%",
		backgroundColor: "orange",
	},

	reference: {
		...general.containerRow,
		minHeight: referenceHeight,
		maxHeight: referenceHeight,
		backgroundColor: "cyan",
	},

	footer: {
		...general.container,
		alignSelf: "flex-end",
		minHeight: footerSize,
		maxHeight: footerSize,
		borderTopWidth: 1,
		borderTopColor: settings.colors.neutralPale
	}

});

export default newPost;
