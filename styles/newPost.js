import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';


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
	padding: Dimensions.get("window").width *
		settings.layout.postMargin,
}


const newPost = StyleSheet.create({

	container: {
		...general.container,
		alignItems: "stretch",
		alignSelf: "flex-start",
		backgroundColor: settings.colors.white,
		paddingTop: Dimensions.get("window").width *
			settings.layout.postMargin,
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
		top: -2.5,
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
		margin: 0.02 * Dimensions.get("window").width,
		marginLeft: 0.05 * Dimensions.get("window").width,
		marginRight: 0.05 * Dimensions.get("window").width,
	},

	footer: {
		...general.container,
		alignSelf: "flex-end",
		minHeight: 0.06 * Dimensions.get("window").height,
		maxHeight: 0.06 * Dimensions.get("window").height,
		borderTopWidth: 1,
		borderTopColor: settings.colors.neutralPale
	}

});

export default newPost;
