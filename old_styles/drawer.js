import { StyleSheet, Dimensions } from 'react-native';
import Constants from 'expo-constants';

import settings from '../settings';
import general from './general';
import text from './text';


const layout = settings.layout
const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height - Constants.statusBarHeight

const edge = Math.round(screenWidth * layout.screenMargin)

const navHeight = Math.round(screenWidth * layout.navHeight)

const drawerHeight = screenHeight - navHeight
const drawerWidth = Math.round(screenWidth * layout.drawerSize)
const bufferWidth = screenWidth - drawerWidth

const drawer = StyleSheet.create({

	body: {
		...general.containerRow,
		position: "absolute",
		top: 0,
		bottom: 0,
		minWidth: screenWidth,
		maxWidth: screenWidth,
	},


	inner: {
		...general.container,
		minWidth: screenWidth,
		maxWidth: screenWidth,
		backgroundColor: settings.colors.white,
		borderColor: settings.colors.neutralPale,
		borderWidth: layout.border,
	},


	content: {
		...general.container,
		padding: edge,
	},


	buffer: {
		...general.container,
		minWidth: bufferWidth,
		maxWidth: bufferWidth,
	}

});

export default drawer;
