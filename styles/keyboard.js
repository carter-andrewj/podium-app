import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';


const keyboard = StyleSheet.create({

	above: {
		...general.container,
		minHeight: 0.62 * Dimensions.get("window").height,
		maxHeight: 0.62 * Dimensions.get("window").height,
		paddingTop: 0.1 * Dimensions.get("window").height,
	},

	below: {
		...general.container,
		minHeight: 0.38 * Dimensions.get("window").height,
		maxHeight: 0.38 * Dimensions.get("window").height,
	},


});

export default keyboard;
