import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';


const alerts = StyleSheet.create({

	quickContainer: {
		...general.container,
		flexGrow: 1,
		alignItems: "stretch",
		justifyContent: "stretch",
		borderRightWidth: settings.layout.border,
		borderColor: settings.colors.neutralPalest,
		backgroundColor: settings.colors.white
	},

	quickHeader: {
		...general.containerRow,
		alignItems: "stretch",
		justifyContent: "flex-start",
		minWidth: settings.layout.drawerSize *
			Dimensions.get("window").width,
		maxWidth: settings.layout.drawerSize *
			Dimensions.get("window").width,
		minHeight: settings.layout.headerSize *
			Dimensions.get("window").height,
		maxHeight: settings.layout.headerSize *
			Dimensions.get("window").height,
		borderBottomWidth: settings.layout.border,
		borderColor: settings.colors.neutralPalest,
	},

	quickTitle: {
		...general.container,
		alignItems: "flex-start",
		justifyContent: "flex-end",
		minWidth: 0.3 * settings.layout.drawerSize *
			Dimensions.get("window").width,
		maxWidth: 0.3 * settings.layout.drawerSize *
			Dimensions.get("window").width,
	},

	quickTitleText: {
		...text.title,
		fontSize: settings.fontsize.normal,
		textAlign: "left",
		fontWeight: 500,
		marginLeft: 0.05 * Dimensions.get("window").width,
	},

	quickFilter: {
		...general.containerRow,
		flexGrow: 1,
		paddingTop: 0.01 * settings.layout.drawerSize *
			Dimensions.get("window").height,
		paddingLeft: 0.04 * Dimensions.get("window").width,
		paddingRight: 0.07 * Dimensions.get("window").width,
	},


	quickListContainer: {
		...general.container,
		flexGrow: 1,
	},

	quickList: {
		...general.container,
		flexGrow: 1,
		alignItems: "flex-start",
		justifyContent: "stretch",
		maxWidth: settings.layout.drawerSize *
			Dimensions.get("window").width,
	},


	quickAlert: {
		...general.containerRow,
		maxWidth: settings.layout.drawerSize *
			Dimensions.get("window").width - settings.layout.border,
		maxHeight: 0.14 * Dimensions.get("window").width,
		borderBottomWidth: settings.layout.border / 2.0,
		borderColor: settings.colors.neutralPalest,
		padding: 0.02 * Dimensions.get("window").width,
	},


	quickAlertPictureHolder: {
		...general.container,
		minWidth: 0.1 * Dimensions.get("window").width,
		maxWidth: 0.1 * Dimensions.get("window").width,
		minHeight: 0.1 * Dimensions.get("window").width,
		maxHeight: 0.1 * Dimensions.get("window").width,
		borderBottomRightRadius: 0.03 * Dimensions.get("window").width,
		overflow: "hidden",
		backgroundColor: "orange"
	},

	quickAlertPicture: {
		width: "100%",
		height: "100%"
	},

	quickAlertMessage: {
		...general.containerRow
	},

	quickAlertText: {
		...text.body,
		paddingLeft: 0.02 * Dimensions.get("window").width,
		fontSize: settings.fontsize.smaller
	},


	quickFooter: {
		...general.containerRow,
		minHeight: 0.05 * Dimensions.get("window").height,
		maxHeight: 0.05 * Dimensions.get("window").height,
		maxWidth: "100%"
	},


});

export default alerts;
