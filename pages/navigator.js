import { createStackNavigator, createAppContainer } from 'react-navigation';

import { Animated, Easing } from 'react-native';

import Register from './lobby/registration/register';
import Feed from'./feed/feed';
import Root from './root';






const Navigator = createStackNavigator(

	// Pages
	{
		Root: Root,
		Register: Register,
		Feed: Feed,
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