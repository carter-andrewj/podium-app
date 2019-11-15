import React from 'react';
import Component from '../../components/component';
import { Text, View, Image, Animated, Dimensions,
		 PanResponder, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

import { formatPercentage, colorPercentage } from '../../utils/utils';

import globals from '../../globals';
import settings from '../../settings';
import styles from '../../styles/styles';

import SquareButton from '../../components/buttons/squareButton';
import FollowButton from '../../components/buttons/followButton';
import Spinner from '../../components/animated/spinner';



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

		this.corner = styles.post.profilePictureHolder.borderBottomRightRadius

		this.state = {
			location: 0
		}

		this.container = React.createRef()

		this.animUpdate = false

		this.beginPan = this.beginPan.bind(this)
		this.resetPan = this.resetPan.bind(this)
		this.endPan = this.endPan.bind(this)
		this.setLocation = this.setLocation.bind(this)
		this.panTo = this.panTo.bind(this)

		// Set up screen pan
		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: this.beginPan,
			onPanResponderGrant: this.resetPan,
			onPanResponderMove: Animated
				.event([null, { dx: this.pan.x }]),
			onPanResponderRelease: this.endPan,
			onResponderTerminate: () => { globals.screenLock = false }	
		})

	}


	componentWillMount() {
		let post = this.props.store.posts.get(this.props.address)
		let author = this.props.store.users.get(post.author)
		this.updateState(state => state
			.set("post", post)
			.set("author", author)
		)
	}



// PAN

	beginPan(event, { dx, dy }) {

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
			globals.screenLock = this.props.address
			return true

		// Otherwise, do nothing
		} else {
			return false
		}

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


	endPan(_, { dx, vx }) {

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



// RENDER

	render() {

		// Unpack state
		let post = this.state.post
		let author = this.state.author

		// Pan animator
		let transform = this.pan.getTranslateTransform()[0]

		// Picture corner animator
		let leftCorner = this.pan.x
			.interpolate({
				inputRange: [0, this.span],
				outputRange: [0, this.corner]
			})
		let rightCorner = this.pan.x
			.interpolate({
				inputRange: [0, this.span],
				outputRange: [this.corner, 0]
			})

		// Build components
		return <View
			key={this.props.key}
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



					<View style={styles.post.columnLeft}>

						<View style={styles.post.leftEdge}>
							<FollowButton address={author.address} />
							<SquareButton 
								icon="at"
								size={1.1}
								color={settings.colors.neutral}
								background={settings.colors.white}
								onPress={() => console.log("mention")}
							/>
							<SquareButton 
								icon="envelope"
								size={1.1}
								color={settings.colors.neutral}
								background={settings.colors.white}
								onPress={() => console.log("message")}
							/>
						</View>

						<View style={styles.post.left}>
							<Text style={styles.post.bio}>
								{author.bio}
							</Text>
						</View>

					</View>



					<View style={styles.post.columnMiddle}>



						<View style={styles.post.coreLeft}>


							<Animated.View
								style={[
									styles.post.profilePictureHolder,
									{
										borderBottomRightRadius: rightCorner,
										borderBottomLeftRadius: leftCorner
									}
								]}>
								{author.picture ?
									<Image
										style={styles.post.profilePicture}
										source={author.picture}
									/>
									:
									<Spinner/>
								}
							</Animated.View>


							<View style={[
									styles.post.gauge,
									{ backgroundColor: colorPercentage(author.integrity) }
								]}>
								<FontAwesomeIcon
									icon="balance-scale"
									size={12}
									color={settings.colors.white}
									style={{ marginBottom: 1 }}
								/>
								<Text style={styles.post.gaugeText}>
									{formatPercentage(author.integrity, 0)}
								</Text>
							</View>


							<View style={[
									styles.post.gauge,
									{ backgroundColor: colorPercentage(author.affinity) }
								]}>
								<FontAwesomeIcon
									icon="dna"
									size={10}
									color={settings.colors.white}
								/>
								<Text style={styles.post.gaugeText}>
									{formatPercentage(author.affinity, 0)}
								</Text>
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
										{post.text}
									</Text>
								</TouchableOpacity>


								<View style={styles.post.coreRight}>
							
									<View style={styles.post.buttonHolder}>
										<SquareButton
											label={post.promotionCount}
											size={1.1}
											color={settings.colors.neutral}
											background={settings.colors.white}
											onPress={() => console.log("view promos")}
										/>
										<SquareButton 
											icon="bullhorn"
											size={1.1}
											color={settings.colors.neutral}
											background={settings.colors.white}
											contentStyle={{ transform: [{ translateY: -1 }]}}
											onPress={() => console.log("promote")}
										/>
									</View>

									<View style={styles.post.buttonHolder}>
										<SquareButton
											label={post.replyCount}
											size={1.1}
											color={settings.colors.neutral}
											background={settings.colors.white}
											onPress={() => console.log("view replies")}
										/>
										<SquareButton
											icon="reply"
											size={1.1}
											color={settings.colors.neutral}
											background={settings.colors.white}
											contentStyle={{ transform: [{ translateX: -1 }]}}
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