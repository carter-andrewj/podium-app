import React from 'react';
import Component from '../../../utils/component';
import { Text, View, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../../styles/styles';

import RegisterWrapper from './registerWrapper';



@inject("store")
@observer
class RegisterBio extends Component {

	constructor() {
		super()
		
		this.state = {
			value: "",
			error: false,
			valid: false
		}

		this.timer = null;
		this.input = null;

		this.type = this.type.bind(this)
		this.validate = this.validate.bind(this)
		this.submit = this.submit.bind(this)

	}


	componentDidMount() {
		if (this.props.store.newProfile.bio) {
			this.updateState(state => state
				.set("value", this.props.store.newProfile.bio)
			)
		}
	}


	type(name) {
		this.updateState(
			state => state
				.set("value", name)
				.set("error", undefined)
				.set("valid", undefined),
			this.validate
		)
	}

	validate(forced=false) {
		clearTimeout(this.timer)
		return new Promise((resolve, reject) => {

			// Check if current value has already been validated
			if (this.state.valid) {
				resolve(true)
			} else {

				// Get name
				let bio = this.getState("value")

				this.timer = setTimeout(
					() => {

						let error;
						const maxLength = this.props.store.config.validation.bio.maxLength;

						// Ensure username is no greater than the maximum length
						if (bio.length > maxLength) {
							error = `Bio cannot be longer than ${maxLength} characters`
						}

						// Check if an error has been found
						if (error) {
							this.updateState(
								state => state
									.set("valid", false)
									.set("error", error),
								() => resolve(false)
							)

						// Otherwise, name is valid
						} else {
							this.updateState(
								state => state.set("valid", true),
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
					this.props.store.newProfile
						.setBio(this.state.value)
						.then(() => this.props.navigation.navigate(
							"Picture"
						))
						.catch(console.error)
				}
			})
			.catch(console.error)
	}




// RENDER

	render() {

		return <RegisterWrapper skip={this.submit} keyboard={true}>

			<TextInput

				ref={ref => { this.input = ref }}

				style={styles.input.oneLine}
				autoFocus={true}
				autoCapitalize="sentences"
				
				onChangeText={this.type}
				value={this.state.value}
				placeholder="bio"

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
					this.state.value.length > 0 ?
						<Text style={styles.text.white}>
							{" "}
						</Text>
					:
					<Text style={styles.text.white}>
						describe yourself
					</Text>
				}
			</View>

		</RegisterWrapper>
		
	}

}

export default RegisterBio;