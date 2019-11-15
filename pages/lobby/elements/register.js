import React from 'react';
import Component from '../../../components/component';
import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../../styles/styles';
import settings from '../../../settings';

import Button from '../../../components/buttons/button';
import FadingView from '../../../components/animated/fadingView';



@inject("store")
@observer
class Register extends Component {

	render() {

		return <FadingView
			animator={this.props.animator}
			show={this.props.focus === this.props.index}
			style={styles.lobby.container}>

			<Button
				style={styles.lobby.submitButton}
				color={settings.colors.white}
				label="create account"
				labelStyle={styles.lobby.submitText}
				onPress={() => this.props.next(this.props.index + 1)}
			/>

		</FadingView>
		
	}

}

export default Register;