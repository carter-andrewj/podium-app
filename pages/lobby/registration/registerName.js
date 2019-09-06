import React from 'react';
import Page from '../../../utils/page';
import { Text, View, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../../styles/styles';

import RegisterWrapper from './registerWrapper';



@inject("store")
@observer
class RegisterName extends Page {

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


	pageWillFocus(params) {
		this.updateState(
			state => state
				.set("identity", params.identity)
				.set("value", params.name || ""),
			params.name ? this.validate : null
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
				let name = this.state.value

				this.timer = setTimeout(
					() => {

						let error;
						const maxLength = this.props.store.config.validation.name.maxLength;

						// Ensure username is no greater than the maximum length
						if (name.length > maxLength) {
							error = `your name can't be longer than ${maxLength} characters`
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
						"Picture",
						{
							...this.props.navigation.state.params,
							name: this.state.value.length > 0 ?
								this.state.value :
								undefined
						}
					)
				}
			})
			.catch(console.error)
	}




// RENDER

	render() {

		return <RegisterWrapper
			hideBack={true}
			action={this.submit}
			actionIcon={this.state.value.length > 0 ?
				"arrow-right"
				: null
			}
			actionLabel="skip"
			keyboard={true}
			navigation={this.props.navigation}>

			<TextInput

				ref={ref => { this.input = ref }}

				style={styles.input.oneLine}
				autoFocus={true}
				autoCorrect={false}
				autoCapitalize="words"
				
				onChangeText={this.type}
				value={this.state.value}
				placeholder={this.state.identity}

				returnKeyType="next"
				onSubmitEditing={this.submit}
				
			/>

			<View style={styles.input.caption}>
				{
					this.state.validating ?
						<Text style={styles.text.white}>
							{" "}
						</Text>
					:
					this.state.error ?
						<Text style={styles.text.error}>
							{this.state.error}
						</Text>
					:
					this.state.value.length > 0 ?
						<Text style={styles.text.white}>
							nice to meet you, {this.state.value.split(" ")[0]}
						</Text>
					:
					<Text style={styles.text.white}>
						what should we call you?
					</Text>
				}
			</View>

		</RegisterWrapper>
		
	}

}

export default RegisterName;