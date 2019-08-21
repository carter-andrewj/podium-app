import React from 'react';
import Component from '../../../utils/component';
import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../../styles/styles';
import settings from '../../../settings';

import Button from '../../../components/button';
import { CheckBox } from '../../../components/inputs';

import RegisterWrapper from './registerWrapper';



@inject("store")
@observer
class RegisterTOS extends Component {

	constructor() {

		super()
		
		this.state = {
			agreed: false
		}

		this.agree = this.agree.bind(this)
		this.submit = this.submit.bind(this)

	}


	agree() {
		this.updateState(state => state.update("agreed", a => !a))
	}


	submit() {
		console.log("submit", this.state.agreed)
		if (this.state.agreed) {

			const params = this.props.navigation.state.params

			// Launch registration process
			let task = this.props.store.session
				.register(params.identity, params.passphrase)

			// Navigate to profile creation
			this.props.navigation.navigate(
				"Name",
				{
					...this.props.navigation.state.params,
					task: task,
				}
			)

		}
	}




// RENDER

	render() {

		return <RegisterWrapper keyboard={false}>

			<View style={styles.spacer} />

			<Text style={[styles.text.heading, styles.lobby.heading]}>
				Terms of Service
			</Text>

			<ScrollView contentContainerStyle={styles.lobby.tos}>
				<Text style={styles.text.body}>
					TERMS OF SERVICE GO HERE
				</Text>
			</ScrollView>

			<View style={styles.lobby.tosCheck}>

				<TouchableOpacity onPress={this.agree}>
					<View style={styles.lobby.tosTouch}>

						<View style={styles.lobby.tosSide}>
							<CheckBox
								value={this.state.agreed}
								onChange={this.agree}
							/>
						</View>

						<View style={styles.lobby.tosText}>
							<Text style={styles.text.white}>
								I confirm I have read and {"\n"}
								understood these Terms
							</Text>
						</View>
					
					</View>
				</TouchableOpacity>

				<View style={styles.lobby.tosSide}>
					<Button
						inactive={!this.state.agreed}
						round={true}
						iconColorOn={settings.colors.major}
						iconColorOff={settings.colors.neutral}
						icon="arrow-right"
						onPress={this.submit}
					/>
				</View>

			</View>

		</RegisterWrapper>
		
	}

}

export default RegisterTOS;