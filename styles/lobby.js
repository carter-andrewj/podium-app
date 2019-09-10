import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';
import input from './input';




const showButton = {
	minWidth: 0.2 * Dimensions.get("window").width,
	maxHeight: 0.06 * Dimensions.get("window").width,
	marginRight: 0,
}



const lobby = StyleSheet.create({

	container: {
		...general.container,
		backgroundColor: settings.colors.major
	},

	header: {
		...general.container,
		position: "absolute",
		flexDirection: "row",
		top: 0.07 * Dimensions.get("window").height,
		maxWidth: 0.8 * Dimensions.get("window").width,
		alignItems: "stretch",
		zIndex: 10
	},

	heading: {
		...text.heading,
		color: settings.colors.white
	},




	showButton: showButton,

	showAbove: {
		...showButton,
		transform: [
			{ translateY: 0.01 * Dimensions.get("window").height }
		]
	},

	showBelow: {
		...showButton,
		transform: [
			{ translateY: -0.06 * Dimensions.get("window").height }
		]
	},

	showButtonText: {
		padding: 0.01 * Dimensions.get("window").width,
		paddingTop: 0,
		margin: 0,
		color: settings.colors.white
	},




	tos: {
		...general.container,
		minWidth: 0.9 * Dimensions.get("window").width,
		maxWidth: 0.9 * Dimensions.get("window").width,
		minHeight: 0.5 * Dimensions.get("window").height,
		maxHeight: 0.5 * Dimensions.get("window").height,
		margin: 0.05 * Dimensions.get("window").width,
		padding: 0.03 * Dimensions.get("window").width,
		backgroundColor: settings.colors.white
	},

	tosCheck: {
		...general.containerRow,
		width: 0.9 * Dimensions.get("window").width,
		minHeight: 0.2 * Dimensions.get("window").width,
		padding: 0.0 * Dimensions.get("window").width,
	},

	tosTouch: {
		...general.containerRow,
		maxWidth: 0.64 * Dimensions.get("window").width,
	},

	tosSide: {
		...general.container,
		minWidth: 0.16 * Dimensions.get("window").width,
		maxWidth: 0.16 * Dimensions.get("window").width,
		minHeight: 0.16 * Dimensions.get("window").width,
		maxHeight: 0.16 * Dimensions.get("window").width
	},

	tosText: {
		...general.container,
		alignItems: "flex-start",
		maxWidth: 0.5 * Dimensions.get("window").width
	},



	profilePicHolder: {
		...general.card,
		overflow: "hidden",
		minWidth: 0.7 * Dimensions.get("window").width,
		maxWidth: 0.7 * Dimensions.get("window").width,
		minHeight: 0.7 * Dimensions.get("window").width,
		maxHeight: 0.7 * Dimensions.get("window").width,
		margin: 0.04 * Dimensions.get("window").width,
		borderTopLeftRadius: 0.01 * Dimensions.get("window").width,
		borderTopRightRadius: 0.01 * Dimensions.get("window").width,
		borderBottomLeftRadius: 0.01 * Dimensions.get("window").width,
		borderBottomRightRadius: 0.2 * Dimensions.get("window").width,
		backgroundColor: settings.colors.white
	},

	profilePic: {
		width: 0.7 * Dimensions.get("window").width,
		height: 0.7 * Dimensions.get("window").width,
		resizeMode: "contain"
	},



	bioBox: {
		...input.multiLine,
		padding: 0.035 * Dimensions.get("window").width,
		paddingTop: 0.035 * Dimensions.get("window").width,
		paddingBottom: 0.035 * Dimensions.get("window").width,
	},


	task: {
		...general.container,
		position: "absolute",
		margin: 0.02 * Dimensions.get("window").width,
		width: 0.96 * Dimensions.get("window").width,
		minHeight: 2.0 * settings.fontsize.smallish,
		backgroundColor: settings.colors.white,
		borderRadius: 0.02 * Dimensions.get("window").width,
	},

	taskText: {
		...text.body,
		color: settings.colors.major,
		fontSize: settings.fontsize.smallish
	},


	welcome: {
		...general.container,
		width: 0.9 * Dimensions.get("window").width,
	},

	welcomeText: {
		...text.white
	}



});

export default lobby;
