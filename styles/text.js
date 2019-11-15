import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';


const layout = settings.layout
const screenWidth = Dimensions.get("window").width

const margin = Math.round(screenWidth * layout.margin)


const body = {
	fontFamily: settings.fonts.body,
	fontSize: settings.fontsize.normal,
	color: settings.colors.black,
	textAlign: "left",
	padding: 0,
	margin: 0,
}

const title = {
	fontFamily: settings.fonts.titles,
	fontSize: settings.fontsize.largish,
	color: settings.colors.major,
	textAlign: "center",
	padding: 0,
	margin: 0,
}

const caption = {
	...body,
	fontSize: settings.fontsize.smallish
}


const text = StyleSheet.create({

	body: body,

	paragraph: {
		...body,
		fontSize: settings.fontsize.smallish,
		textAlign: "justify",
		paddingTop: 2 * margin,
	},

	caption: caption,

	neutral: {
		...caption,
		color: settings.colors.neutralDark,
	},

	major: {
		...caption,
		color: settings.colors.major,
	},

	minor: {
		...caption,
		color: settings.colors.minor,
	},

	good: {
		...caption,
		color: settings.colors.good,
	},

	bad: {
		...caption,
		color: settings.colors.bad,
	},

	white: {
		...caption,
		color: settings.colors.white
	},

	error: {
		...caption,
		color: settings.colors.bad,
	},

	success: {
		...caption,
		color: settings.colors.good,
	},

	info: {
		...caption,
		color: settings.colors.info,
	},

	user: {
		color: settings.colors.major
	},

	topic: {
		color: settings.colors.minor
	},

	group: {
		color: settings.colors.note
	},

	url: {
		color: settings.colors.info,
		textDecorationLine: "underline"
	},

	pdm: {
		backgroundColor: settings.colors.major,
		color: settings.colors.white,
		fontSize: settings.fontsize.tiny,
		fontFamily: "Avenir",
	},

	title: title,

	heading: {
		...title,
		paddingBottom: Math.round(0.015 * Dimensions.get("window").height),
	},

	subtitle: {
		...title,
		fontSize: settings.fontsize.normal
	}

});



export default text;