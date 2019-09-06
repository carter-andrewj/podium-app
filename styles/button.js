import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';




const button = StyleSheet.create({

	round: {
		borderRadius: Dimensions.get("window").width * 0.07,
	},

	text: {
		...text.title,
		fontSize: settings.fontsize.normal,
		padding: Dimensions.get("window").width * 0.04,
		paddingTop: Dimensions.get("window").width * 0.04,
		margin: 0
	},

	icon: {
		color: settings.colors.major
	},


	caption: {
		position: "absolute",
		width: 0.08 * Dimensions.get("window").width,
		right: -0.09 * Dimensions.get("window").width,
	},

	captionText: {
		...text.title,
		textAlign: "left",
		fontSize: settings.fontsize.smaller,
		fontWeight: 600,
		color: settings.colors.major,
		paddingBottom: 0
	}

})

export default button;