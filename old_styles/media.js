import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';



const layout = settings.layout
const screenWidth = Dimensions.get("window").width

const margin = Math.round(layout.margin * screenWidth)


const media = StyleSheet.create({

	profilePictureContainer: {
		...general.container,
		overflow: "hidden",
		margin: margin,
	},

	profilePictureBorder: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		borderColor: settings.colors.neutralPalest,
		borderWidth: layout.border,
	},

	profilePicture: {
		resizeMode: "contain",
		backgroundColor: settings.colors.neutralPale,
	},


});

export default media;








