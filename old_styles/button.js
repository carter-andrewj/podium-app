import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';


const layout = settings.layout
const screenWidth = Dimensions.get("window").width

const margin = Math.round(screenWidth * layout.margin)

const buttonSize = Math.round(layout.button * screenWidth)

const menuButtonSize = Math.round(1.6 * buttonSize)



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


	menuButton: {
		...general.containerRow,
		minHeight: menuButtonSize,
		maxHeight: menuButtonSize,
		marginBottom: Math.round(1.6 * margin),
		marginLeft: margin,
	},

	menuIcon: {
		...general.container,
		minHeight: menuButtonSize,
		maxHeight: menuButtonSize,
		minWidth: menuButtonSize,
		maxWidth: menuButtonSize,
	},

	menuCaption: {
		...general.container,
		minWidth: 2 * menuButtonSize,
		maxWidth: 2 * menuButtonSize,
	},

	menuTitle: {
		...text.title,
		fontSize: settings.fontsize.tiny,
		lineHeight: settings.fontsize.smallish,
		color: settings.colors.neutralDarkest,
		textAlign: "left",
	},

	menuText: {
		...text.body,
		width: "100%",
		padding: 0,
		paddingLeft: 2 * margin,
		paddingBottom: settings.fontsize.tiny,
		textAlign: "left",
	}


})

export default button;