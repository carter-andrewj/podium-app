import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';


const lobby = StyleSheet.create({

	container: {
		...general.container,
		backgroundColor: settings.colors.major
	},

	header: {
		...general.container,
		position: "absolute",
		flexDirection: "row",
		top: 0.07 * Dimensions.get("window").height,
		maxWidth: 0.8 * Dimensions.get("window").width,
		alignItems: "stretch",
		zIndex: 10
	},

	heading: {
		color: settings.colors.white,
		fontSize: settings.fontsize.normal,
		marginBottom: 0,
		paddingBottom: 0
	},


	showButton: {
		maxHeight: 0.06 * Dimensions.get("window").width,
	},

	showButtonText: {
		padding: 0.0 * Dimensions.get("window").width,
	},



	tos: {
		...general.container,
		minWidth: 0.9 * Dimensions.get("window").width,
		maxWidth: 0.9 * Dimensions.get("window").width,
		minHeight: 0.5 * Dimensions.get("window").height,
		maxHeight: 0.5 * Dimensions.get("window").height,
		margin: 0.05 * Dimensions.get("window").width,
		padding: 0.03 * Dimensions.get("window").width,
		backgroundColor: settings.colors.white
	},

	tosCheck: {
		...general.containerRow,
		width: 0.9 * Dimensions.get("window").width,
		minHeight: 0.2 * Dimensions.get("window").width,
		padding: 0.0 * Dimensions.get("window").width,
	},

	tosTouch: {
		...general.containerRow,
		maxWidth: 0.64 * Dimensions.get("window").width,
	},

	tosSide: {
		...general.container,
		minWidth: 0.16 * Dimensions.get("window").width,
		maxWidth: 0.16 * Dimensions.get("window").width,
		minHeight: 0.16 * Dimensions.get("window").width,
		maxHeight: 0.16 * Dimensions.get("window").width
	},

	tosText: {
		...general.container,
		alignItems: "flex-start",
		maxWidth: 0.5 * Dimensions.get("window").width
	},

	headerBox: {
		marginTop: 0.05 * Dimensions.get("window").height,
	},

	logoBox: {
		maxHeight: 0.6 * Dimensions.get("window").height,
	},

	logo: {
		flex: 1,
		width: 0.8 * Dimensions.get("window").width,
		minHeight: 0.51 * Dimensions.get("window").width,
		resizeMode: "contain",
		...general.card
	},

	versionNotice: {
		...general.text,
		fontSize: settings.fontsize.small,
		color: settings.colors.white,
		alignSelf: "center",
		margin: 0
	},

	signinBox: {
		alignSelf: "flex-end",
		maxHeight: 0.25 * Dimensions.get("window").height,
	},

	buttonBox: {
		flexDirection: "row",
		minHeight: 0.1 * Dimensions.get("window").height
	}

});

export default lobby;
