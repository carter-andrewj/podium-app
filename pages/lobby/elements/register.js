import React from 'react';
import Component from '../../../components/component';
import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';

import Button from '../../../components/buttons/button';
import FadingView from '../../../components/animated/fadingView';



@inject("store")
@observer
class Register extends Component {

	render() {

		return <FadingView
			animator={this.props.animator}
			show={this.props.focus === this.props.index}
			style={this.style.lobby.container}>

			<Button
				style={this.style.lobby.submitButton}
				color={this.colors.white}
				label="create account"
				labelStyle={this.style.lobby.submitText}
				onPress={() => this.props.next(this.props.index + 1)}
			/>

		</FadingView>
		
	}

}

export default Register;