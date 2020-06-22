import { Dimensions, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import { observable, action, computed, autorun } from 'mobx';

import { List } from 'immutable';

import AlertsStyle from './styles/alerts';
import ButtonStyle from './styles/button';
import ComposeStyle from './styles/compose';
import CoreStyle from './styles/core';
import FeedStyle from './styles/feed';
import GaugeStyle from './styles/gauge';
import InputStyle from './styles/inputs';
import LobbyStyle from './styles/lobby';
import MediaStyle from './styles/media';
import MenuStyle from './styles/menu';
import PostStyle from './styles/post';
import ProfileStyle from './styles/profile';
import LinkStyle from './styles/link';
import SearchStyle from './styles/search';
import SplashStyle from './styles/splash';
import TaskStyle from './styles/tasks';
import TextStyle from './styles/text';
import WalletStyle from './styles/wallet';





class BaseStyle {

	constructor(store) {


		// Refs
		this.store = store
		this.config = store.config
		this.settings = store.config.settings





		// Methods
		this.withWidth = this.withWidth.bind(this)
		this.withHeight = this.withHeight.bind(this)
		this.withSize = this.withSize.bind(this)
		this.withBorder = this.withBorder.bind(this)
		this.withShadow = this.withShadow.bind(this)


		this.compile = this.compile.bind(this)
		autorun(this.compile)

	}



	compile() {

		// Layout
		const { general, screen, colors } = this.settings
		const screenWidth = Dimensions.get("window").width
		const screenHeight = Dimensions.get("window").height - Constants.statusBarHeight

		this.layout = {
			screen: {
				width: screenWidth,
				height: screenHeight,
				statusBar: Constants.statusBarHeight,
				padding: Math.round(screenWidth * general.screenPadding)
			},
			margin: Math.round(screenWidth * general.margin),
			border: general.border,
			shadow: {
				opacity: general.shadowOpacity,
				height: Math.round(screenWidth * general.shadowHeight),
			},
			iconSize: Math.round(general.bigIcon * screenWidth)
		}

		// Observables
		this.layout.visibleHeight = observable.box(screenHeight)

		// Colors
		this.colors = {

			major: colors.green,
			majorPale: colors.lightGreen,
			majorPalest: colors.paleGreen,

			minor: colors.red,
			minorPale: colors.lightRed,
			minorPalest: colors.paleRed,

			neutralPalest: colors.paleGrey,
			neutralPale: colors.lightGrey,
			neutral: colors.grey,
			neutralDark: colors.dimGrey,
			neutralDarkest: colors.darkGrey,

			white: colors.white,
			offWhite: colors.offWhite,
			offBlack: colors.offBlack,
			black: colors.black,

			pod: colors.green,
			aud: colors.purple,

			good: colors.green,
			warn: colors.amber,
			bad: colors.red,

			mention: colors.green,
			topic: colors.tan,
			domain: colors.purple,
			link: colors.blue,

			border: colors.paleGrey

		}

	}



// RESPONSIVE

	@action.bound
	setVisibleHeight(height) {
		this.layout.visibleHeight.set(height)
	}




// UTILITIES

	withBorder(color = this.colors.border, position = "") {
		let style = { borderColor: color }
		style[`border${position}Width`] = this.layout.border
		return style
	}

	withWidth(width) {
		return {
			minWidth: width,
			maxWidth: width
		}
	}

	withHeight(height) {
		return {
			minHeight: height,
			maxHeight: height
		}
	}

	withSize(size) {
		return {
			...this.withWidth(size),
			...this.withHeight(size)
		}
	}

	withShadow(height = this.layout.shadow.height) {
		return {
			shadowColor: this.colors.black,
			shadowOffset: {
				width: 0,
				height: Math.round(0.5 * height),
			},
			shadowOpacity: this.layout.shadow.opacity,
			shadowRadius: height,
			elevation: height,
		}
	}





// COMPONENTS

	get container() {
		return {
			position: "relative",
			flex: 1,
			flexBasis: "auto",
			width: "100%",
			height: "auto",
			backgroundColor: "transparent",
			alignSelf: "stretch",
			alignItems: 'center',
			justifyContent: 'center',
			alignContent: "center",
			margin: 0,
			padding: 0,
		}
	}


	get column() {
		return {
			...this.container,
			flexDirection: "column",
			justifyContent: "flex-start",
		}
	}


	get row() {
		return {
			...this.container,
			flexDirection: "row",
			justifyContent: "space-between",
		}
	}


	get overlay() {
		return {
			position: "absolute",
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
		}
	}




// STYLESHEET

	@computed
	get general() {
		return StyleSheet.create({

			container: this.container,

			column: this.column,
			row: this.row,

			overlay: this.overlay,

			screen: {
				...this.column,
				alignSelf: "stretch",
				minWidth: this.layout.screen.width,
				backgroundColor: this.colors.white,
			},
	
			statusBar: {
				flex: 1,
				backgroundColor: this.colors.white,
				color: this.colors.white,
			},

			spacer: {
				...this.container,
				flexGrow: 2,
			}

		})
	}


}




let order = List([
	TextStyle,
	ButtonStyle,
	InputStyle,
	MediaStyle,
	TaskStyle,
	SplashStyle,
	LobbyStyle,
	CoreStyle,
	MenuStyle,
	FeedStyle,
	PostStyle,
	GaugeStyle,
	LinkStyle,
	WalletStyle,
	SearchStyle,
	AlertsStyle,
	ComposeStyle,
	ProfileStyle,
])

let Style = order.reduce((result, next) => next(result), BaseStyle)

export default Style;



