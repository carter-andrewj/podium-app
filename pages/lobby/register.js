import React from 'react';
import Component from '../../utils/component';

import { createStackNavigator } from 'react-navigation';

import { Animated, Easing } from 'react-native';

import RegisterIdentity from './registration/registerIdentity';
import RegisterPassphrase from './registration/registerPassphrase';
import RegisterTOS from './registration/registerTOS';

import RegisterName from './registration/registerName';
import RegisterPicture from './registration/registerPicture';
import RegisterBio from './registration/registerBio';






const Register = createStackNavigator(

	// Pages
	{
		Identity: RegisterIdentity,
		Passphrase: RegisterPassphrase,
		Terms: RegisterTOS,

		Name: RegisterName,
		Picture: RegisterPicture,
		Bio: RegisterBio,
	},

	// Options
	{
		initialRouteName: "Identity",
		headerMode: "none"
	}

)



export default Register;