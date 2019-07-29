import { StyleSheet, Dimensions } from 'react-native';

import config from './constants';
import general from './general';


const body = {
	fontFamily: "Varela",
	fontSize: config.fontsize.normal,
	color: config.colors.neutralDarkest,
}

const title = {
	fontFamily: "Varela Round",
	fontSize: config.fontsize.huge,
	color: config.colors.major,
	textAlign: "center",
	paddingBottom: 0.02 * Dimensions.get("window").height,
}


const text = StyleSheet.create({

	body: body,

	wait: {
		color: config.colors.neutralDarkest,
	},

	good: {
		color: config.colors.good,
	},

	bad: {
		color: config.colors.bad,
	},

	white: {
		color: config.colors.white
	},

	error: {
		...body,
		color: config.colors.bad,
		fontSize: config.fontsize.smallish,
	},

	success: {
		...body,
		color: config.colors.good,
		fontSize: config.fontsize.smallish,
	},

	info: {
		...body,
		color: config.colors.neutralDarkest,
		fontSize: config.fontsize.smallish,
	},

	title: title,

	heading: {
		...title,
		paddingBottom: 30
	},

	subtitle: {
		...title,
		fontSize: config.fontsize.normal
	}

});

export default text;