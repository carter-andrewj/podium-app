import React from 'react';
import Component from '../../../components/component';
import { Text, View, TouchableOpacity, Image, Animated } from 'react-native';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as ImagePicker from 'expo-image-picker';

import Avatar from '../../../components/media/avatar';
import FadingView from '../../../components/animated/fadingView';
import Button from '../../../components/buttons/button';



@inject("store")
@observer
class InputAvatar extends Component {

	constructor() {

		// State
		super({ image: undefined })
		this.thumbnail = false
		this.observer = undefined

		// Methods
		this.select = this.select.bind(this)

		this.showThumbnail = this.showThumbnail.bind(this)
		this.hideThumbnail = this.hideThumbnail.bind(this)

		// Animation
		this.opacity = new Animated.Value(0.0)

	}


// GETTERS

	get data() {
		return this.props.data.get("avatar")
	}

	get isFocus() {
		return this.props.focus === this.props.index
	}

	get isVisible() {
		return this.props.current < 9 &&
			(this.props.current === this.props.index || this.isFocus)
	}

	get isFilled() {
		return this.data.get("value") ? true : false
	}




// LIFECYCLE

	componentWillMount() {

		// Create value data
		if (!this.props.data.has("avatar")) {
			this.props.data.set("avatar", observable.map({
				value: false,
				error: false,
				type: "jpeg"
			}))
		}

	}

	componentDidMount() {

		// Move to next step on image select
		this.observer = this.data.observe(({ name, newValue }) => {

			// Check if value has changed
			if (name === "value" && newValue) {

				// Dispose of observer
				// (ensures auto-continue only occurs on first
				// selection of picture)
				this.observer()

				// Move to next element
				this.props.next(this.props.index + 1)

			}

		})

	}

	componentWillUpdate(nextProps) {

		// Ignore if picture is not yet shown
		if (nextProps.current >= nextProps.index) {

			// Check for changes in focus
			if (nextProps.focus !== this.props.focus) {

				// Hide thumbnail if becoming focus
				if (nextProps.focus === nextProps.index || this.props.current > 8) {
					this.hideThumbnail()
				} else {
					this.showThumbnail()
				}

			}

		}

	}

	componentWillUnmount() {

		// Dispose of observer
		if (this.observer) this.observer()

	}



// ACTIONS

	@action.bound
	setPicture(image) {
		this.data.set("value", image)
	}

	@action.bound
	setError(error) {
		this.data.set("error", error.message)
		return { cancelled: true }
	}



// INPUT

	async select() {

		// Check permissions
		let permission = await this.store.permitCamera()

		// Return if permission denied
		// TODO - More messaging to the user in this case
		if (!permission) return

		// Pick image
		let { cancelled, base64, uri } = await ImagePicker
			.launchImageLibraryAsync({
				mediaTypes: "Images",
				allowsEditing: true,
				aspect: [1, 1],
				base64: true,
				exif: true
			})
			.catch(this.setError)

		// Exit if no image selected
		if (cancelled) return

		// Set image data
		this.updateState(
			state => state.set("image", uri),
			() => this.setPicture(base64)
		)

	}



// THUMBNAIL

	showThumbnail() {

		console.log("showing thumbnail")

		// Ignore if already showing
		if (this.thumbnail) return

		// Set flag
		this.thumbnail = true

		// Show thumbnail
		this.props.animator.schedule(null, null, [this.opacity, 1.0])

	}

	hideThumbnail() {

		// Ignore if already hidden
		if (!this.thumbnail) return

		// Clear flag
		this.thumbnail = false

		// Hide thumbnail
		this.props.animator.schedule([this.opacity, 0.0])

	}





// RENDER

	render() {

		return <FadingView
			style={this.style.lobby.container}
			animator={this.props.animator}
			show={this.props.current >= this.props.index && this.props.current < 9}>

			<Animated.View
				pointerEvents={this.thumbnail ? "auto" : "none"}
				style={{
					...this.style.lobbyAvatar.thumbnailContainer,
					opacity: this.opacity
				}}>
				<TouchableOpacity
					onPress={() => this.props.setFocus(this.props.index)}>
					<Avatar
						hideBorder
						placeholder
						style={this.style.lobbyAvatar.thumbnail}
						uri={this.getState("image")}
					/>
				</TouchableOpacity>
			</Animated.View>

			<FadingView
				keepEnabled={true}
				animator={this.props.animator}
				show={this.isVisible}
				style={this.style.lobby.container}>

				<View style={this.style.lobbyAvatar.container}>

					<TouchableOpacity onPress={this.select}>
						<Avatar
							placeholder
							corner="right"
							uri={this.getState("image")}
							style={this.style.lobbyAvatar.image}
						/>
					</TouchableOpacity>

					<View
						pointerEvents="box-none"
						style={this.style.lobbyAvatar.overlay}>
						<FadingView show={!this.isFilled}>
							<Button
								style={this.style.lobbyAvatar.button}
								onPress={() => this.props.next(this.props.index + 1)}
								color="transparent"
								label="SKIP"
								labelStyle={this.style.lobby.overlayText}
							/>
						</FadingView>
					</View>

					<View
						pointerEvents="box-none"
						style={this.style.lobbyAvatar.overlay}>
						<FadingView show={this.isFilled}>
							<Button
								style={this.style.lobbyAvatar.button}
								onPress={() => this.props.next(this.props.index + 1)}
								color="transparent"
								icon="arrow-right"
								iconColor={this.colors.major}
							/>
						</FadingView>
					</View>

				</View>

				<FadingView
					style={this.style.lobby.caption}
					animator={this.props.animator}
					show={this.error}>
					<Text style={this.style.text.bad}>
						{this.error}
					</Text>
				</FadingView>

				<FadingView
					style={this.style.lobby.caption}
					animator={this.props.animator}
					show={this.isFilled && !this.error}>
					<Text style={this.style.text.good}>
						nice, very visual
					</Text>
				</FadingView>
				

				<FadingView
					style={this.style.lobby.caption}
					animator={this.props.animator}
					show={!this.isFilled && !this.error}>
					<Text style={this.style.text.neutral}>
						add a picture
					</Text>
				</FadingView>

			</FadingView>

		</FadingView>
		
	}

}



export default InputAvatar;