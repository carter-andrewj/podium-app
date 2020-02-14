import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';



const layout = settings.layout
const screenWidth = Dimensions.get("window").width

const drawerWidth = Math.round(layout.drawerSize * screenWidth)

const margin = Math.round(layout.margin * screenWidth)
const edge = Math.round(layout.screenMargin * screenWidth)

const headerHeight = Math.round(layout.searchHeight * screenWidth)
const inputPadding = Math.round((headerHeight + layout.searchIcon) * 0.5)

const buttonSize = Math.round(layout.button * screenWidth)

const resultWidth = drawerWidth - (2 * (edge + layout.border)) - 1
const resultHeight = Math.round((buttonSize * 2.0) + (margin * 2.5))

const resultPicture = resultHeight - (2 * margin)

const counterHeight = headerHeight - (2 * margin)

const footerHeight = Math.round((screenWidth * layout.postHeader) * 0.5) + margin
const footerWidth = Math.round(4.0 * screenWidth * layout.button) + margin


const icon = {
	...general.container,
	height: headerHeight,
	minWidth: headerHeight,
	maxWidth: headerHeight,
}


const quickSearch = StyleSheet.create({

	container: {
		...general.container,
	},

	header: {
		...general.containerRow,
		minHeight: headerHeight,
		maxHeight: headerHeight,
	},

	input: {
		width: "100%",
		height: "100%",
		borderRadius: headerHeight,
		...text.body,
		padding: headerHeight,
		paddingTop: 0,
		paddingBottom: 0, 
		fontSize: settings.fontsize.smallish,
		backgroundColor: settings.colors.white,
		borderWidth: layout.border,
		borderColor: settings.colors.neutral
	},

	overlay: {
		...general.containerRow,
		position: "absolute",
		alignItems: "flex-start",
		left: 0,
		top: 0,
		bottom: 0,
		right: 0,
	},

	icon: icon,

	iconLeft: {
		...icon,
		alignSelf: "flex-start",
	},

	iconRight: {
		...icon,
		alignSelf: "flex-end",
	},

	iconOver: {
		...general.container,
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0
	},



	resultsContainer: {
		...general.container,
		alignSelf: "stretch",
		overflow: "hidden",
		minWidth: drawerWidth,
		maxWidth: drawerWidth,
		marginTop: edge,
		transform: [{ translateX: -1 * edge }]
	},

	resultList: {
		...general.flatList,
		minWidth: drawerWidth,
		maxWidth: drawerWidth,
		paddingLeft: edge,
		paddingRight: edge,
	},

	result: {
		...general.containerRow,
		minHeight: resultHeight,
		maxHeight: resultHeight,
		minWidth: resultWidth,
		maxWidth: resultWidth,
		padding: margin,
		backgroundColor: settings.colors.white,
		borderWidth: layout.border,
		borderColor: settings.colors.neutralPale,
		overflow: "hidden",
	},

	resultLeft: {
		...general.container,
		alignSelf: "stretch",
		justifyContent: "space-between",
		minWidth: buttonSize,
		maxWidth: buttonSize,
	},

	resultMiddle: {
		...general.container,
		flexGrow: 1,
		alignItems: "flex-end",
		justifyContent: "space-between",
		marginLeft: margin,
		marginRight: margin,
	},

	resultRight: {
		...general.container,
		minWidth: resultPicture,
		maxWidth: resultPicture,
		minHeight: resultPicture,
		maxHeight: resultPicture,
	},

	resultHeader: {
		...general.container,
		alignItems: "flex-end",
	},

	resultFooter: {
		...general.containerRow,
		justifyContent: "space-between",
		alignSelf: "flex-end",
		minWidth: footerWidth,
		maxWidth: footerWidth,
		maxHeight: footerHeight,
		minHeight: footerHeight,
	},




	counter: {
		...general.container,
		minHeight: counterHeight,
		maxHeight: counterHeight,
		marginBottom: margin,
	},

	counterText: {
		...text.title,
		color: settings.colors.neutralDark,
		fontSize: settings.fontsize.normal
	},


	

})

export default quickSearch;