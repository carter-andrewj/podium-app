import React from 'react';
import Page from '../../utils/page';
import { Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';

import Screen from '../screen';
import Button from '../../components/button';

import settings from '../../settings';
import styles from '../../styles/styles';



@inject("store")
@observer
class Welcome extends Page {

	constructor() {
		super()
		this.state = {
			ready: false,
			message: ""
		}
	}

	pageWillFocus(params) {
		if (params.task) {

			// Set task message
			this.updateState(state => state
				.set("message", params.task.message)
			)

			// Wait for task to complete
			params.task.promise
				.then(() => this.updateState(
					state => state.set("ready", true)	
				))
				.catch(error => {
					//TODO - Handle other types of error
					this.props.navigation.navigate(
						"SignIn",
						{
							...params,
							error: "invalid passphrase"
						}
					)
				})

		} else {
			this.updateState(state => state.set("ready", true))
		}
	}

	render() {
		return <Screen style={styles.lobby.container}>

			<View style={styles.container}>
				<Text style={styles.lobby.heading}>
					Welcome to the Podium Alpha
				</Text>
			</View>

			<View style={styles.lobby.welcome}>
				<Text style={styles.lobby.welcomeText}>
					WELCOME TEXT GOES HERE{"\n"}
					(this is a beta, things will be deleted
					regularly, etc...)
				</Text>
			</View>
	
			<View style={styles.container}>
				{this.state.ready ?
					<Button
						round={true}
						color={settings.colors.white}
						label="continue"
						labelColor={settings.colors.major}
						onPress={() => this.props.navigation.navigate("Core")}
					/>
					:
					<View style={styles.lobby.task}>
						<Text style={styles.lobby.taskText}>
							{this.state.message || "loading"}
						</Text>
					</View>
				}
			</View>

		</Screen>
	}

}

export default Welcome;