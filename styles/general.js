import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';


const container = {
	position: "relative",
	flex: 1,
	flexBasis: "auto",
	width: "100%",
	height: "auto",
	flexDirection: "column",
	backgroundColor: "transparent",
	alignSelf: "stretch",
	alignItems: 'center',
	justifyContent: 'center',
	alignContent: "center",
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
	},
	elevation: 4
}

const screen = {
	...container,
	alignSelf: "stretch",
	minWidth: Dimensions.get("window").width,
	backgroundColor: settings.colors.major,
}


const general = StyleSheet.create({

	statusBar: {
		flex: 1,
		backgroundColor: settings.colors.white,
		color: settings.colors.white
	},

	container: container,

	screen: screen,

	spacer: {
		...container,
		flex: 1,
		flexGrow: 2,
	},

	containerRow: {
		...container,
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},

	flatList: {
		...container,
		flexGrow: 1,
		justifyContent: "flex-start",
	},

});

export default general;
