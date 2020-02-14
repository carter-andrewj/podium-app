import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';


const layout = settings.layout
const screenWidth = Dimensions.get("window").width

const margin = Math.round(screenWidth * layout.margin)

const navHeight = Math.round(screenWidth * layout.navHeight)



const core = StyleSheet.create({

	body: {
		...general.container,
	},

	content: {
		...general.container,
	},

	nav: {
		...general.containerRow,
		minHeight: navHeight,
		maxHeight: navHeight,
		alignContent: "stretch",
		paddingLeft: margin,
		paddingRight: margin,
		backgroundColor: settings.colors.white
	},

	navButton: {
		...general.container,
		alignSelf: "stretch"
	}

});

export default core;
