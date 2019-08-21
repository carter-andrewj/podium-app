import React from 'react';
import Component from '../../../utils/component';
import { Text, View, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../../styles/styles';

import RegisterWrapper from './registerWrapper';



@inject("store")
@observer
class RegisterName extends Component {

	constructor() {
		super()
		
		this.state = {
			value: "",
			error: false,
			validating: false,
			valid: false,
			identity: ""
		}

		this.timer = null;
		this.input = null;

		this.type = this.type.bind(this)
		this.validate = this.validate.bind(this)
		this.submit = this.submit.bind(this)

	}


	componentDidMount() {
		const identity = this.props.navigation.getParam("identity")
		const name = this.props.navigation.getParam("name")
		this.updateState(
			state => state
				.set("identity", identity)
				.set("value", name),
			name ? this.validate : null
		)
	}


	type(name) {
		this.updateState(
			state => state
				.set("value", name)
				.set("error", undefined)
				.set("validating", true)
				.set("valid", undefined),
			this.validate
		)
	}

	validate(forced=false) {
		clearTimeout(this.timer)
		return new Promise((resolve, reject) => {

			// Check if current value has already been validated
			if (this.state.valid) {
				this.updateState(
					state => state.set("validating", false),
					() => resolve(true)
				)
			} else {

				// Get name
				let name = this.getState("value")

				this.timer = setTimeout(
					() => {

						let error;
						const maxLength = this.props.store.config.validation.name.maxLength;

						// Ensure username is no greater than the maximum length
						if (name.length > maxLength) {
							error = `Name cannot be longer than ${maxLength} characters`
						}

						// Check if an error has been found
						if (error) {
							this.updateState(
								state => state
									.set("valid", false)
									.set("validating", false)
									.set("error", error),
								() => resolve(false)
							)

						// Otherwise, name is valid
						} else {
							this.updateState(
								state => state
									.set("validating", false)
									.set("valid", true),
								() => resolve(true)
							)
						}

					},
					forced ? 0 : this.props.store.config.validation.delay
				)

			}

		})
	}


	submit() {
		this.validate(true)
			.then(valid => {
				if (valid) {
					this.props.navigation.navigate(
						"Bio",
						{
							...this.props.navigation.state.params,
							name: this.state.value
						}
					)
				}
			})
			.catch(console.error)
	}




// RENDER

	render() {

		return <RegisterWrapper skip={this.submit} keyboard={true}>

			<Text style={[styles.text.heading, styles.lobby.heading]}>
				Choose a Display Name
			</Text>

			<TextInput

				ref={ref => { this.input = ref }}

				style={styles.input.oneLine}
				autoFocus={true}
				autoCapitalize="words"
				
				onChangeText={this.type}
				value={this.state.value}
				placeholder={this.state.identity}

				onBlur={this.input.focus}

				returnKeyType="next"
				onSubmitEditing={this.submit}
				
			/>

			<View style={styles.input.caption}>
				{

					this.state.error ?
						<Text style={styles.text.error}>
							{this.state.error}
						</Text>
					:
					null
				}
			</View>

		</RegisterWrapper>
		
	}

}

export default RegisterName;