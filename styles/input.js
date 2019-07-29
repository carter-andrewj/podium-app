import { StyleSheet, Dimensions } from 'react-native';

import config from './constants';
import general from './general';


const input = StyleSheet.create({

	oneLine: {
		flex: 1,
		width: 0.9 * Dimensions.get("window").width,
		minHeight: 0.08 * Dimensions.get("window").height,
		maxHeight: 0.08 * Dimensions.get("window").height,
		backgroundColor: config.colors.white,
		color: config.colors.black,
		fontFamily: "Varela",
		fontSize: config.fontsize.large,
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
		backgroundColor: config.colors.white,
		color: config.colors.black,
		fontFamily: "Varela",
		fontSize: config.fontsize.large,
		textAlign: "center",
		margin: 3
	},

	caption: {
		paddingBottom: 20
	}

});

export default input;
