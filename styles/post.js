import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';



const layout = settings.layout
const screenWidth = Dimensions.get("window").width

const margin = Math.round(screenWidth * layout.margin)

const buttonSize = Math.round(screenWidth * layout.button)

const postWidth = screenWidth - (2 * margin)
const overlap = 2 * buttonSize
const wingWidth = Math.round((screenWidth * (layout.postWing - (3.0 * layout.margin))) - 
	overlap - margin)

const fullWidth = postWidth + (2 * wingWidth) + (4 * margin)

const headerHeight = Math.round(screenWidth * layout.postHeader)
const reactorWidth = Math.round(screenWidth * layout.postReactor)

const postHeight = headerHeight + (2 * buttonSize) + (4 * margin)
const bodyHeight = Math.round(postHeight - (1.5 * margin))

const gaugeHeight = Math.round((postHeight - overlap - (3 * margin)) * 0.5)

const contentWidth = screenWidth - (2 * overlap) - (4 * margin)
const contentHeight = (2 * buttonSize) + margin

const edgeWidth = Math.round((overlap * 0.5) + margin)





const column = {
	...general.container,
	flexDirection: "row",
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
		minWidth: screenWidth,
		maxWidth: screenWidth,
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
		backgroundColor: settings.colors.white
	},




	columnLeft: {
		...wing,
		marginRight: 0,
	},

	leftEdge: {
		...general.container,
		minHeight: bodyHeight,
		maxHeight: bodyHeight,
		minWidth: edgeWidth,
		maxWidth: edgeWidth,
		justifyContent: "space-between",
		paddingTop: Math.round(margin * 0.5),
		paddingBottom: Math.round(margin * 0.5),
	},

	left: {
		...general.container,
		alignItems: "stretch",
		justifyContent: "flex-start",
		width: "100%",
		minHeight: bodyHeight,
		maxHeight: bodyHeight,
		paddingLeft: margin,
		paddingRight: margin,
	},

	bio: {
		...text.body,
		width: "100%",
		minHeight: contentHeight - margin,
		fontSize: settings.fontsize.smaller,
		padding: Math.round(margin * 0.5),
	},




	columnMiddle: {
		...column,
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
		overflow: "hidden",
		marginBottom: Math.round(margin * 0.5),
	},

	profilePicture: {
		width: "100%",
		height: "100%"
	},

	gauge: {
		...general.containerRow,
		justifyContent: "space-evenly",
		minHeight: gaugeHeight,
		maxHeight: gaugeHeight,
		minWidth: overlap,
		maxWidth: overlap,
		marginTop: Math.round(margin * 0.5),
		borderRadius: gaugeHeight
	},

	gaugeText: {
		...text.title,
		color: settings.colors.white,
		fontSize: settings.fontsize.tiny,
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
	},


	body: {
		...general.containerRow,
		alignItems: "stretch",
		width: "100%",
		minHeight: contentHeight + margin,
		maxHeight: contentHeight + margin,
	},

	bodyText: {
		...text.body,
		minWidth: contentWidth,
		maxWidth: contentWidth,
		minHeight: contentHeight - margin,
		fontSize: settings.fontsize.small,
		padding: Math.round(margin * 0.5),
		paddingBottom: 0,
	},



	coreRight: {
		...general.container,
		justifyContent: "space-between",
		minWidth: overlap,
		maxWidth: overlap,
		marginTop: margin,
	},

	buttonHolder: {
		...general.containerRow,
		justifyContent: "center",
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
