import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';



const layout = settings.layout

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

const inputWidth = Math.round(0.9 * screenWidth)
const inputHeight = Math.round(0.08 * screenHeight)
const multilineHeight = Math.round(0.3 * screenHeight)

const checkSize = Math.round(0.05 * screenWidth)

const margin = Math.round(layout.margin * screenWidth)



const input = StyleSheet.create({

	oneLine: {
		flex: 1,
		width: inputWidth,
		minHeight: inputHeight,
		maxHeight: inputHeight,
		backgroundColor: settings.colors.white,
		color: settings.colors.black,
		fontFamily: "Varela",
		fontSize: settings.fontsize.largish,
		textAlign: "center",
		margin: margin,
	},

	multiLine: {
		flex: 1,
		width: inputWidth,
		minHeight: multilineHeight,
		maxHeight: multilineHeight,
		backgroundColor: settings.colors.white,
		color: settings.colors.black,
		fontFamily: "Varela",
		fontSize: settings.fontsize.normal,
		textAlign: "left",
		margin: margin,
	},

	caption: {
		paddingBottom: settings.fontsize.normal
	},

	checkbox: {
		...general.container,
		minWidth: checkSize,
		maxWidth: checkSize,
		minHeight: checkSize,
		maxHeight: checkSize,
		backgroundColor: settings.colors.white,
		borderRadius: Math.round(0.1 * checkSize),
	},

	check: {

	}


});

export default input;
