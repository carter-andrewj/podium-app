import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';



const layout = settings.layout
const screenWidth = Dimensions.get("window").width

const edge = Math.round(screenWidth * layout.screenMargin)
const margin = Math.round(screenWidth * layout.margin)

const drawerWidth = Math.round(screenWidth * settings.layout.drawerSize)

const leftWidth = Math.round(drawerWidth * 0.36)
const rightWidth = drawerWidth - leftWidth

const pictureWidth = leftWidth - (2 * margin)


const menu = StyleSheet.create({

	body: {
		...general.containerRow,
		backgroundColor: settings.colors.white,
	},

	left: {
		...general.container,
		alignItems: "flex-start",
		justifyContent: "flex-start",
		minWidth: leftWidth,
		maxWidth: leftWidth,
		padding: edge,
	},

	right: {
		...general.container,
		alignItems: "flex-end",
		justifyContent: "flex-start",
		minWidth: rightWidth,
		maxWidth: rightWidth,
		padding: edge
	},

	picture: {
		...general.container,
		minWidth: pictureWidth,
		maxWidth: pictureWidth,
		minHeight: pictureWidth,
		maxHeight: pictureWidth,
		marginBottom: edge,
	},

	header: {
		...general.container,
		maxHeight: settings.fontsize.normal + settings.fontsize.small,
	},

	name: {
		...text.name,
		width: "100%",
		textAlign: "right",
	},

	alias: {
		...text.alias,
		width: "100%",
		textAlign: "right",
	},

	bio: {
		...text.bio,
		marginTop: edge
	}



});

export default menu;
