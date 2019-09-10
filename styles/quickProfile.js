import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';



const layout = settings.layout

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height

const drawerWidth = Math.round(layout.drawerSize * screenWidth)

const profileHeight = Math.round(layout.quickProfile * screenHeight)
const profileCap = Math.round(layout.quickProfileCap * screenHeight)

const footerHeight = Math.round(layout.headerSize * screenHeight)

const margin = Math.round(layout.margin * screenWidth)

const picture = profileHeight - (2 * margin)

const titleHeight = Math.round(layout.quickProfileName * screenHeight)





const quickProfile = StyleSheet.create({

	container: {
		...general.container,
		position: "relative",
		alignSelf: "flex-end",
		justifyContent: "flex-start",
		alignContent: "stretch",
		minWidth: drawerWidth,
		maxWidth: drawerWidth,
		minHeight: profileHeight + footerHeight,
		maxHeight: profileCap,
		backgroundColor: settings.colors.white,
		borderTopWidth: layout.border,
		borderColor: settings.colors.neutralPalest,
	},

	profile: {
		...general.containerRow,
		alignItems: "stretch",
		minHeight: profileHeight,
		padding: Math.round(margin * 0.5),
		marginLeft: layout.border,
	},



	left: {
		...general.container,
		justifyContent: "flex-start",
		minWidth: picture + margin,
		maxWidth: picture + margin,
	},

	pictureHolder: {
		...general.container,
		alignSelf: "flex-start",
		minWidth: picture,
		maxWidth: picture,
		minHeight: picture,
		maxHeight: picture,
		borderBottomRightRadius: Math.round(layout.corner * picture),
		backgroundColor: settings.colors.neutralPale,
		overflow: "hidden",
	},

	picture: {
		width: "100%",
		height: "100%",
	},



	right: {
		...general.container,
		alignItems: "flex-start",
	},


	header: {
		...general.container,
		alignItems: "flex-end",
		width: "100%",
		minHeight: titleHeight,
		maxHeight: titleHeight,
	},


	body: {
		...general.containerRow,
		width: "100%",
		position: "relative",
		alignItems: "stretch",
		marginTop: Math.round(margin * 0.5),
	},

	bio: {
		...text.body,
		height: "auto",
		width: "100%",
		fontSize: settings.fontsize.small,
	},

	dummy: {
		...text.body,
		fontSize: settings.fontsize.small,
		position: "absolute",
		top: Math.round(margin * 0.5),
		width: "100%",
		color: "transparent",
	},



	footer: {
		...general.containerRow,
		minHeight: footerHeight,
		maxHeight: footerHeight,
		borderTopWidth: 1,
		borderColor: settings.colors.neutralPalest,
	},


});

export default quickProfile;
