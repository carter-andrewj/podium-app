import { StyleSheet, Dimensions } from 'react-native';

import config from './constants';


const container = {
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
	shadowColor: config.colors.neutralDark,
	shadowOpacity: 1.0,
	shadowRadius: 3,
	shadowOffset: {
		width: 0,
		height: 0
	}
}

const button = {
	flex: 0,
	alignItems: "center",
	justifyContent: "center",
	width: Dimensions.get("window").width * 0.46,
	height: Dimensions.get("window").width * 0.12,
	backgroundColor: config.colors.white,
	borderRadius: Dimensions.get("window").width * 0.12,
	margin: Dimensions.get("window").width * 0.02,
	padding: config.size.smallish,
	overflow: "hidden"
}


const screen = {
	...container,
	minHeight: Dimensions.get("window").height,
	minWidth: Dimensions.get("window").width,
}


const general = StyleSheet.create({

	statusBar: {
		flex: 1,
		backgroundColor: config.colors.major
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
		shadowColor: config.colors.neutralDarkest
	},

	card: card,

	button: button,

	buttonCard: {
		...button,
		...card
	},

});

export default general;
