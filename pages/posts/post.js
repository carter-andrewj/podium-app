import React from 'react';
import Component from '../../utils/component';
import { Text, View, Image, Animated, Dimensions,
		 PanResponder, TouchableOpacity } from 'react-native';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

import globals from '../../globals';
import settings from '../../settings';
import styles from '../../styles/styles';

import Button from '../../components/button';



@inject("store")
@observer
class Post extends Component {


	constructor() {

		super()

		this.span = Math.round(Dimensions.get("window").width *
			(1.0 - settings.layout.postWingOverlap))
		this.location = 0
		this.pan = new Animated.ValueXY()
		this.height = null

		this.state = {
			location: 0
		}

		this.container = React.createRef()

		this.animUpdate = false

		this.setLocation = this.setLocation.bind(this)
		this.resetPan = this.resetPan.bind(this)
		this.panTo = this.panTo.bind(this)

		// Set up screen pan
		this.panResponder = PanResponder.create({

			// Handle trigger conditions
			onMoveShouldSetPanResponder: (event, { dx, dy }) => {

				// Get location within post
				const y = event.nativeEvent.locationY

				// Continue if this post has locked the screen
				if (globals.screenLock === this.props.address) {
					return true

				// Ignore if another component has locked the screen
				} else if (globals.screenLock) {
					return false

				// Otherwise, lock the screen to this post
				} else if (y > settings.layout.deadZone
						&& y < (this.height - settings.layout.deadZone)
						&& (Math.abs(dx) > Math.max(
							settings.layout.panStart / 2.0,
							Math.abs(dy)
						))
						&& (this.location > -1 || dx < 0)
						&& (this.location < 1 || dx > 0)
					) {
					globals.screenLock = this.props.address.item
					return true

				// Otherwise, do nothing
				} else {
					return false
				}

			},

			// Handle pan start
			onPanResponderGrant: this.resetPan,

			// Handle screen movement
			onPanResponderMove: Animated.event([
				null,
				{ dx: this.pan.x }
			]),

			// Handle screen release
			onPanResponderRelease: (_, { dx, vx }) => {

				// Release screenlock
				globals.screenLock = false

				// Get threshold variables
				const xLimit = this.span * settings.layout.xLimit
				const vLimit = settings.layout.vLimit
				const x = -1.0 * dx
				const v = -1.0 * vx

				// Calculate destination
				let destination = 0;
				if (this.location > -1 && (
						(x < (-1.0 * xLimit)) ||
						(v < (-1.0 * vLimit))
					)) {
					destination = -1
				} else if (this.location < 1 && (
						(x > xLimit) ||
						(v > vLimit)
					)) {
					destination = 1
				}

				// Animate window
				this.panTo(destination, false)

			},

			// Handle pan termination
			onResponderTerminate: () => {
				globals.screenLock = false
			}
			
		})

	}



	resetPan() {
		this.pan.setOffset({
			x: -1.0 * this.location * this.span,
			y: 0
		})
		this.pan.setValue({
			x: 0,
			y: 0
		})
	}

	setLocation() {
		if (this.location !== this.state.location) {
			this.animUpdate = true
			this.updateState(
				state => state.set("location", this.location),
				() => this.animUpdate = false
			)
		}
	}

	panTo(x, reset=true) {

		// Set pan location
		if (reset) { this.resetPan() }
		this.location += x

		// Stop active animation
		this.pan.stopAnimation(this.setLocation)

		// Move window
		return new Promise(resolve => {
			Animated
				.spring(this.pan, {
					toValue: {
						x: -1.0 * x * this.span,
						y: 0
					},
					bounciness: settings.layout.panBounce,
				})
				.start(() => {
					this.setLocation()
					resolve()
				})
		})

	}


	render() {

		// let post = this.props.store.posts.get(this.props.address)
		// let author = this.props.store.users.get(post.author)

		let post = {
			content: "This is a test post.",//\n\n\n\n\nwith\n\nlots of\n\n\n\n\nlines.",
			replies: ["address", "otheraddress"],
			promos: ["addressagain"],
			created: 1567359036,
		}

		let author = {
			picture: require("../../assets/profile-placeholder.png"),
			identity: "@testuser",
			name: "Test User",
			bio: "Biography of a test user goes here.",
			created: 1567349036,
			affinity: 0.864,
			integrity: 0.632,
			pdm: 3241,
			adm: 52
		}

		const transform = this.pan.getTranslateTransform()[0]

		return <View
			style={styles.post.window}
			onLayout={({ nativeEvent }) => {
				this.height = nativeEvent.layout.height
			}}>

			<View style={styles.post.container}>
					
				<Animated.View
					ref={this.container}
					{ ...this.panResponder.panHandlers }
					style={[
						styles.post.columns,
						{ transform: [transform] }
					]}>



					<View
						pointerEvents="none"
						style={styles.post.columnLeft}>
						<Text styles={styles.text.title}>
							[PROFILE INFO]
						</Text>
					</View>



					<View style={styles.post.columnMiddle}>


						<View style={styles.post.coreLeft}>
							<View style={styles.post.profilePictureHolder}>
								<Image
									style={styles.post.profilePicture}
									source={author.picture}
								/>
							</View>
						</View>


						<View style={styles.post.core}>


							<View style={styles.post.header}>

								<View style={styles.post.title}>
									<Text style={styles.post.authorName}>
										{author.name}
									</Text>
									<Text style={styles.post.authorRest}>
										{author.identity}
									</Text>
								</View>

								<View style={styles.post.reactionHolder}>
								</View>

							</View>


							<View style={styles.post.body}>


								<TouchableOpacity onPress={() => console.log("to post")}>
									<Text style={styles.post.bodyText}>
										{post.content}
									</Text>
								</TouchableOpacity>


								<View style={styles.post.coreRight}>
							
									<View style={styles.post.buttonHolder}>
										<View style={styles.post.button}>
											<Text style={styles.post.counter}>
												{post.promos.length}
											</Text>
										</View>
										<Button 
											style={styles.post.button}
											icon="bullhorn"
											iconSize={20}
											color={settings.colors.white}
											onPress={() => console.log("promote")}
										/>
									</View>

									<View style={styles.post.buttonHolder}>
										<View style={styles.post.button}>
											<Text style={styles.post.counter}>
												{post.replies.length}
											</Text>
										</View>
										<Button
											style={styles.post.button}
											icon="reply"
											iconSize={20}
											color={settings.colors.white}
											onPress={() => console.log("reply")}
										/>
									</View>

								</View>


							</View>


						</View>


					</View>



					<View
						pointerEvents="none"
						style={styles.post.columnRight}>
						<Text styles={styles.text.title}>
							[POST INFO]
						</Text>
					</View>



				</Animated.View>

			</View>
		
		</View>
	}


}


export default Post;