import React from 'react';
import Component from '../../../utils/component';

import { createStackNavigator } from 'react-navigation';

import { Animated, Easing } from 'react-native';

import RegisterIdentity from './registerIdentity';
import RegisterPassphrase from './registerPassphrase';
import RegisterTOS from './registerTOS';
import RegisterName from './registerName';
import RegisterBio from './registerBio';
import RegisterPicture from './registerPicture';







const Register = createStackNavigator(

	// Pages
	{
		Identity: RegisterIdentity,
		Passphrase: RegisterPassphrase,
		Terms: RegisterTOS,
		Name: RegisterName,
		Bio: RegisterBio,
		Picture: RegisterPicture
	},

	// Options
	{
		initialRouteName: "Identity",
		headerMode: "none"
	}

)



export default Register;