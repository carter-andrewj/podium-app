import React from 'react';
import Component from '../../../utils/component';
import { Text, View, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import * as ImagePicker from 'expo-image-picker';

import styles from '../../../styles/styles';

import RegisterWrapper from './registerWrapper';



@inject("store")
@observer
class RegisterPicture extends Component {

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


	componentDidMount() {
		const picture = this.props.navigation.getParam("picture")
		const uri = this.props.navigation.getParam("uri")
		this.updateState(state => state
			.set("value", picture)
			.set("uri", uri)
		)
	}


	select() {
		this.store
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
								console.log(uri)
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

		let image;
		if (this.state.uri) {
			image = this.state.uri
		} else {
			image = "../assets/profile-placeholder.png"
		}

		return <RegisterWrapper skip={this.submit}>

			<TouchableOpacity onPress={this.select}>
				<Image
					style={styles.lobby.profilePic}
					source={image}
				/>
			</TouchableOpacity>

			<Text style={[styles.text.heading, styles.lobby.heading]}>
				Choose a Profile Picture
			</Text>

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

			<RoundButton
				icon="arrow-right"
				onPress={this.submit}
			/>

		</RegisterWrapper>
		
	}

}

export default RegisterPicture;