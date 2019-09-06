import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';


const keyboard = StyleSheet.create({

	above: {
		...general.container,
		minHeight: 0.64 * Dimensions.get("window").height,
		maxHeight: 0.64 * Dimensions.get("window").height,
		paddingTop: 0.1 * Dimensions.get("window").height,
	},

	aboveWithHeader: {
		...general.container,
		minHeight: (0.64 - settings.layout.headerSize) *
			Dimensions.get("window").height,
		maxHeight: (0.64 - settings.layout.headerSize) *
			Dimensions.get("window").height,
	},

	aboveWithHeaderWithAuto: {
		...general.container,
		minHeight: (0.6 - settings.layout.headerSize) *
			Dimensions.get("window").height,
		maxHeight: (0.6 - settings.layout.headerSize) *
			Dimensions.get("window").height,
	},

	below: {
		...general.container,
		minHeight: 0.36 * Dimensions.get("window").height,
		maxHeight: 0.36 * Dimensions.get("window").height,
	},

	belowWithAuto: {
		...general.container,
		minHeight: 0.4 * Dimensions.get("window").height,
		maxHeight: 0.4 * Dimensions.get("window").height,
	},

	floatAbove: {
		position: "absolute",
		bottom: 0.36 * Dimensions.get("window").height
	}


});

export default keyboard;
