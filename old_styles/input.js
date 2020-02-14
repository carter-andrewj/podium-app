import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';



const layout = settings.layout

const screenWidth = Dimensions.get("window").width

const margin = Math.round(layout.margin * screenWidth)
const edge = Math.round(layout.screenMargin * screenWidth)

const inputWidth = Math.round(screenWidth - (2.0 * edge))
const inputHeight = Math.round(layout.inputHeight * screenWidth)
const multilineHeight = Math.round(layout.multilineHeight * screenWidth)

const checkSize = Math.round(layout.checkBox * screenWidth)





const input = StyleSheet.create({

	oneLine: {
		flex: 1,
		width: inputWidth,
		minHeight: inputHeight,
		maxHeight: inputHeight,
		backgroundColor: settings.colors.white,
		color: settings.colors.black,
		borderColor: settings.colors.neutralDark,
		borderWidth: layout.border,
		fontFamily: "Varela",
		fontSize: settings.fontsize.largish,
		textAlign: "center",
		margin: edge,
		marginTop: 0,
		marginBottom: 0
	},

	multiLine: {
		flex: 1,
		width: inputWidth,
		minHeight: multilineHeight,
		maxHeight: multilineHeight,
		backgroundColor: settings.colors.white,
		color: settings.colors.black,
		borderColor: settings.colors.neutralDark,
		borderWidth: layout.border,
		fontFamily: "Varela",
		fontSize: settings.fontsize.normal,
		textAlign: "left",
		padding: 2 * margin,
		paddingTop: 2 * margin,
		paddingBottom: 2 * margin,
		margin: edge,
		marginTop: 0,
		marginBottom: Math.round(0.5 * margin)
	},

	caption: {
		...general.container,
		transform: [{ translateY: -1.5 * margin }]
	},

	checkbox: {
		...general.container,
		alignSelf: "center",
		minWidth: checkSize,
		maxWidth: checkSize,
		minHeight: checkSize,
		maxHeight: checkSize,
		backgroundColor: settings.colors.white,
		borderWidth: layout.border,
		borderColor: settings.colors.neutralDark,
		borderRadius: Math.round(0.1 * checkSize),
	},

	check: {

	}


});

export default input;
