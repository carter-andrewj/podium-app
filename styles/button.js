import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';


const layout = settings.layout
const screenWidth = Dimensions.get("window").width

const buttonSize = Math.round(layout.button * screenWidth)




const container = {
	...general.container,
	minWidth: buttonSize,
	maxWidth: buttonSize,
	minHeight: buttonSize,
	maxHeight: buttonSize,
	borderWidth: 1.0,
}

const button = StyleSheet.create({

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