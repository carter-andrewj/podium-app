import { StyleSheet, Dimensions } from 'react-native';

import config from './constants';
import general from './general';


const lobby = StyleSheet.create({

	container: {
		...general.container,
		backgroundColor: config.colors.major
	},

	headerBox: {
		marginTop: 0.05 * Dimensions.get("window").height,
	},

	logoBox: {
		maxHeight: 0.6 * Dimensions.get("window").height,
	},

	logo: {
		flex: 1,
		width: 0.8 * Dimensions.get("window").width,
		minHeight: 0.51 * Dimensions.get("window").width,
		resizeMode: "contain",
		...general.card
	},

	versionNotice: {
		...general.text,
		fontSize: config.fontsize.small,
		color: config.colors.white,
		alignSelf: "center",
		margin: 0
	},

	signinBox: {
		alignSelf: "flex-end",
		maxHeight: 0.25 * Dimensions.get("window").height,
	},

	buttonBox: {
		flexDirection: "row",
		minHeight: 0.1 * Dimensions.get("window").height
	}

});

export default lobby;
