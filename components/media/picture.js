import React, { Fragment } from 'react';
import Component from '../component';
import { View, Text, Image, TouchableOpacity,
		 Linking, Animated, Easing } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import Spinner from '../animated/spinner';



@inject("store")
@observer
export default class Link extends Component {

	constructor() {

		// Set initial state
		super({
			loaded: false,
			asset: {
				width: undefined,
				height: undefined,
			},
			onScreen: {
				x: undefined,
				y: undefined,
				w: undefined,
				h: undefined
			}
		})

		// Methods
		this.preload = this.preload.bind(this)
		this.measure = this.measure.bind(this)
		this.display = this.display.bind(this)
		this.resize = this.resize.bind(this)
		this.fullScreen = this.fullScreen.bind(this)

		// Animations
		this.frame = undefined
		this.measuring = undefined
		this.width = new Animated.Value(0.0)
		this.height = new Animated.Value(0.0)
	
	}


	componentDidMount() {
		this.preload()
	}

	componentDidUpdate(lastProps) {
		if (this.props.uri !== lastProps.uri) this.preload()
	}





// SETUP

	preload() {

		// Ignore if uri not provided
		if (!this.props.uri) return

		// Get image full dimensions
		Image.getSize(
			this.props.uri,
			(w, h) => this.updateState(
				state => state
					.setIn(["asset", "width"], w)
					.setIn(["asset", "height"], h)
					.set("loaded", true),
				this.display
			)
		)

	}




// DISPLAY MODE

	measure() {

		// Start measurement if not already in progress
		if (!this.measuring) {
			this.measuring = new Promise(resolve => this.frame
				.measure((x, y, w, h, screenX, screenY) => this.updateState(

					state => state.set("display", {
						offset: { x, y },
						width: w,
						height: h,
						position: {
							x: screenX,
							y: screenY
						}
					}),

					() => {
						this.measuring = undefined
						resolve()
					}

				))
			)
		}

		return this.measuring

	}


	async display() {

		// Ensure asset measurement is up-to-date
		await this.measure()

		// Unpack
		let { maxWidth, maxHeight } = this.props.style
		let { width, height } = this.getState("asset")
		let displayWidth
		let displayHeight

		// TODO - More scaling/size options

		// Calculate the display dimensions
		if (!maxHeight || (maxWidth && maxHeight && width < height)) {
			displayWidth = maxWidth
			displayHeight = maxWidth * (height / width)
		} else {
			displayHeight = maxHeight
			displayWidth = maxHeight * (width / height)
		}

		console.log("max", maxWidth, maxHeight)
		console.log("out", displayWidth, displayHeight)

		// Resize
		this.resize(displayWidth, displayHeight)

	}


	async fullScreen() {

		// Wait for any remeasurement to complete
		await this.measure()

		// Get current screen location
		let { position, width, height } = this.getState("display")

		// Calculate current location
		let closed = {
			x: position.x,
			y: position.y,
			w: width,
			h: height,
		}

		// Calculate target location
		let open = {
			x: 0.0,
			y: (this.layout.screen.height - height) / 2.0,
			w: this.layout.screen.width,
			h: height * (width / this.layout.screen.width),
		}

		let x = new Animated.Value(closed.x)
		let y = new Animated.Value(closed.y)
		let w = new Animated.Value(closed.w)
		let h = new Animated.Value(closed.h)

		// Make entrance/exit animations
		let enter = (done) => {
			Animated
				.parallel([
					Animated.timing(y, {
						toValue: open.y,
						duration: this.timing.modal,
						easing: Easing.linear
					}),
					Animated.timing(x, {
						toValue: open.x,
						duration: this.timing.modal,
						easing: Easing.linear,
					}),
					Animated.timing(w, {
						toValue: open.w,
						duration: this.timing.modal,
						easing: Easing.linear,
					}),
					Animated.timing(h, {
						toValue: open.h,
						duration: this.timing.modal,
						easing: Easing.linear,
					}),
				])
				.start(({ finished }) => finished ? done() : null)
		}

		let exit = (done) => {
			Animated
				.parallel([
					Animated.timing(y, {
						toValue: closed.y,
						duration: this.timing.modal,
						easing: Easing.linear
					}),
					Animated.timing(x, {
						toValue: closed.x,
						duration: this.timing.modal,
						easing: Easing.linear,
					}),
					Animated.timing(w, {
						toValue: closed.w,
						duration: this.timing.modal,
						easing: Easing.linear,
					}),
					Animated.timing(h, {
						toValue: closed.h,
						duration: this.timing.modal,
						easing: Easing.linear,
					}),
				])
				.start(({ finished }) => finished ? done() : null)
		}

		// Make full-screen content
		let content = <Animated.View style={{
				...this.style.picture.container,
				minWidth: w,
				maxWidth: w,
				minHeight: h,
				maxHeight: h,
				transform: [
					{ translateX: x },
					{ translateY: y }
				]
			}}>
			<Image
				source={{ uri: this.props.uri }}
				style={this.style.picture.image}
			/>
		</Animated.View>

		// Set modal content
		this.mask(content, enter, exit)

	}



	resize(width, height, opacity = 1.0) {
		return new Promise(resolve => Animated
			.parallel([
				Animated.timing(this.width, {
					toValue: width,
					duration: this.timing.move,
					easing: Easing.linear,
				}),
				Animated.timing(this.height, {
					toValue: height,
					duration: this.timing.move,
					easing: Easing.linear,
				})
			])
			.start(({ finished }) => finished ? resolve() : null)
		)
	}





// RENDER

	render() {

		let loaded = this.getState("loaded")

		return <TouchableOpacity
			ref={ref => this.frame = ref}
			onPress={this.getState("loaded") ? this.fullScreen : null}
			onLayout={this.measure}
			style={{
				...this.style.picture.container,
				...this.props.style,
			}}>

			<View style={this.style.picture.backdrop}>
				<Spinner />
			</View>

			{loaded && this.props.uri ?
				<Fragment>
					<Animated.Image
						source={{ uri: this.props.uri }}
						style={{
							...this.style.picture.image,
							minWidth: loaded ? this.width : "100%",
							maxWidth: loaded ? this.width : "100%",
							minHeight: loaded ? this.height : "100%",
							maxHeight: loaded ? this.height : "100%",
							opacity: 1.0,
						}}
					/>
					<View style={this.style.picture.overlay}>
						{this.props.children}
					</View>
				</Fragment>
				: null
			}

		</TouchableOpacity>

	}

}