import React from 'react';
import Component from '../../components/component';
import { Text, View, Image, Animated, Easing, Dimensions, ScrollView,
		 PanResponder, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from 'expo-fontawesome';
import { toJS, computed } from 'mobx';
import { inject, observer } from 'mobx-react';

import { Map, List, Range } from 'immutable';

import TouchableWithoutFeedback from '../../components/inputs/touchableWithoutFeedback';

import { formatPercentage, colorPercentage, magnitude } from '../../utils/utils';

import FadingView from '../../components/animated/fadingView';
import Avatar from '../../components/media/avatar';
import IntegrityGauge from '../../components/display/integrityGauge';
import AffinityGauge from '../../components/display/affinityGauge';
import PostTitle from './title';
import Picture from '../../components/media/picture';
import Gallery from '../../components/media/gallery';
import Link from '../../components/display/link';
import SquareButton from '../../components/buttons/squareButton';
import FollowButton from '../../components/buttons/followButton';
import Spinner from '../../components/animated/spinner';
import Currency from '../../components/display/currency';

import Animator from '../../utils/animator';




@inject("store")
@observer
class Post extends Component {


	constructor() {

		super({

			reaction: 0,

			deltaCount: 0,
			deltas: List(),

			countdown: false,
			reacting: false,

			rewards: {},
			showRewards: false,

		})

		// Refs
		this.container = React.createRef()

		// Methods
		this.beginSwipe = this.beginSwipe.bind(this)
		this.swipe = this.swipe.bind(this)
		this.endSwipe = this.endSwipe.bind(this)
		this.panTo = this.panTo.bind(this)
		this.lockPan = this.lockPan.bind(this)
		this.unlockPan = this.unlockPan.bind(this)

		this.resize = this.resize.bind(this)

		this.setReaction = this.setReaction.bind(this)
		this.setCountdown = this.setCountdown.bind(this)
		this.clearCountdown = this.clearCountdown.bind(this)
		this.sendReaction = this.sendReaction.bind(this)
		this.showRewards = this.showRewards.bind(this)
		this.hideRewards = this.hideRewards.bind(this)

		this.delta = this.delta.bind(this)

		// Swipe
		this.lock = false
		this.location = new Animated.Value(0.0)
		this.offset = new Animated.Value(0.0)

		// Reaction
		this.controlAnimator = new Animator()
		this.reaction = new Animated.Value(0.0)
		this.countdown = new Animated.Value(1.0)
		this.countdownOpacity = new Animated.Value(0.0)
		this.reactCountdown = undefined
		this.reactTimer = undefined
		this.rewardTimer = undefined

		// Dimensions
		this.height = null

		// Swipe Responder
		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: this.beginSwipe,
			onPanResponderGrant: this.offsetSwipe,
			onPanResponderMove: this.swipe,
			onPanResponderRelease: this.endSwipe,
		})

	}



// GETTERS

	@computed
	get post() {
		return this.nation.get("post", this.props.address)
	}

	@computed
	get author() {
		return this.post.author
	}




// LIFECYCLE

	componentDidMount() {
		this.controlAnimator.play()
	}

	componentDidUpdate() {
		this.controlAnimator.play()
	}


	componentWillUnmount() {
		clearTimeout(this.reactCountdown)
		clearTimeout(this.reactTimer)
		clearTimeout(this.rewardTimer)
	}



// PAN

	beginSwipe(_, { dx, dy }) {

		if (this.lock) return false

		// Start swipe when x-movement is greater than both 
		// y-movement and the pan threshold
		let willSwipe = Math.abs(dx) > Math.abs(dy) &&
			Math.abs(dx) > this.settings.swipe.threshold

		// Lock feed scrolling, if swiping
		if (willSwipe) this.props.feedScroll.lock()

		// Return result
		return willSwipe

	}


	overSwipe(x) {
		return x > 0 ?
			Math.pow(x, this.settings.swipe.overScroll) :
			-1 * Math.pow(-1 * x, this.settings.swipe.overScroll)
	}



	swipe(event, gesture) {

		// Ignore while locked
		if (this.lock) return false

		// Unpack gesture
		const { dx } = gesture

		// Decay movement beyond left border
		if (this.location._value === -1.0 && dx < 0) {
			this.offset.setValue(this.overSwipe(dx))

		// Decay movement beyond right border
		} else if (this.location._value === 1.0 && dx > 0) {
			this.offset.setValue(this.overSwipe(dx))

		// Otherwise, move with gesture
		} else {
			let anim = Animated.event([ null, { dx: this.offset } ])
			return anim(event, gesture)
		}

	}


	endSwipe(_, { dx }) {

		// Get movement as % of screen width
		let delta = dx / this.layout.screen.width

		if (delta < -1 * this.settings.swipe.xLimit) {
			this.panTo(-1.0)
		} else if (delta > this.settings.swipe.xLimit) {
			this.panTo(1.0)
		} else {
			this.panTo(0.0)
		}

	}


	lockPan() {
		this.lock = true
	}

	unlockPan() {
		this.lock = false
	}


	panTo(x) {

		// Calculate new location
		let destination = Math.min(1.0, Math.max(-1.0, x + this.location._value))

		// Move window
		Animated
			.parallel([
				Animated.spring(this.location, {
					toValue: destination,
					bounciness: this.settings.swipe.bounce,
				}),
				Animated.spring(this.offset, {
					toValue: 0.0,
					bounciness: this.settings.swipe.bounce,
				})
			])
			.start(({ finished }) => {
				if (finished) this.props.feedScroll.unlock()
			})

	}





// REACTION

	setReaction(x) {

		// Clear react countdown
		this.clearCountdown()

		// Determine magnitude of change
		let { reaction, deltaCount } = this.getState()
		let difference = Math.abs(magnitude(reaction + x) - magnitude(reaction))

		// Make delta
		let anim = new Animated.Value(0.0)
		let delta = {
			key: `${this.props.keyName}-delta-${deltaCount + 1}`,
			value: x,
			anim
		}

		// Update state
		this.updateState(

			// Set new value and spawn a delta
			state => state
				.update("deltaCount", d => d + 1)
				.update("reaction", r => r + x)
				.update("deltas", d => d.push(delta)),

			// Callback
			() => {

				// Animate pointer
				Animated
					.spring(this.reaction, {
						bounciness: 1.0,
						toValue: magnitude(this.getState("reaction")),
					})
					.start(),

				// Animate delta
				Animated
					.timing(anim, {
						toValue: 1.0,
						duration: this.timing.submitWarning,
						easing: Easing.back(),
					})
					.start(({ finished }) => finished ?
						this.updateState(state => state.update("deltas", d => d.rest()))
						: null
					)

				// Start send countdown
				this.reactCountdown = setTimeout(
					this.setCountdown,
					this.timing.submitWarning
				)

			}

		)

	}


	setCountdown() {
		this.updateState(

			// Show countdown
			state => state.set("countdown", true),

			// Schedule callback
			() => {

				// Start countdown animation
				Animated
					.sequence([
						Animated.timing(this.countdownOpacity, {
							toValue: 1.0,
							duration: this.timing.fade
						}),
						Animated.timing(this.countdown, {
							toValue: 0.0,
							delay: this.timing.pause,
							duration: this.timing.submit - this.timing.fade - this.timing.pause,
							easing: Easing.out(Easing.ease),
						})
					])
					.start()

				// Send reaction
				this.reactTimer = setTimeout(
					this.sendReaction,
					this.timing.submit
				)

			}

		)
	}


	clearCountdown() {

		// Reset timers
		clearTimeout(this.reactCountdown)
		clearTimeout(this.reactTimer)

		// Hide bar
		Animated
			.timing(this.countdown, {
				toValue: 1.0,
				duration: this.timing.reset,
			})
			.start()

	}



	async sendReaction() {
		this.updateState(

			// Set reacting state
			state => state.set("reacting", true),

			// Submit reaction to server
			() => this.activeUser
				.react(this.post, magnitude(this.getState("reaction")))
				.then(this.showRewards)
				.catch(console.error)

		)
	}


	showRewards(rewards) {

		// Reset existing timer, if required
		clearTimeout(this.rewardTimer)

		// Ignore if no rewards received
		if (!rewards ||
			((!rewards.pod || rewards.pod === 0) &&
				(!rewards.aud || rewards.aud === 0)))
			return this.hideRewards()

		// Set state
		this.updateState(

			// Turn on reward flag
			state => state
				.set("reacting", false)
				.set("rewards", rewards)
				.set("showRewards", true),

			// Schedule turning off reward flag
			() => this.rewardTimer = setTimeout(this.hideRewards, this.timing.highlight)

		)

	}


	hideRewards() {
		this.updateState(state => state.set("showRewards", false))
	}





// SIZING

	resize({ nativeEvent }) {
		this.height = nativeEvent.layout.height
	}





// LINKS

	postLink() {
		this.props.navigate.to("Post", { address: this.props.address })
	}





// RENDER


	get stage() {
		if (!this.post.ready) return "loading"
		if (this.getState("reacting")) return "reacting"
		if (this.getState("showRewards")) return "rewarding"
		if (!this.post.reacted) return "pending"
		return "reacted"
	}


	delta({ key, anim, value }) {

		// Calculate animated properties
		let size = this.layout.button.normal.height
		let displacement = Animated.multiply(anim, -0.9 * value * size)
		let opacity = anim.interpolate({
			inputRange: [0.0, 0.6, 1.0],
			outputRange: [1.0, 1.0, 0.0],
		})

		return <Animated.View
			key={key}
			style={{
				...this.style.post.reactorDelta,
				transform: [{ translateY: displacement }],
				opacity: opacity
			}}>
			<Text style={{
					...this.style.post.reactorText,
					transform: [
						{ translateX: -0.5 * size },
						{ translateY: -0.9 * value * size }
					],
					color: value > 0 ? this.colors.good : this.colors.bad,
				}}>
				{`${value > 0 ? "+" : ""}${value}`}
			</Text>
		</Animated.View>

	}


	render() {

		// Calculate transform
		let translate = Animated.add(
			Animated.multiply(this.location, this.layout.post.span),
			this.offset
		)

		// Picture corner animator
		let leftCorner = translate.interpolate({
			inputRange: [0, this.layout.post.span],
			outputRange: [0, this.layout.post.header.avatar.corner]
		})
		let rightCorner = translate.interpolate({
			inputRange: [0, this.layout.post.span],
			outputRange: [this.layout.post.header.avatar.corner, 0]
		})


		// Unpack state
		let { rewards, reaction } = this.getState()
		let reactValue = magnitude(reaction, 0.5)
		let react = this.reaction.interpolate({
			inputRange: [-1.0, 1.0],
			outputRange: ["-90deg", "90deg"]
		})


		// Unpack reactions
		let reactValues = Range(-10, 9)
			.map(n => this.post.reactions
				.filter(r => r.value >= n && r.value < (n + 1))
				.size
			)
			.toJS()
		console.log(reactValues)
		let reactMax = Math.max(0.0, ...reactValues)


		// Build components
		return <View
			key={this.props.keyName}
			tappable
			style={this.style.post.window}
			onLayout={this.resize}>

			<View style={this.style.post.container}>
					
				<Animated.View
					ref={this.container}
					{ ...this.panResponder.panHandlers }
					style={{
						...this.style.post.columns,
						transform: [{
							translateX: Animated.subtract(translate, this.layout.post.offset)
						}]
					}}>


					<View style={this.style.post.left}>

						<View style={this.style.post.leftEdge}>
							<FollowButton user={this.author} />
							<SquareButton 
								icon="at"
								onPress={() => console.log("mention")}
							/>
							<SquareButton 
								icon="user"
								onPress={() => console.log("full profile")}
							/>
						</View>

						<View style={this.style.post.leftBody}>
							<Text style={this.style.post.bio}>
								{this.author.about}
							</Text>
						</View>

					</View>



					<View style={this.style.post.middle}>



						<View style={this.style.post.middleLeft}>

							<Avatar
								user={this.author}
								style={this.style.post.avatar}
								corner={{
									borderBottomRightRadius: rightCorner,
									borderBottomLeftRadius: leftCorner
								}}
							/>

							<IntegrityGauge user={this.author} />

							<AffinityGauge user={this.author} />

						</View>



						<View style={this.style.post.middleCore}>


							<View style={this.style.post.header}>
								<PostTitle post={this.post} />
							</View>


							<View style={this.style.post.body}>

								{this.post.text ?
									<View style={this.style.post.textHolder}>

										<Text style={this.style.post.text}>
											{this.post.markup
												.map(({ type, target, text }, i) => {

													// Build key
													let key = `${this.props.keyName}-text-${i}`

													// Add actions and return
													switch (type) {

														case "link": return <TouchableWithoutFeedback
															key={key}
															onPress={this.toLink(target)}>
															<Text style={this.style.post[type]}>
																{text}
															</Text>
														</TouchableWithoutFeedback>

														case "mention": return <TouchableWithoutFeedback
															key={key}
															onPress={this.toUser(target)}>
															<Text style={this.style.post[type]}>
																{text}
															</Text>
														</TouchableWithoutFeedback>

														// Return plain text
														default: return <Text
															key={key}
															style={this.style.post[type]}>
															{text}
														</Text>

													}

												})
											}
										</Text>
									</View>
									: null
								}

								

								{this.post.media.length === 1 ?
									<View style={this.style.post.mediaSingle}>
										<Picture
											style={this.style.post.mediaImage}
											uri={this.post.media[0].uri}
										/>
									</View>

								: this.post.media.length > 0 ?
									<TouchableWithoutFeedback
										onPressIn={this.lockPan}
										onPressOut={this.unlockPan}>
										<Gallery
											keyName={`post-${this.post.address}`}
											media={this.post.media}
										/>
									</TouchableWithoutFeedback>

								: null}

								{this.post.links.length > 0 ?
									<View style={this.style.post.linkHolder}>
										{this.post.links.map((url, i) =>
											<Link
												key={`${this.props.keyName}-link-${i}`}
												url={url}
											/>
										)}
									</View>
									: null
								}

							</View>

						</View>





						<View style={this.style.post.middleRight}>
					

							<FadingView
								show={this.stage === "loading" || this.stage === "reacting"}
								animator={this.controlAnimator}
								style={this.style.post.controlPanel}>
								<Spinner color={this.colors.neutralDark} />
							</FadingView>


							<FadingView
								show={this.stage === "rewarding"}
								animator={this.controlAnimator}
								style={this.style.post.rewardPanel}>
								{rewards.pod && rewards.pod > 0 ?
									<Currency delta token="pod" value={rewards.pod} />
									: null
								}
								{rewards.aud && rewards.aud > 0 ?
									<Currency delta token="aud" value={rewards.aud} />
									: null
								}
							</FadingView>


							<FadingView
								show={this.stage === "reacted"}
								animator={this.controlAnimator}
								style={this.style.post.controlPanel}>
								<SquareButton 
									icon="bullhorn"
									onPress={() => console.log("promote")}
								/>
								<SquareButton
									icon="quote-right"
									onPress={() => console.log("quote")}
								/>
								<SquareButton
									icon="comment-medical"
									onPress={() => console.log("reply")}
								/>
							</FadingView>


							<FadingView
								tappable={this.stage === "pending"}
								show={this.stage === "pending"}
								animator={this.controlAnimator}
								style={this.style.post.controlPanel}>

								<SquareButton
									icon="plus-circle"
									color={this.colors.good}
									onPress={() => this.setReaction(1)}
								/>

								<Animated.View style={{
										...this.style.post.reactor,
										transform: [{ rotate: react }],
									}}>
									<FontAwesomeIcon
										icon="map-marker-alt"
										color={colorPercentage(
											(reactValue + 1.0) * 0.5,
											[this.colors.bad, this.colors.neutralDark, this.colors.good]
										)}
										style={this.style.post.reactorIcon}
									/>
								</Animated.View>

								<SquareButton
									icon="minus-circle"
									color={this.colors.bad}
									onPress={() => this.setReaction(-1)}
								/>

								<View
									pointerEvents="none"
									style={this.style.post.reactorOverlay}>

									{this.getState("deltas").map(this.delta)}

									<Animated.View style={{
										...this.style.post.reactorCountdown,
										opacity: this.countdownOpacity,
										height: Animated.multiply(this.countdown, this.layout.post.reactor.countdownHeight),
									}} />

								</View>

							</FadingView>


						</View>


					</View>



					<View
						pointerEvents="none"
						style={this.style.post.right}>

						<View style={this.style.post.rightCounters}>

							<SquareButton
								label={this.post.promotionCount}
								onPress={() => console.log("view promos")}
							/>
							<SquareButton
								label={this.post.quoteCount}
								onPress={() => console.log("view quotes")}
							/>
							<SquareButton
								label={this.post.replyCount}
								onPress={() => console.log("view replies")}
							/>

						</View>

						<View style={this.style.post.rightCore}>

							<View style={this.style.post.rightHeader}>
								<Text style={this.style.post.timestamp}>
									{this.post.date}
								</Text>
							</View>

							<View style={this.style.post.rightBody}>
								
								<View style={this.style.post.rightCost}>
									<Currency currency="pod" value={this.post.cost.pod} />
									<Currency currency="aud" value={this.post.cost.aud} />
								</View>

								<View style={this.style.post.popularityHolder}>

									<View style={this.style.post.popularityChart}>

										{reactValues.map((v, i) => <View
											key={`${this.post.keyName}-react-hist-${i}`}
											style={{
												...this.style.post.popularityBar,
												height: reactMax === 0 ? 0 :
													Math.round(this.layout.post.popularity.height * (v / reactMax))
											}}
										/>)}

										<View style={this.style.post.popularityAxis} />

									</View>

								</View>

							</View>

						</View>

						<View style={this.style.post.rightEdge}>

							<SquareButton
								icon="exclamation-triangle"
								onPress={() => console.log("report")}
							/>
							<SquareButton 
								icon="coins"
								onPress={() => console.log("paid promotion")}
							/>
							<SquareButton
								icon="bookmark"
								onPress={() => console.log("bookmark")}
							/>

						</View>

					</View>


				</Animated.View>

			</View>
		
		</View>
	}


}


export default Post;