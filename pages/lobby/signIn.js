import React from 'react';
import Component from '../../utils/component';
import { Text, View, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react';

import Button from '../../../components/button';

import styles from '../../styles/styles';




@inject("store")
@observer
class SignIn extends Component {

	constructor() {
		super()
		
		this.state = {
			identity: "",
			passphrase: "",
			error: false,
			loading: false
		}

		this.identity = null;
		this.passphrase = null;

		this.submit = this.submit.bind(this);

	}


	typeIdentity(id) {
		const identity = id.trim()
			.replace(this.props.store.config.validation.identity.chars, "")
		this.updateState(state => state
			.set("identity", identity)
			.set("error", undefined)
		)
	}

	typePassphrase(passphrase) {
		this.updateState(state => state
			.set("passphrase", passphrase)
			.set("error", undefined)
		)
	}



	submit() {

	}





// RENDER

	render() {

		return <View style={styles.lobby.container}>

			<View style={style.keyboard.above}>

				<View style={styles.lobby.header}>

					<View style={[
							styles.containerRow,
							{ justifyContent: "flex-end" }
						]}>
						<Button
							onPress={() => this.props.navigation.navigate("register")}
							label="new user"
							iconColor={settings.colors.minor}
							round={true}
						/>
					</View>

				</View>

				<View style={style.lobby.header}>
					<Button
						onPress={this.props.navigation.goBack()}
						icon="arrow-left"
					/>
					<Button
						onPress={this.props.navigation.to("Register")}
						icon="user-plus"
					/>
				</View>

				<TextInput

					ref={ref => { this.identity = ref }}

					style={styles.input.oneLine}
					autoFocus={true}
					autoCapitalize="none"
					
					onChangeText={this.typeIdentity}
					value={this.state.identity.length > 0 ?
						`@${this.state.identity}` :
						""
					}
					placeholder="@ident"

					onFocus={() => this.setFocus(this.identity)}
					onBlur={this.loseFocus}

					returnKeyType="next"
					onSubmitEditing={() => this.setFocus(this.passphrase)}
					
				/>

				<TextInput

					ref={ref => { this.passphrase = ref }}

					style={styles.input.oneLine}
					secureTextEntry={true}
					autoCapitalize="none"
					
					onChangeText={this.typePassphrase}
					value={this.state.passphrase}
					placeholder="passphrase"

					onFocus={() => this.setFocus(this.passphrase)}
					onBlur={this.loseFocus}

					returnKeyType="go"
					onSubmitEditing={this.submit}
					
				/>

				<View style={styles.input.caption}>
					{
						this.state.error ?
							<Text style={styles.text.error}>
								{this.state.error}
							</Text>
						:
						this.state.loading ?
							<Text style={styles.text.info}>
								signing in
							</Text>
						:
						null
					}
				</View>

			</View>

			<View style={style.keyboard.below} />

		</View>
		
	}

}

export default SignIn;