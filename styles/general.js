import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';


const container = {
	position: "relative",
	flex: 1,
	width: "100%",
	height: "auto",
	flexDirection: "column",
	backgroundColor: "transparent",
	alignItems: 'center',
	justifyContent: 'center',
	margin: 0,
	padding: 0,
}

const card = {
	shadowColor: settings.colors.neutralDark,
	shadowOpacity: 1.0,
	shadowRadius: 3,
	shadowOffset: {
		width: 0,
		height: 0
	}
}

const screen = {
	...container,
	minHeight: Dimensions.get("window").height,
	minWidth: Dimensions.get("window").width,
}


const general = StyleSheet.create({

	statusBar: {
		flex: 1,
		backgroundColor: settings.colors.major
	},

	container: container,

	screen: screen,

	spacer: {
		...container,
		flex: 1,
		flexGrow: 2,
		// backgroundColor: "cyan"
	},

	keyboardSpacer: {
		...container,
		minHeight: Dimensions.get("window").height * 0.35
	},

	containerRow: {
		...container,
		flex: 1,
		flexDirection: "row",
		width: 0.9 * Dimensions.get("window").width,
		justifyContent: "space-between",
		// backgroundColor: "purple"
	},

	shadow: {
		shadowRadius: 100,
		shadowColor: settings.colors.neutralDarkest
	},

	transparent: {
		opacity: 0.0
	},

	card: card,

});

export default general;
