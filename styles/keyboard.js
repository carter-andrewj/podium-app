import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';


const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

const keyboardHeight = 0.675
const autocompleteHeight = 0.08

const heightAbove = Math.round(keyboardHeight * screenHeight)
const heightBelow = Math.round((1.0 - keyboardHeight) * screenHeight)

const headerSize = Math.round(screenHeight * settings.layout.headerSize)
const autocompleteSize = Math.round(autocompleteHeight * screenHeight)



const keyboard = StyleSheet.create({

	above: {
		...general.container,
		minHeight: heightAbove,
		maxHeight: heightAbove,
	},

	aboveWithHeader: {
		...general.container,
		minHeight: heightAbove - headerSize,
		maxHeight: heightAbove - headerSize,
	},

	aboveWithHeaderWithAuto: {
		...general.container,
		minHeight: heightAbove - headerSize - autocompleteSize,
		maxHeight: heightAbove - headerSize - autocompleteSize,
	},

	below: {
		...general.container,
		minHeight: heightBelow,
		maxHeight: heightBelow,
	},

	belowWithAuto: {
		...general.container,
		minHeight: heightBelow + autocompleteSize,
		maxHeight: heightBelow + autocompleteSize,
	},

	floatAbove: {
		position: "absolute",
		bottom: heightBelow
	},

	floatAboveWithAuto: {
		position: "absolute",
		bottom: heightBelow + autocompleteSize,
	},


});

export default keyboard;
