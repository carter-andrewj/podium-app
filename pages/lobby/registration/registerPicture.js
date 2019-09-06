import React from 'react';
import Page from '../../../utils/page';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import * as ImagePicker from 'expo-image-picker';

import settings from '../../../settings';
import styles from '../../../styles/styles';

import Button from '../../../components/button';

import RegisterWrapper from './registerWrapper';



@inject("store")
@observer
class RegisterPicture extends Page {

	constructor() {
		super()
		
		this.state = {
			value: undefined,
			uri: "",
			error: false
		}

		this.select = this.select.bind(this)
		this.submit = this.submit.bind(this)

	}


	pageWillFocus(params) {
		if (params.picture) {
			this.updateState(state => state
				.set("value", picture)
				.set("uri", uri)
			)
		}
	}


	select() {
		this.props.store
			.permitCamera()
			.then(permission => {
				if (permission) {
					ImagePicker
						.launchImageLibraryAsync({
							mediaTypes: "Images",
							allowsEditing: true,
							aspect: [1, 1],
							base64: true,
							exif: true
						})
						.then(({ cancelled, uri, base64 }) => {
							if (!cancelled) {
								this.updateState(state => state
									.set("uri", uri)
									.set("value", base64)
								)
							}
						})
						.catch(console.error)
				}
			})
			.catch(console.error)
	}



	submit() {
		this.props.navigation.navigate(
			"Bio",
			{
				...this.props.navigation.state.params,
				picture: this.state.value,
				uri: this.state.uri
			}
		)
	}




// RENDER

	render() {

		return <RegisterWrapper
			action={this.submit}
			actionIcon={this.state.uri.length > 0 ?
				"arrow-right"
				: null
			}
			actionLabel="skip"
			navigation={this.props.navigation}>

			<View style={styles.spacer} />

			<Text style={styles.lobby.heading}>
				who are you, visually?
			</Text>

			<TouchableOpacity onPress={this.select}>
				<View style={styles.lobby.profilePicHolder}>
					<Image
						style={styles.lobby.profilePic}
						source={this.state.value ?
							{ uri: this.state.uri } :
							require( "../../../assets/profile-placeholder.png")
						}
					/>
				</View>
			</TouchableOpacity>

			<View style={styles.input.caption}>
				{this.state.error ?
					<Text style={styles.text.error}>
						{this.state.error}
					</Text>
					:
					<Text style={styles.text.white}>
						{" "}
					</Text>
				}
			</View>

			<View style={[styles.containerRow,
					{ justifyContent: "center" }
				]}>
				<Button
					inactive={!this.state.value}
					icon="arrow-right"
					iconColorOff={settings.colors.neutral}
					color={settings.colors.white}
					round={true}
					onPress={this.submit}
				/>
			</View>

		</RegisterWrapper>
		
	}

}

export default RegisterPicture;