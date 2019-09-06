import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';



const wingWidth = Dimensions.get("window").width *
		(settings.layout.postWing - settings.layout.postWingOverlap)
const margin = Dimensions.get("window").width *
	settings.layout.postMargin

const column = {
	...general.container,
	alignItems: "flex-start",
	minWidth: Dimensions.get("window").width - (2.0 * margin),
	maxWidth: Dimensions.get("window").width - (2.0 * margin),
	margin: margin,
}


const wing = {
	...column,
	minWidth: wingWidth - margin,
	maxWidth: wingWidth - margin,
}


const post = StyleSheet.create({

	window: {
		...general.container,
		maxWidth: Dimensions.get("window").width,
		backgroundColor: settings.colors.neutralPalest,
	},

	container: {
		...general.container,
		minHeight: settings.layout.postHeight *
			Dimensions.get("window").height,
	},

	columns: {
		...general.containerRow,
		alignItems: "flex-start",
		minWidth: Dimensions.get("window").width +
			(2.0 * wingWidth),
		maxWidth: Dimensions.get("window").width +
			(2.0 * wingWidth),
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
		width: Dimensions.get("window").width,
	},

	columnRight: {
		...wing,
		marginLeft: 0,
		backgroundColor: "orange"
	},


	coreLeft: {
		...general.container,
		alignItems: "flex-start",
		minWidth: Dimensions.get("window").width *
			settings.layout.postWingOverlap,
		maxWidth: Dimensions.get("window").width *
			settings.layout.postWingOverlap,
	},

	profilePictureHolder: {
		width: (Dimensions.get("window").width
			* settings.layout.postWingOverlap) - margin,
		height: (Dimensions.get("window").width
			* settings.layout.postWingOverlap) - margin,
		borderBottomRightRadius: settings.layout.corner *
			((Dimensions.get("window").width *
			  settings.layout.postWingOverlap) - margin),
		overflow: "hidden"
	},

	profilePicture: {
		width: "100%",
		height: "100%"
	},


	core: {
		...general.container,
		alignItems: "flex-start",
		minWidth: (Dimensions.get("window").width *
			(1.0 - settings.layout.postWingOverlap)) - (2.0 * margin),
		maxWidth: (Dimensions.get("window").width *
			(1.0 - settings.layout.postWingOverlap)) - (2.0 * margin),
	},

	header: {
		...general.containerRow,
		minHeight: settings.layout.postHeader * Dimensions.get("window").width,
		maxHeight: settings.layout.postHeader * Dimensions.get("window").width,
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
		fontWeight: 600,
		paddingBottom: 0
	},

	authorRest: {
		...text.title,
		fontSize: settings.fontsize.smaller,
		color: settings.colors.neutralDarkest,
		paddingBottom: 0,
		paddingLeft: 4,
	},

	reactionHolder: {
		...general.container,
		alignSelf: "flex-end",
		minWidth: settings.layout.postReactor *
			Dimensions.get("window").width,
		maxWidth: settings.layout.postReactor *
			Dimensions.get("window").width,
		height: "100%",
		backgroundColor: "pink"
	},


	body: {
		...general.containerRow,
		flexGrow: 1,
		alignItems: "flex-start",
		marginTop: margin * 0.5,
		width: "100%"
	},

	bodyText: {
		...text.body,
		minWidth: (Dimensions.get("window").width *
			(1.0 - (2.0 * settings.layout.postWingOverlap))) -
			(2.0 * margin),
		maxWidth: (Dimensions.get("window").width *
			(1.0 - (2.0 * settings.layout.postWingOverlap))) -
			(2.0 * margin),
		minHeight: Dimensions.get("window").height *
			(settings.layout.postHeight -
				settings.layout.postHeader),
		fontSize: settings.fontsize.small,
		paddingLeft: margin * 0.5,
	},



	coreRight: {
		...general.container,
		justifyContent: "space-between",
		minWidth: (Dimensions.get("window").width *
			settings.layout.postWingOverlap) - margin,
		maxWidth: (Dimensions.get("window").width *
			settings.layout.postWingOverlap) - margin,
		height: "100%",
	},

	buttonHolder: {
		...general.containerRow,
		justifyContent: "flex-end",
		maxWidth: "100%",
		maxHeight: Dimensions.get("window").width *
			(settings.layout.postWingOverlap * 0.5),
		marginTop: margin
	},

	button: {
		...general.container,
		alignSelf: "stretch",
		minWidth: Dimensions.get("window").width *
			(settings.layout.postWingOverlap * 0.5),
		maxWidth: Dimensions.get("window").width *
			(settings.layout.postWingOverlap * 0.5),
		minHeight: Dimensions.get("window").width *
			(settings.layout.postWingOverlap * 0.5),
		maxHeight: Dimensions.get("window").width *
			(settings.layout.postWingOverlap * 0.5),
	},

	counter: {
		...text.title,
		width: "100%",
		paddingBottom: 0,
		paddingRight: settings.fontsize.tiny * 0.5,
		fontWeight: 600,
		textAlign: "right",
		fontSize: settings.fontsize.tiny,
	}


});

export default post;
