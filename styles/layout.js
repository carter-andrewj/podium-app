import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';
import input from './input';



const floatButton = {
	...general.container,
	...general.card,
	position: "absolute",
	width: Dimensions.get("window").width * 0.15,
	height: Dimensions.get("window").width * 0.15,
	top: 0.02 * Dimensions.get("window").width,
}



const layout = {

	container: {
		...general.container,
		flexDirection: "row",
		height: Dimensions.get("window").height,
		width: Dimensions.get("window").width *
			(1.0 + 2.0 * settings.layout.drawerSize),
	},

	leftDrawer: {
		...general.container,
		width: Dimensions.get("window").width *
			settings.layout.drawerSize,
		height: "100%",
	},




	searchLinks: {
		...general.containerRow,
		maxHeight: Dimensions.get("window").height *
			settings.layout.headerSize,
		borderLeftWidth: settings.layout.border,
		borderColor: settings.colors.neutralPalest
	},



	rightDrawer: {
		...general.container,
		width: Dimensions.get("window").width *
			settings.layout.drawerSize,
		height: "100%",
	},



	search: {
		...general.container,
		width: "100%",
		maxHeight: Dimensions.get("window").height *
			settings.layout.headerSize * 0.8,
		padding: 0.025 * Dimensions.get("window").width,
		borderLeftWidth: settings.layout.border,
		borderColor: settings.colors.neutralPalest
	},

	searchInput: {
		width: "100%",
		height: "100%",
		backgroundColor: settings.colors.neutralPale,
		paddingLeft: (Dimensions.get("window").height *
			settings.layout.headerSize * 0.8) -
			(0.05 * Dimensions.get("window").width),
		paddingRight: (Dimensions.get("window").height *
			settings.layout.headerSize * 0.8) -
			(0.05 * Dimensions.get("window").width),
		borderRadius: "100%"
	},

	searchOverlay: {
		...general.containerRow,
		position: "absolute",
		alignItems: "flex-start",
		left: 0,
		top: 0,
		bottom: 0,
		right: 0,
		backgroundColor: "transparent",
	},

	searchIcon: {
		...general.container,
		height: Dimensions.get("window").height *
			settings.layout.headerSize * 0.8,
		maxWidth: Dimensions.get("window").height *
			settings.layout.headerSize * 0.8,
	},

	results: {
		...general.container,
		flexGrow: 1,
		alignItems: "stretch",
		borderLeftWidth: settings.layout.border,
		borderColor: settings.colors.neutralPalest
	},




	main: {
		...general.container,
		alignItems: "stretch",
		minWidth: Dimensions.get("window").width,
		maxWidth: Dimensions.get("window").width,
	},

	mainHeader: {
		...general.containerRow,
		alignContent: "space-between",
		minWidth: Dimensions.get("window").width,
		maxWidth: Dimensions.get("window").width,
		minHeight: Dimensions.get("window").height *
			settings.layout.headerSize,
		maxHeight: Dimensions.get("window").height *
			settings.layout.headerSize,
		backgroundColor: settings.colors.white,
		borderBottomWidth: settings.layout.border,
		borderColor: settings.colors.neutralPalest
	},

	mainContent: {
		...general.container,
		flexGrow: 1,
		alignItems: "stretch",
	},

	notifButton: {
		...floatButton,
		left: 0.02 * Dimensions.get("window").width
	},

	searchButton: {
		...floatButton,
		right: 0.02 * Dimensions.get("window").width
	},

	content: {
		width: Dimensions.get("window").width,
		backgroundColor: settings.colors.neutral
	},

	cover: {
		position: "absolute",
		width: "100%",
		height: "100%"
	},

	signOut: {
		margin: 0.04 * Dimensions.get("window").width,
		borderWidth: 2,
		borderColor: settings.colors.minor,
		transform: [{
			translateY: -0.04 * Dimensions.get("window").width,
		}]
	}


}

export default layout;