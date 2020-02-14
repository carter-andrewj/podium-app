import { StyleSheet, Dimensions } from 'react-native';

import settings from '../settings';
import general from './general';
import text from './text';



const layout = settings.layout
const screenWidth = Dimensions.get("window").width

const margin = Math.round(screenWidth * layout.margin)

const overlap = 2 * Math.round(screenWidth * layout.button)

const headerHeight = Math.round(screenWidth * layout.postHeader)
const postHeight = headerHeight + overlap + (4 * margin)
const gaugeHeight = Math.round((postHeight - overlap - (3 * margin)) * 0.5)

const gaugeMargin = Math.round(margin * 0.5)

const gauge = StyleSheet.create({

	container: {
		...general.containerRow,
		justifyContent: "space-evenly",
		minHeight: gaugeHeight,
		maxHeight: gaugeHeight,
		minWidth: overlap,
		maxWidth: overlap,
		margin: gaugeMargin,
		marginBottom: 0,
		paddingLeft: gaugeMargin,
		paddingRight: gaugeMargin,
		borderRadius: gaugeHeight
	},

	text: {
		...text.title,
		color: settings.colors.white,
		fontSize: settings.fontsize.smaller,
		lineHeight: gaugeHeight,
		paddingTop: 1,
	},

});

export default gauge;

