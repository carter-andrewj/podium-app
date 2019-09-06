import React from 'react';
import Component from '../../../utils/component';
import { NavigationActions } from 'react-navigation';
import { View, Text, Keyboard } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../../styles/styles';
import settings from '../../../settings';

import Button from '../../../components/button';



@inject("store")
@observer
class RegisterWrapper extends Component {

	constructor() {
		super()
		this.state = {
			task: undefined,
			error: undefined,
			keyboard: false
		}
		this.keyboardOn = null;
		this.keyboardOff = null;
	}

	componentWillMount() {

		// Check active tasks
		let params = this.props.navigation.state.params
		if (params && params.task) {
			this.updateState(
				state => state.set("task", params.task.message),
				() => {
					params.task.promise
						.then(() => this.updateState(
							state => state.set("task", undefined)
						))
						.catch(error => this.updateState(
							state => state.set("error", error)
						))
				}
			)
		}

		// Listen for keyboard events
		this.keyboardOn = Keyboard.addListener(
			"keyboardDidShow",
			() => this.updateState(state => state.set("keyboard", true))
		)
		this.keyboardOff = Keyboard.addListener(
			"keyboardDidHide",
			() => this.updateState(state => state.set("keyboard", false))
		)

	}

	render() {
		return <View style={styles.lobby.container}>
			<View style={this.props.keyboard ?
					styles.keyboard.above :
					styles.container
				}>

				<View style={styles.lobby.header}>

					<View style={[
							styles.containerRow,
							{ justifyContent: "flex-start" }
						]}>
						<Button
							inactive={this.props.hideBack}
							style={this.props.hideBack ?
								{ opacity: 0 }
								: null
							}
							onPress={() => this.props.navigation.goBack()}
							icon="arrow-left"
							iconColor={settings.colors.major}
							round={true}
						/>
					</View>

					<View style={[
							styles.containerRow,
							{ justifyContent: "flex-end" }
						]}>
						{this.props.action ?
							<Button
								onPress={this.props.action}
								icon={this.props.actionIcon}
								label={this.props.actionLabel}
								round={true}
							/>
							: null
						}
					</View>

				</View>

				<View style={styles.spacer} />

				{this.props.children}

				<View style={styles.spacer} />

			</View>
			
			{this.props.keyboard ?
				<View style={styles.keyboard.below} />
				: null
			}

			{this.state.task ?
				<View style={[
						styles.lobby.task,
						this.state.keyboard ?
							styles.keyboard.floatAbove :
							{}
					]}>
					<Text style={styles.lobby.taskText}>
						{this.state.task}
					</Text>
				</View>
				: null
			}

		</View>
	}


	componentWillUnmount() {
		if (this.keyboardOn) { this.keyboardOn.remove() }
		if (this.keyboardOff) { this.keyboardOff.remove() }
	}

}


export default RegisterWrapper;