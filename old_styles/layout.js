import { Constants } from 'expo';
import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';
import input from './input';


const layout = settings.layout
const screenWidth = Dimensions.get("window").width

const drawerWidth = Math.round(screenWidth * layout.drawerSize)
const fullWidth = Math.round(screenWidth + (2.0 * drawerWidth))

const headerSize = Math.round(screenWidth * layout.headerSize)

const margin = Math.round(screenWidth * layout.margin)




const HUD = {

	container: {
		...general.container,
		flexDirection: "row",
		minWidth: fullWidth,
		maxWidth: fullWidth,
	},

	leftDrawer: {
		...general.container,
		minWidth: drawerWidth,
		maxWidth: drawerWidth,
		borderRightWidth: layout.border,
		borderColor: settings.colors.neutralPalest,
	},





	rightDrawer: {
		...general.container,
		justifyContent: "flex-start",
		minWidth: drawerWidth,
		maxWidth: drawerWidth,
		borderLeftWidth: layout.border,
		borderColor: settings.colors.neutralPalest,
	},

	rightFooter: {
		...general.container,
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

export default HUD;