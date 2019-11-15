import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';



const layout = settings.layout
const screenWidth = Dimensions.get("window").width

const drawerSize = Math.round(layout.drawerSize * screenWidth)

const headerSize = Math.round(layout.headerSize * screenWidth)

const margin = Math.round(screenWidth * layout.margin)

const titleWidth = Math.round(0.35 * drawerSize)

const alertHeight = Math.round(screenWidth * layout.alertSize)



const quickAlerts = StyleSheet.create({

	container: {
		...general.container,
		alignSelf: "stretch",
		justifyContent: "flex-start",
		backgroundColor: settings.colors.white,
	},

	header: {
		...general.containerRow,
		alignItems: "stretch",
		justifyContent: "flex-start",
		minWidth: drawerSize,
		maxWidth: drawerSize,
		minHeight: headerSize,
		maxHeight: headerSize,
		borderBottomWidth: layout.border,
		borderColor: settings.colors.neutralPalest,
	},

	title: {
		...general.container,
		alignSelf: "stretch",
		minWidth: titleWidth,
		maxWidth: titleWidth,
		paddingTop: margin,
	},

	titleText: {
		...text.title,
		fontSize: settings.fontsize.normal,
		marginLeft: margin,
	},



	filter: {
		...general.containerRow,
		flexGrow: 1,
		paddingTop: margin,
		paddingLeft: margin,
		paddingRight: 2 * margin,
	},


	listContainer: {
		...general.container,
		alignSelf: "stretch",
		alignItems: "stretch",
	},

	list: {
		...general.flatList,
		minWidth: drawerSize,
		maxWidth: drawerSize,
	},


	alert: {
		...general.containerRow,
		maxWidth: drawerSize - layout.border,
		maxHeight: alertHeight,
		borderBottomWidth: Math.round(layout.border / 2.0),
		borderColor: settings.colors.neutralPalest,
		padding: margin,
	},


	pictureHolder: {
		...general.container,
		minWidth: alertHeight - margin,
		maxWidth: alertHeight - margin,
		minHeight: alertHeight - margin,
		maxHeight: alertHeight - margin,
		borderBottomRightRadius: Math.round((alertHeight - margin) *
			layout.corner),
		overflow: "hidden",
	},

	picture: {
		width: "100%",
		height: "100%"
	},

	message: {
		...general.containerRow
	},

	messageText: {
		...text.body,
		paddingLeft: margin,
		fontSize: settings.fontsize.smaller
	},


	empty: {
		...general.container,
		alignSelf: "stretch",
		backgroundColor: settings.colors.neutral
	},

	emptyText: {
		...text.title,
		color: settings.colors.white
	},




});

export default quickAlerts;
