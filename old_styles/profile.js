import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';






const profile = StyleSheet.create({

	name: {
		...text.title,
		textAlign: "right",
		paddingBottom: 0,
		fontSize: settings.fontsize.normal,
	},

	identity: {
		...text.title,
		textAlign: "right",
		color: settings.colors.neutralDarkest,
		paddingBottom: 0,
		fontSize: settings.fontsize.small,
	},

});

export default profile;
