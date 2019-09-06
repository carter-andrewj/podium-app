import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';


const margin = 0.03
const picture = 0.18
const header = 0.06

const profile = StyleSheet.create({

	quickContainer: {
		...general.container,
		flexGrow: 0,
		minWidth: settings.layout.drawerSize *
			Dimensions.get("window").width,
		maxWidth: settings.layout.drawerSize *
			Dimensions.get("window").width,
		minHeight: ((picture + (2.0 * margin)) *
			Dimensions.get("window").width) +
			(settings.layout.headerSize *
				Dimensions.get("window").height),
		maxHeight: 0.4 * Dimensions.get("window").height,
		backgroundColor: settings.colors.white,
		borderTopWidth: settings.layout.border,
		borderRightWidth: settings.layout.border,
		borderColor: settings.colors.neutralPalest,
	},

	quickProfile: {
		...general.containerRow,
		alignItems: "stretch",
		minHeight: ((picture + (2.0 * margin)) *
			Dimensions.get("window").width),
		padding: margin * Dimensions.get("window").width,
	},

	quickContainerLeft: {
		...general.container,
		alignItems: "flex-start",
		justifyContent: "flex-start",
		minWidth: (picture + margin) *
			Dimensions.get("window").width,
		maxWidth: (picture + margin) *
			Dimensions.get("window").width,
	},

	quickPictureHolder: {
		...general.container,
		minWidth: picture * Dimensions.get("window").width,
		maxWidth: picture * Dimensions.get("window").width,
		minHeight: picture * Dimensions.get("window").width,
		maxHeight: picture * Dimensions.get("window").width,
		borderBottomRightRadius: settings.layout.corner *
			(picture * Dimensions.get("window").width),
		overflow: "hidden",
	},

	quickPicture: {
		width: "100%",
		height: "100%",
	},

	quickContainerRight: {
		...general.container,
		alignItems: "flex-start",
		marginRight: margin,
	},

	quickHeader: {
		...general.containerRow,
		alignItems: "flex-start",
		width: "100%",
		minHeight: header * Dimensions.get("window").width,
		maxHeight: header * Dimensions.get("window").width,
	},

	quickName: {
		...text.title,
		paddingBottom: 0,
		fontSize: settings.fontsize.normal,
	},

	quickIdentity: {
		...text.title,
		color: settings.colors.neutralDarkest,
		fontSize: settings.fontsize.small,
	},

	quickBody: {
		...general.containerRow,
		width: "100%",
		alignItems: "stretch",
		justifyContent: "stretch",
		flexGrow: 1,
	},

	quickBio: {
		...text.body,
		width: "100%",
		height: "100%",
		fontSize: settings.fontsize.small,
	},

	quickLinks: {
		...general.containerRow,
		minHeight: Dimensions.get("window").height *
			settings.layout.headerSize,
		maxHeight: Dimensions.get("window").height *
			settings.layout.headerSize,
	},


});

export default profile;
