import { StyleSheet, Dimensions } from 'react-native';
import { Constants } from 'expo';

import settings from '../settings';
import general from './general';
import text from './text';


const layout = settings.layout

const screenWidth = Dimensions.get("window").width

const margin = Math.round(screenWidth * layout.margin)
const corners = Math.round(margin / 2.0)

const taskWidth = Math.round(screenWidth - (2.0 * margin))
const taskHeight = Math.round(settings.fontsize.tiny + (2.0 * margin))

const containerHeight = 3 * (taskHeight + margin)


const tasks = StyleSheet.create({

	container: {
		...general.container,
		width: null,
		alignSelf: "flex-end",
		alignItems: "flex-end",
		alignContent: "flex-end",
		justifyContent: "flex-end",
		position: "absolute",
		right: 0,
		left: 0,
		bottom: margin,
		padding: margin
	},


	box: {
		...general.container,
		alignSelf: "flex-end",
		flexDirection: "row",
		minHeight: taskHeight,
		maxHeight: taskHeight,
		backgroundColor: settings.colors.major,
		borderRadius: corners,
		marginTop: corners,
	},

	message: {
		...general.container,
		flexDirection: "row",
		minHeight: taskHeight,
		maxHeight: taskHeight,
		justifyContent: "flex-start",
	},

	text: {
		...text.body,
		fontSize: settings.fontsize.smaller,
		color: settings.colors.white,
		paddingLeft: margin,
	},

	iconHolder: {
		...general.container,
		flexDirection: "row",
		position: "relative",
		minWidth: taskHeight,
		maxWidth: taskHeight,
		minHeight: taskHeight,
		maxHeight: taskHeight,
		paddingRight: margin,
	},

	icon: {
		position: "absolute",
		alignSelf: "center",
	}

});

export default tasks;
