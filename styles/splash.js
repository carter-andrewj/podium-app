import { StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';

import settings from '../settings';
import general from './general';


const layout = settings.layout

const screenWidth = Dimensions.get("window").width
const screenHeight = Math.round((Dimensions.get("window").height - Constants.statusBarHeight))


const splash = StyleSheet.create({

	body: {
		...general.container,
		backgroundColor: settings.colors.white
	},

	iconBox: {

	},

	icon: {
		flex: 1,
		margin: "auto",
		width: Math.round(0.2 * screenWidth),
		minHeight: Math.round(0.25 * screenWidth),
		resizeMode: "contain"
	}

});

export default splash;
