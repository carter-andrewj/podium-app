import { createStackNavigator, createAppContainer } from 'react-navigation';

import { Animated, Easing } from 'react-native';

import Lobby from './lobby';
import SignIn from'./signIn';
import Register from './registration/register';






const Navigator = createStackNavigator(

	// Pages
	{
		Lobby: Lobby,
		SignIn: SignIn,
		Register: Register,
	},

	// Options
	{
		initialRouteName: "Lobby",
		headerMode: "none",
		// transitionConfig : () => ({
		// 	transitionSpec: {
		// 		duration: 0,
		// 		timing: Animated.timing,
		// 		easing: Easing.step0,
		// 	},
		// }),
	}

)


export default Navigator;