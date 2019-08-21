import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';


const body = {
	fontFamily: settings.fonts.body,
	fontSize: settings.fontsize.normal,
	color: settings.colors.neutralDarkest,
	textAlign: "left"
}

const title = {
	fontFamily: settings.fonts.titles,
	fontSize: settings.fontsize.huge,
	color: settings.colors.major,
	textAlign: "center",
	paddingBottom: 0.02 * Dimensions.get("window").height,
}


const text = StyleSheet.create({

	body: body,

	wait: {
		color: settings.colors.neutralDarkest,
	},

	good: {
		color: settings.colors.good,
	},

	bad: {
		color: settings.colors.bad,
	},

	white: {
		color: settings.colors.white
	},

	error: {
		...body,
		color: settings.colors.bad,
		fontSize: settings.fontsize.smallish,
	},

	success: {
		...body,
		color: settings.colors.good,
		fontSize: settings.fontsize.smallish,
	},

	info: {
		...body,
		color: settings.colors.neutralDarkest,
		fontSize: settings.fontsize.smallish,
	},

	title: title,

	heading: {
		...title,
		paddingBottom: 30
	},

	subtitle: {
		...title,
		fontSize: settings.fontsize.normal
	}

});

export default text;