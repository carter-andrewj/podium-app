import { createStackNavigator, createAppContainer } from 'react-navigation';

import { Animated, Easing } from 'react-native';


import Root from './root';

import Register from './lobby/register';
import SignIn from './lobby/signIn';
import Welcome from './lobby/welcome';

import Core from './core';








const Navigator = createStackNavigator(

	// Pages
	{
		Root: Root,

		Register: Register,
		SignIn: SignIn,
		Welcome: Welcome,
		
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
	}

)


export default createAppContainer(Navigator)