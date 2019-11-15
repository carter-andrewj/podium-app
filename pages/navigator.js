import { createStackNavigator, createAppContainer } from 'react-navigation';

import { Animated, Easing } from 'react-native';


import Root from './root';

import Lobby from './lobby/lobby';

import Core from './core';








const Navigator = createStackNavigator(

	// Pages
	{
		Root: Root,

		Lobby: Lobby,
		
		Core: Core,
		
	},

	// Options
	{
		initialRouteName: "Root",
		headerMode: "none",
		transitionConfig : () => ({
			transitionSpec: {
				duration: 0,
				timing: Animated.timing,
				easing: Easing.step0,
			},
		}),
		defaultNavigationOptions: {
			gesturesEnabled: false
		}
	}

)


export default createAppContainer(Navigator)