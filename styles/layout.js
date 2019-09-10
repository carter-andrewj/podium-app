import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';
import input from './input';
import keyboard from './keyboard';


const layout = settings.layout

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

const drawerWidth = Math.round(screenWidth * layout.drawerSize)
const fullWidth = Math.round(screenWidth + (2.0 * drawerWidth))

const headerSize = Math.round(screenHeight * layout.headerSize)

const margin = Math.round(screenWidth * layout.margin)




const layoutOut = {

	container: {
		...general.container,
		flexDirection: "row",
		alignItems: "stretch",
		height: screenHeight,
		minWidth: fullWidth,
		maxWidth: fullWidth,
	},

	leftDrawer: {
		...general.container,
		minWidth: drawerWidth - layout.border,
		maxWidth: drawerWidth - layout.border,
		borderRightWidth: layout.border,
		borderColor: settings.colors.neutralPalest,
	},





	rightDrawer: {
		...general.container,
		justifyContent: "flex-start",
		minWidth: drawerWidth - layout.border,
		maxWidth: drawerWidth - layout.border,
		borderLeftWidth: layout.border,
		borderColor: settings.colors.neutralPalest,
	},

	rightFooter: {
		...keyboard.below,
		borderTopWidth: layout.border,
		borderColor: settings.colors.neutralPalest,
	},

	links: {
		...general.containerRow,
		alignSelf: "flex-end",
		alignItems: "flex-end",
		maxWidth: "100%",
		minHeight: headerSize,
		maxHeight: headerSize,
		borderTopWidth: 1,
		borderColor: settings.colors.neutralPalest,
	},

	signOut: {
		margin: 2 * margin,
		borderWidth: layout.border,
		borderColor: settings.colors.minor,
	},






	main: {
		...general.container,
		alignItems: "stretch",
		minWidth: screenWidth,
		maxWidth: screenWidth,
	},

	mainHeader: {
		...general.containerRow,
		alignContent: "space-between",
		minWidth: screenWidth,
		maxWidth: screenWidth,
		minHeight: headerSize,
		maxHeight: headerSize,
		backgroundColor: settings.colors.white,
		borderBottomWidth: layout.border,
		borderColor: settings.colors.neutralPalest
	},

	mainContent: {
		...general.container,
		flexGrow: 1,
		alignItems: "stretch",
	},

	content: {
		width: screenWidth,
		backgroundColor: settings.colors.neutral
	},

	cover: {
		position: "absolute",
		width: "100%",
		height: "100%"
	},




}

export default layoutOut;