import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';




const feed = StyleSheet.create({

	container: {
		...general.container,
	},

	separator: {
		...general.container,
		maxHeight: 3.0 * settings.layout.border,
		minHeight: 3.0 * settings.layout.border,
		backgroundColor: settings.colors.white,
		borderTopWidth: settings.layout.border,
		borderBottomWidth: settings.layout.border,
		borderColor: settings.colors.neutralPalest
	},

	header: {
		...general.containerRow,
		minWidth: Dimensions.get("window").width,
		height: settings.layout.headerSize *
			Dimensions.get("window").height,
		backgroundColor: settings.colors.white,
	},

	footer: {
		...general.containerRow,
		minWidth: Dimensions.get("window").width,
		height: settings.layout.headerSize *
			Dimensions.get("window").height,
		backgroundColor: settings.colors.white,
		borderTopWidth: settings.layout.border,
		borderColor: settings.colors.neutralPalest
	},

	placeholder: {
		...general.container,
		minHeight: Dimensions.get("window").height *
			(1.0 - settings.layout.headerSize),
		maxHeight: Dimensions.get("window").height *
			(1.0 - settings.layout.headerSize),
		minWidth: Dimensions.get("window").width,
		backgroundColor: settings.colors.white,
		paddingBottom: 0.15 * Dimensions.get("window").height
	},

	placeholderText: {
		...text.title,
	}


});

export default feed;
