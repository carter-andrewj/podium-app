import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';



const layout = settings.layout

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

const drawerWidth = Math.round(layout.drawerSize * screenWidth)

const margin = Math.round(layout.margin * screenWidth)

const headerHeight = Math.round(layout.headerSize * screenHeight)
const inputPadding = Math.round((headerHeight +
	layout.quickSearchIcon) * 0.5)

const buttonSize = Math.round(layout.button * screenWidth)

const resultHeight = Math.round((buttonSize * 2.0) + (margin * 2.5))
const resultPicture = resultHeight - (2 * margin)




const quickSearch = StyleSheet.create({

	container: {
		...general.container,
		flexGrow: 1,
		width: "100%",
	},

	header: {
		...general.containerRow,
		minHeight: headerHeight,
		maxHeight: headerHeight,
		padding: margin,
		borderBottomWidth: layout.border,
		borderColor: settings.colors.neutralPalest,
	},

	input: {
		width: "100%",
		height: "100%",
		marginTop: layout.border,
		paddingLeft: inputPadding,
		paddingRight: inputPadding,
		borderRadius: headerHeight,
		...text.body,
		fontSize: settings.fontsize.smallish,
		backgroundColor: settings.colors.neutralPale,
	},

	overlay: {
		...general.containerRow,
		position: "absolute",
		alignItems: "flex-start",
		width: drawerWidth - Math.round(0.5 * margin),
		left: 0,
		top: 0,
		bottom: 0,
		right: Math.round(0.5 * margin),
		backgroundColor: "transparent",
	},

	icon: {
		...general.container,
		height: headerHeight,
		maxWidth: headerHeight,
	},



	resultsContainer: {
		...general.container,
		alignSelf: "stretch",
		width: "100%",
	},

	resultList: {
		...general.flatList,
		minWidth: drawerWidth,
		maxWidth: drawerWidth,
		backgroundColor: settings.colors.neutral
	},

	result: {
		...general.containerRow,
		minHeight: resultHeight,
		maxHeight: resultHeight,
		minWidth: drawerWidth,
		maxWidth: drawerWidth,
		backgroundColor: settings.colors.white,
		borderBottomWidth: layout.border,
		borderColor: settings.colors.neutralPalest
	},

	resultLeft: {
		...general.container,
		alignSelf: "stretch",
		justifyContent: "space-between",
		minWidth: (margin * 2) + buttonSize,
		maxWidth: (margin * 2) + buttonSize,
		marginTop: margin,
		marginBottom: margin,
	},

	resultMiddle: {
		...general.container,
		flexGrow: 1,
		alignItems: "flex-end",
	},

	resultRight: {
		...general.container,
		minWidth: resultPicture,
		maxWidth: resultPicture,
		minHeight: resultPicture,
		maxHeight: resultPicture,
		margin: margin,
		borderBottomLeftRadius: Math.round(resultPicture * layout.corner),
		backgroundColor: settings.colors.neutral,
		overflow: "hidden"
	},

	resultPicture: {
		width: "100%",
		height: "100%"
	},



	empty: {
		...general.container,
		alignSelf: "stretch",
		alignContent: "stretch",
		width: "100%"
	},

	emptyText: {
		...text.title,
		color: settings.colors.white
	},


	trending: {
		...general.container,
		alignSelf: "stretch",
		backgroundColor: settings.colors.white
	}

	

})

export default quickSearch;