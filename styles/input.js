import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';


const input = StyleSheet.create({

	oneLine: {
		flex: 1,
		width: 0.9 * Dimensions.get("window").width,
		minHeight: 0.08 * Dimensions.get("window").height,
		maxHeight: 0.08 * Dimensions.get("window").height,
		backgroundColor: settings.colors.white,
		color: settings.colors.black,
		fontFamily: "Varela",
		fontSize: settings.fontsize.large,
		textAlign: "center",
		margin: 0.05 * Dimensions.get("window").width,
		marginBottom: 0.025 * Dimensions.get("window").width,
		marginTop: 0.025 * Dimensions.get("window").width,
	},

	multiLine: {
		flex: 1,
		width: 0.9 * Dimensions.get("window").width,
		minHeight: 0.3 * Dimensions.get("window").height,
		maxHeight: 0.3 * Dimensions.get("window").height,
		backgroundColor: settings.colors.white,
		color: settings.colors.black,
		fontFamily: "Varela",
		fontSize: settings.fontsize.large,
		textAlign: "center",
		margin: 3
	},

	caption: {
		paddingBottom: 20
	},

	checkbox: {
		...general.container,
		minWidth: 0.05 * Dimensions.get("window").width,
		maxWidth: 0.05 * Dimensions.get("window").width,
		minHeight: 0.05 * Dimensions.get("window").width,
		maxHeight: 0.05 * Dimensions.get("window").width,
		backgroundColor: settings.colors.white,
		borderRadius: 0.01 * Dimensions.get("window").width,
	},

	check: {

	}


});

export default input;
