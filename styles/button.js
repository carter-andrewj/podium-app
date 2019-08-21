import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';



const box = {
	...general.container,
	minWidth: Dimensions.get("window").width * 0.14,
	minHeight: Dimensions.get("window").width * 0.14,
	maxHeight: Dimensions.get("window").width * 0.14,
}


const button = StyleSheet.create({

	box: box,

	round: {
		...box,
		borderRadius: Dimensions.get("window").width * 0.07,
	},

	text: {
		...text.title,
		fontSize: settings.fontsize.normal,
		padding: Dimensions.get("window").width * 0.04,
		paddingTop: Dimensions.get("window").width * 0.035,
		margin: 0
	},

	icon: {
		color: settings.colors.major
	}

})

export default button;