import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';


const layout = settings.layout
const screenWidth = Dimensions.get("window").width

const margin = Math.round(screenWidth * layout.margin)
const separator = Math.round(2.0 * layout.border)

const noticeHeight = Math.round(screenWidth * layout.headerSize)
const buttonHeight = noticeHeight - (4 * margin)


const feed = StyleSheet.create({

	container: {
		...general.container,
		alignItems: "stretch",
		backgroundColor: settings.colors.neutral
	},

	list: {
		flex: 1,
		minWidth: screenWidth,
		maxWidth: screenWidth,
	},

	separator: {
		...general.container,
		maxHeight: separator,
		minHeight: separator,
	},

	spacer: {
		...general.container,
		minWidth: screenWidth,
		maxWidth: screenWidth,
		minHeight: noticeHeight,
		maxHeight: noticeHeight,
	},

	notice: {
		...general.container,
		justifyContent: "center",
		minHeight: noticeHeight,
		maxHeight: noticeHeight,
		minWidth: screenWidth,
		maxWidth: screenWidth,
		backgroundColor: "transparent",
	},

	noticeBackground: {
		...general.container,
		position: "absolute",
		top: 0,
		left: 0,
		justifyContent: "center",
		minHeight: noticeHeight,
		maxHeight: noticeHeight,
		minWidth: screenWidth,
		maxWidth: screenWidth,
		opacity: 0.2
	},

	noticeText: {
		...text.title,
		color: settings.colors.white,
		fontSize: settings.fontsize.normal,
	},

	button: {
		...general.container,
		alignSelf: "center",
		marginTop: margin,
		marginBottom: margin,
		minHeight: buttonHeight,
		maxHeight: buttonHeight,
		maxWidth: "60%",
		backgroundColor: settings.colors.white,
		borderRadius: buttonHeight,
	},

	buttonText: {
		...text.title,
		color: settings.colors.major,
		fontSize: settings.fontsize.normal,
	}


});

export default feed;
