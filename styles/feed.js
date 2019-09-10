import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';


const screenHeight = Dimensions.get("window").height
const screenWidth = Dimensions.get("window").width


const separator = Math.round(4.0 * settings.layout.border)

const feedHeight = Math.round(screenHeight * (1.0 - settings.layout.headerSize))

const headerHeight = Math.round(screenHeight * settings.layout.headerSize)



const feed = StyleSheet.create({

	container: {
		...general.container,
		backgroundColor: settings.colors.neutral
	},

	list: {
		minWidth: screenWidth,
		maxWidth: screenWidth,
	},

	separator: {
		...general.container,
		maxHeight: separator,
		minHeight: separator,
		backgroundColor: "transparent"
	},

	header: {
		...general.containerRow,
		minWidth: screenWidth,
		height: headerHeight,
		backgroundColor: settings.colors.white,
	},

	footer: {
		...general.containerRow,
		minWidth: screenWidth,
		height: headerHeight,
		backgroundColor: settings.colors.white,
		borderTopWidth: settings.layout.border,
		borderColor: settings.colors.neutralPalest
	},

	placeholder: {
		...general.container,
		minHeight: feedHeight,
		maxHeight: feedHeight,
		minWidth: screenWidth,
		backgroundColor: settings.colors.white,
		paddingBottom: headerHeight
	},

	placeholderText: {
		...text.title,
	}


});

export default feed;
