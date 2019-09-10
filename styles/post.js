import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';



const layout = settings.layout

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

const margin = Math.round(screenWidth * layout.margin)

const postHeight = Math.round(screenHeight * layout.postHeight)

const postWidth = screenWidth - (2 * margin)
const overlap =  Math.round((screenWidth * layout.postWingOverlap) - (2 * margin))
const wingWidth = Math.round((screenWidth * (layout.postWing - (3.0 * layout.margin))) - 
	overlap - margin)

const fullWidth = postWidth + (2 * wingWidth) + (4 * margin)

const headerHeight = Math.round(screenHeight * layout.postHeader)
const reactorWidth = Math.round(screenWidth * layout.postReactor)

const contentWidth = screenWidth - (2 * overlap) - (4 * margin)
const contentHeight = postHeight - headerHeight - (2 * margin)

const buttonSize = Math.round(overlap * 0.5)




const column = {
	...general.container,
	alignItems: "flex-start",
	margin: margin,
}


const wing = {
	...column,
	minWidth: wingWidth,
	maxWidth: wingWidth,
}


const post = StyleSheet.create({

	window: {
		...general.container,
		minWidth: screenWidth - 2,
		maxWidth: screenWidth - 2,
		backgroundColor: "transparent",
	},

	container: {
		...general.container,
		minHeight: postHeight,
	},

	columns: {
		...general.containerRow,
		alignItems: "flex-start",
		minWidth: fullWidth,
		maxWidth: fullWidth,
		// border: layout.border,
		// borderColor: settings.colors.neutralPalest,
		backgroundColor: settings.colors.white
	},

	columnLeft: {
		...wing,
		marginRight: 0,
		backgroundColor: "pink"
	},

	columnMiddle: {
		...column,
		flexDirection: "row",
		justifyContent: "space-between",
		minWidth: postWidth,
		maxWidth: postWidth,
	},

	columnRight: {
		...wing,
		marginLeft: 0,
		backgroundColor: "orange"
	},


	coreLeft: {
		...general.container,
		alignItems: "flex-start",
		minWidth: overlap,
		maxWidth: overlap,
	},

	profilePictureHolder: {
		width: overlap,
		height: overlap,
		borderBottomRightRadius: Math.round(layout.corner * overlap),
		overflow: "hidden"
	},

	profilePicture: {
		width: "100%",
		height: "100%"
	},


	core: {
		...general.container,
		alignItems: "flex-start",
		minWidth: contentWidth + margin + overlap,
		maxWidth: contentWidth + margin + overlap,
	},

	header: {
		...general.containerRow,
		minHeight: headerHeight,
		maxHeight: headerHeight,
		width: "100%",
	},

	title: {
		...general.containerRow,
		alignItems: "flex-end",
		justifyContent: "flex-start"
	},

	authorName: {
		...text.title,
		fontSize: settings.fontsize.smallish,
		paddingBottom: 0
	},

	authorRest: {
		...text.title,
		fontSize: settings.fontsize.smaller,
		color: settings.colors.neutralDarkest,
		paddingBottom: 0,
		paddingLeft: Math.round(settings.fontsize.smaller * 0.5),
	},

	reactionHolder: {
		...general.container,
		alignSelf: "flex-end",
		minWidth: reactorWidth,
		maxWidth: reactorWidth,
		height: "100%",
		backgroundColor: "pink"
	},


	body: {
		...general.containerRow,
		alignItems: "stretch",
		width: "100%",
		minHeight: contentHeight,
		maxHeight: contentHeight,
	},

	bodyText: {
		...text.body,
		minWidth: contentWidth,
		maxWidth: contentWidth,
		minHeight: contentHeight - margin,
		fontSize: settings.fontsize.small,
		padding: Math.round(margin * 0.5),
		paddingBottom: 0
	},



	coreRight: {
		...general.container,
		justifyContent: "space-between",
		minWidth: overlap,
		maxWidth: overlap,
	},

	buttonHolder: {
		...general.containerRow,
		justifyContent: "flex-end",
		minWidth: overlap,
		maxWidth: overlap,
		minHeight: buttonSize,
		maxHeight: buttonSize,
	},

	button: {
		...general.container,
		alignSelf: "stretch",
		minWidth: buttonSize,
		maxWidth: buttonSize,
		minHeight: buttonSize,
		maxHeight: buttonSize,
	},

	counter: {
		...text.title,
		width: "100%",
		paddingBottom: 0,
		paddingRight: Math.round(settings.fontsize.tiny * 0.5),
		textAlign: "right",
		fontSize: settings.fontsize.tiny,
	}


});

export default post;
