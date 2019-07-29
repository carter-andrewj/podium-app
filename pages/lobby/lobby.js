import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { Text, View, Image, TouchableOpacity,
		 Keyboard, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react';

import Screen from '../screen';
import { Button, RoundButton } from '../../components/buttons';

import styles from '../../styles/styles';


@inject("store")
@observer
class Lobby extends Component {

	constructor() {
		super()
		this.state = {
			id: "",
			password: "",
			keyboard: false,
			error: undefined
		}
		this.signIn = this.signIn.bind(this)
		this.typeID = this.typeID.bind(this)
		this.typePassword = this.typePassword.bind(this)
		this.showInfo = this.showInfo.bind(this)
		this.showKeyboard = this.showKeyboard.bind(this)
		this.hideKeyboard = this.hideKeyboard.bind(this)
	}


	showKeyboard() {
		this.setState(last => {
			const next = last;
			next["keyboard"] = true
			return next
		})
	}

	hideKeyboard() {
		this.setState(last => {
			const next = last;
			next["keyboard"] = false
			return next
		})
	}


	signIn() {
		this.props.store.session
			.signIn(this.state.id, this.state.password)
			.then(result => {
				if (result) {
					this.props.navigation.navigate("Feed")
				}
			})
			.catch(error => this.updateState(
				state => state.set("error", error)
			))
	}

	typeID(id) {
		this.setState(last => {
			const next = last;
			next["id"] = id
			return next
		})
	}

	typePassword(pw) {
		this.setState(last => {
			const next = last;
			next["password"] = pw
			return next
		})
	}

	showInfo() {

	}

	render() {
		return <Screen style={styles.lobby.container}>

			{!this.state.keyboard ?
				<View style={[styles.container, styles.lobby.headerBox]}>
					<View style={[
							styles.containerRow,
							{ zIndex: 2 }
						]}>
						<RoundButton
							onPress={this.props.showInfo}
							icon="info"
						/>
						<RoundButton
							onPress={this.props.toRegister}
							icon="user-plus"
						/>
					</View>
					<View style={styles.lobby.logoBox}>
						<View style={styles.spacer} />
						<Image
							style={styles.lobby.logo}
							source={require("../../assets/title-logo.png")}
						/>
						<Text style={styles.lobby.versionNotice}>
							Alpha Version
						</Text>
						<View style={styles.spacer} />
					</View>
				</View>
				: null
			}

			{this.state.task ?
				<Text style={styles.textbody}>
					{this.state.task.status}
				</Text>
				:
				<View style={[styles.container, styles.lobby.signinBox]}>
					<TextInput
						
						style={[styles.input.oneLine, styles.text.body]}
						autoCapitalize="none"

						ref={ref => { this.id = ref }}
						placeholder="@identity"
						value={this.state.id}
						onChangeText={this.typeID}
					
						onFocus={this.showKeyboard}
						onBlur={this.hideKeyboard}
						
						onSubmitEditing={() => this.password.focus()}
						returnKeyType="next"

					/>
					<TextInput

						style={[styles.input.oneLine, styles.text.body]}
						autoCapitalize="none"
						secureTextEntry={true}

						ref={ref => { this.password = ref }}
						placeholder="pass phrase"
						value={this.state.password}
						onChangeText={this.typePassword}

						onFocus={this.showKeyboard}
						onBlur={this.hideKeyboard}
						
						onSubmitEditing={this.signIn}
						returnKeyType="go"

					/>
					{this.state.keyboard ?
						<View style={styles.keyboardSpacer} />
						: null
					}
				</View>
			}

		</Screen>
	}

}

export default Lobby;