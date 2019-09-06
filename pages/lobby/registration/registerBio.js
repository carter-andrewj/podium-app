import React from 'react';
import Page from '../../../utils/page';
import { Text, View, TextInput } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../../styles/styles';

import RegisterWrapper from './registerWrapper';



@inject("store")
@observer
class RegisterBio extends Page {

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


	pageWillFocus(params) {
		if (params.bio) {
			this.updateState(
				state => state.set("value", params.bio),
				this.validate
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
				let bio = this.state.value

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

					// Unpack params
					const params = this.props.navigation.state.params

					// Set profile data
					let task = new Promise((resolve, reject) => {
						params.task.promise
							.then(() => this.props.store.session
								.updateProfile({
									name: params.name,
									bio: this.state.value,
									picture: params.picture
								})
							)
							.then(resolve)
							.catch(reject)
					})

					// Navigate to welcome screen
					this.props.navigation.navigate(
						"Welcome",
						{
							...this.props.navigation.state.params,
							task: {
								promise: task,
								message: "Saving Profile"
							}
						}
					)

				}
			})
			.catch(console.error)
	}




// RENDER

	render() {

		return <RegisterWrapper
			action={this.submit}
			actionIcon={this.state.value.length > 0 ?
				"arrow-right"
				: null
			}
			actionLabel="skip"
			keyboard={true}
			navigation={this.props.navigation}>

			<View style={styles.spacer} />

			<TextInput

				ref={ref => { this.input = ref }}

				style={styles.lobby.bioBox}
				autoFocus={true}
				autoCapitalize="sentences"
				multiline={true}
				
				onChangeText={this.type}
				value={this.state.value}
				placeholder="I am the..."

				returnKeyType="none"
				
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
							really? how fascinating
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