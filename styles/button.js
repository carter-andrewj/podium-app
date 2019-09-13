import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';


const layout = settings.layout

const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get("window").width

const buttonSize = Math.round(layout.button * screenWidth)




const container = {
	...general.container,
	minWidth: buttonSize - 2.0,
	maxWidth: buttonSize - 2.0,
	minHeight: buttonSize - 2.0,
	maxHeight: buttonSize - 2.0,
	borderWidth: 1.0,
}

const button = StyleSheet.create({

	// round: {
	// 	borderRadius: Dimensions.get("window").width * 0.07,
	// },

	// text: {
	// 	...text.title,
	// 	fontSize: settings.fontsize.normal,
	// 	padding: Dimensions.get("window").width * 0.04,
	// 	paddingTop: Dimensions.get("window").width * 0.04,
	// 	margin: 0
	// },

	// icon: {
	// 	color: settings.colors.major
	// },


	// caption: {
	// 	position: "absolute",
	// 	width: 0.08 * Dimensions.get("window").width,
	// 	right: -0.09 * Dimensions.get("window").width,
	// },

	// captionText: {
	// 	...text.title,
	// 	textAlign: "left",
	// 	fontSize: settings.fontsize.smaller,
	// 	color: settings.colors.major,
	// 	paddingBottom: 0
	// },



	// loading: {
	// 	...general.container,
	// },



	container: container,

	loading: {
		...container,
		backgroundColor: settings.colors.neutral,
		borderColor: settings.colors.neutral,
	},

	label: {
		...text.body,
		fontSize: settings.fontsize.tiny,
		color: settings.colors.major,
	},


	followOn: {
		backgroundColor: settings.colors.major,
		borderColor: settings.colors.major,
	},

	followOff: {
		backgroundColor: settings.colors.white,
		borderColor: settings.colors.major,
	},


})

export default button;