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

import { formatPercentage, colorPercentage, magnitude,
		 formatNumber, fromHex } from '../../utils/utils';

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

			contextPanel: "reactions",

			deltaCount: 0,
			deltas: List(),

			countdown: false,
			reacting: false,

			rewards: {},
			showRewards: false,

			promotion: {
				pod: 0,
				aud: 0,
			},

			popularityLabelWidth: 0,

		})

		// Refs
		this.container = React.createRef()

		// Methods
		this.setContextPanel = this.setContextPanel.bind(this)

		this.beginSwipe = this.beginSwipe.bind(this)
		this.offsetSwipe = this.offsetSwipe.bind(this)
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

		this.showPromoter = this.showPromoter.bind(this)
		this.hidePromoter = this.hidePromoter.bind(this)
		this.incrementPromotion = this.incrementPromotion.bind(this)
		this.decrementPromotion = this.decrementPromotion.bind(this)
		this.resetPromotion = this.resetPromotion.bind(this)

		this.delta = this.delta.bind(this)

		this.resizePopularityLabel = this.resizePopularityLabel.bind(this)

		// Swipe
		this.lock = false
		this.location = 0.0
		this.offset = new Animated.Value(0.0)
		this.pan = new Animated.Value(0.0)

		// Reaction
		this.controlAnimator = new Animator()
		this.reaction = new Animated.Value(0.0)
		this.countdown = new Animated.Value(1.0)
		this.countdownOpacity = new Animated.Value(0.0)
		this.reactCountdown = undefined
		this.reactTimer = undefined
		this.rewardTimer = undefined

		// Promotion
		this.promoting = false
		this.promoteResetTimer = null
		this.promoter = new Animated.Value(0.0)

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
		clearTimeout(this.promoteResetTimer)
	}



// CONTEXT

	get contextPanel() {
		return this.getState("contextPanel")
	}

	setContextPanel(panel) {
		this.updateState(state => state.set("contextPanel", panel))
	}




// PAN

	beginSwipe(_, { dx, dy }) {

		if (this.lock) return false

		// Start swipe when x-movement is greater than both 
		// y-movement and the pan threshold
		let willSwipe = (Math.abs(dx) > Math.abs(dy)) &&
			(Math.abs(dx) > this.settings.swipe.threshold)

		// Lock feed scrolling, if swiping
		if (willSwipe) {
			this.props.feedScroll.lock()
			this.offset.stopAnimation()
		}

		// Return result
		return willSwipe

	}


	offsetSwipe() {
		if (this.promoting) {
			this.offset.setOffset(this.layout.post.offsets.promote)
		} else {
			this.offset.setOffset(this.position)
		}
		this.offset.setValue(0)
	}


	overSwipe(x) {
		let overScroll = this.settings.swipe.overScroll
		let weight = this.frozen ? 0.7 : 1.0
		let offset = Math.pow(Math.abs(x), overScroll * weight)
		return x > 0 ? offset : -1 * offset
	}



	swipe(event, gesture) {

		// Ignore while locked
		if (this.lock) return false

		// Unpack gesture
		const { dx } = gesture

		// Decay movement beyond left border
		if (dx < 0 && (this.location === -1.0 || this.frozen)) {
			this.offset.setValue(this.overSwipe(dx))

		// Decay movement beyond right border
		} else if (dx > 0 && (this.location === 1.0 || this.frozen)) {
			this.offset.setValue(this.overSwipe(dx))

		// Otherwise, move with gesture
		} else {
			let anim = Animated.event([ null, { dx: this.offset } ])
			return anim(event, gesture)
		}

	}


	endSwipe(_, { dx }) {

		// Remove offset
		this.offset.flattenOffset()

		// Ignore new position when promoting
		if (this.promoting) return this.showPromoter()

		// Ignore new position when reacting
		if (this.frozen) return this.panTo(0.0)

		// Get movement as % of screen width
		let delta = dx / this.layout.screen.width

		// Pan to nearest interval
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


	get frozen() {
		return this.promoting //|| this.post.reacted
	}


	get intervals() {
		return [
			this.layout.post.offsets.context,
			this.layout.post.offsets.center,
			this.layout.post.offsets.author,
		]
	}

	get position() {
		return this.intervals[this.location + 1]
	}


	panTo(x) {

		// Calculate new location
		this.location = Math.min(1.0, Math.max(-1.0, x + this.location))

		// Move window
		Animated
			.spring(this.offset, {
				toValue: this.position,
				bounciness: this.settings.swipe.bounce,
			})
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





// PROMOTION

	get promoting() {
		return this.getState("promoting")
	}

	showPromoter() {
		this.updateState(
			state => state.set("promoting", true),
			Animated
				.parallel([
					Animated.timing(this.promoter, {
						toValue: 1.0,
						duration: this.timing.fade * 0.5
					}),
					Animated.spring(this.offset, {
						toValue: this.layout.post.offsets.promote,
						bounciness: this.settings.swipe.bounce,
					}),
				])
				.start
		)
	}

	hidePromoter() {
		this.updateState(
			state => state.set("promoting", false),
			Animated
				.parallel([
					Animated.timing(this.promoter, {
						toValue: 0.0,
						duration: this.timing.fade * 0.8,
					}),
					Animated.spring(this.offset, {
						toValue: this.position,
						bounciness: this.settings.swipe.bounce,
					}),
				])
				.start
		)
	}


	incrementPromotion(token) {
		if (this.getState("promotion", token) < this.activeUser.balance[token]) {
			this.updateState(state => state
				.updateIn(["promotion", token], u => u + 1)
			)
		}
	}

	decrementPromotion(token) {
		if (this.getState("promotion", token) > 0) {
			this.updateState(state => state
				.updateIn(["promotion", token], u => u - 1)
			)
		}
	}

	resetPromotion() {
		this.updateState(
			state => state.set("promotion", Map({
				pod: 0,
				aud: 0,
			})),
			() => this.promoteResetTimer = setTimeout(this.hidePromoter, this.timing.fade)
		)
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


	resizePopularityLabel({ nativeEvent }) {
		this.updateState(state => state
			.set("popularityLabelWidth", nativeEvent.layout.width)
		)
	}


	get contextPanelComponent() {
		switch (this.contextPanel) {

			// Reactions
			case "reactions":

				// Unpack reactions
				let reactValues = Range(-10, 10)
					.map(n => n / 10.0)
					.map(n => this.post.reactions
						.filter(r => r.value >= n && r.value < (n + 0.1))
						.size
					)
					.toJS()

				//reactValues = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
				//reactValues = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
				reactValues = [121, 205, 444, 2031, 5332, 6342, 6128, 2034, 1643, 975, 1043, 4981, 8430, 12112, 16321, 14327, 15332, 9234, 3211, 304]
				

				let reactMax = Math.max(0.0, ...reactValues)
				let axisOffset = 0.5 * this.post.popularity * this.layout.post.popularity.width

				return <View style={this.style.post.rightBody}>

					<View style={this.style.post.popularityHolder}>

						{this.post.popularity ?
							<View style={{
									...this.style.post.popularityLabel,
									transform: [{ translateX: axisOffset }],
									justifyContent: (this.post.popularity < 0) ?
										"flex-start" :
										"flex-end"
								}}>
								<Text
									onLayout={this.resizePopularityLabel}
									style={{
										...this.style.post.popularityText,
										position: "absolute",
										color: colorPercentage(
											(1.0 + this.post.popularity) / 2.0,
											[this.colors.bad, this.colors.neutralDarkest, this.colors.good]
										)
									}}>
									{` ${this.post.popularity > 0 ? "+" : " "}${Math.floor(this.post.popularity * 100)}% `}
								</Text>
							</View>
							: null
						}

						<View style={this.style.post.popularityChart}>

							{this.post.reactions.hasSynced ?
								reactValues.map((v, i) => <View
									key={`${this.post.keyName}-react-hist-${i}`}
									style={{
										...this.style.post.popularityBar,
										backgroundColor: colorPercentage(
											i / 19.0,
											[this.colors.bad, this.colors.neutralDark, this.colors.good]
										),
										borderColor: colorPercentage(
											i / 19.0,
											[this.colors.bad, this.colors.neutralDark, this.colors.good]
										),
										height: reactMax === 0 ? 0 :
											Math.round(this.layout.post.popularity.bar.height * (v / reactMax))
									}}
								/>)
								: null
							}
							
							<View style={this.style.post.popularityPlaceholder}>
								{!this.post.reactions.hasSynced ?
										<Spinner color={this.colors.neutralDark} />
									:this.post.reactions.count < 2 ?
										<Text style={this.style.post.popularityPlaceholderText}>
											no reactions{"\n"}so far
										</Text>

									: null
								}
							</View>

							{this.post.popularity ?
								<View style={{
									...this.style.post.popularityAxis,
									transform: [{ translateX: axisOffset }]
								}} />
								: null
							}

						</View>

						<View style={this.style.post.axisLabels}>

							<FontAwesomeIcon
								icon="map-marker-alt"
								size={this.font.size.smallest}
								color={this.colors.bad}
								style={this.style.post.popularityDown}
							/>

							<Text style={this.style.post.popularityNumber}>
								{` x${formatNumber(this.post.reactionCount || 0)}`}
							</Text>

							<FontAwesomeIcon
								icon="map-marker-alt"
								size={this.font.size.smallest}
								color={this.colors.good}
								style={this.style.post.popularityUp}
							/>

						</View>

					</View>

				</View>


			// Costs
			case "spend":
				return <View style={this.style.post.rightBody}>
					<View style={this.style.post.cost}>
						<FontAwesomeIcon
							icon="comment"
							style={this.style.post.costIcon}
						/>
						<View style={this.style.post.currencies}>
							<Currency
								token="pod"
								value={this.post.cost.pod || 0}
							/>
							<Currency
								token="aud"
								value={this.post.cost.aud || 0}
							/>
						</View>
					</View>
					<View style={this.style.post.cost}>
						<FontAwesomeIcon
							icon="bullhorn"
							style={this.style.post.costIcon}
						/>
						<View style={this.style.post.currencies}>
							<Currency
								token="pod"
								value={this.post.promotionSpend.pod}
							/>
							<Currency
								token="aud"
								value={this.post.promotionSpend.aud}
							/>
						</View>
					</View>
				</View>


			// Info
			default:
				return <View style={this.style.post.rightBody}>
					<View style={this.style.post.timestampHolder}>
						<Text style={this.style.post.timestamp}>
							{` ${this.post.datetime}`}
						</Text>
					</View>
				</View>

		}
	}



	render() {

		// Interpolate animators
		let leftCorner = this.offset.interpolate({
			inputRange: [0, this.layout.post.offsets.author],
			outputRange: [0, this.layout.post.header.avatar.corner]
		})
		let rightCorner = this.offset.interpolate({
			inputRange: [0, this.layout.post.offsets.author],
			outputRange: [this.layout.post.header.avatar.corner, 0]
		})
		let counterOpacity = this.offset.interpolate({
			inputRange: [-1 * this.layout.button.normal.height, 0],
			outputRange: [1.0, 0.0]
		})
		let react = this.reaction.interpolate({
			inputRange: [-1.0, 1.0],
			outputRange: ["-90deg", "90deg"]
		})
		let promotionAngle = this.promoter.interpolate({
			inputRange: [0.0, 1.0],
			outputRange: ["0deg", "-35deg"]
		})
		let showOnPromote = {
			...this.style.post.swapButton,
			zIndex: this.promoting ? 2 : 1,
			opacity: this.promoter
		}
		let hideOnPromote = {
			...this.style.post.swapButton,
			zIndex: this.promoting ? 1 : 2,
			opacity: Animated.subtract(1.0, this.promoter)
		}


		// Unpack state
		let { rewards, reaction } = this.getState()
		let reactValue = magnitude(reaction, 0.5)

		let promotePOD = this.getState("promotion", "pod")
		let promoteAUD = this.getState("promotion", "aud")


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
							translateX: Animated.subtract(
								this.offset,
								this.layout.post.offsets.default
							)
						}],
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
								show={this.stage === "loading" ||
									this.stage === "reacting"}
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
									onPress={this.promoting ?
										this.hidePromoter :
										this.showPromoter
									}
									style={{
										color: this.promoting ?
											this.post.promoted ?
												this.colors.white :
												this.colors.major
											:
											this.colors.neutralDark,
										backgroundColor: this.post.promoted ?
											this.colors.major :
											"transparent",
										transform: [{ rotate: promotionAngle }]
									}}
								/>

								<View style={this.style.post.controlPanelInner}>
									<SquareButton
										icon="quote-right"
										onPress={() => console.log("quote")}
										style={hideOnPromote}
									/>
									<Animated.View style={showOnPromote}>
										<Currency
											token="pod"
											value={this.activeUser.balance.pod - promotePOD}
										/>
										<Currency
											token="aud"
											value={this.activeUser.balance.aud - promoteAUD}
										/>
									</Animated.View>
								</View>

								<View style={this.style.post.controlPanelInner}>
									<SquareButton
										icon="comment-medical"
										onPress={() => console.log("reply")}
										style={hideOnPromote}
									/>
									<SquareButton
										icon="trash-alt"
										onPress={(promotePOD === 0 && promoteAUD === 0) ?
											null :
											this.resetPromotion
										}
										style={{
											...showOnPromote,
											opacity: (promotePOD === 0 && promoteAUD === 0) ?
												0.0 :
												showOnPromote.opacity
										}}
									/>
								</View>

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
										opacity: (reactValue !== 0) ? 1.0 : 0.0,
										height: Animated.multiply(
											this.countdown,
											this.layout.post.reactor.countdownHeight
										),
									}} />

								</View>

							</FadingView>

						</View>


					</View>



					<View style={this.style.post.right}>

						<Animated.View style={{
								...this.style.post.rightCounters,
								opacity: counterOpacity,
							}}>

							<View style={this.style.post.controlPanelInner}>
								<SquareButton
									style={[
										!this.promoting ?
											this.style.post.counter
											: null,
										hideOnPromote
									]}
									label={formatNumber(this.post.promotionCount || 0)}
									labelStyle={this.style.post.counterText}
									onPress={() => console.log("view promos")}
								/>
								<SquareButton
									icon="plus-circle"
									color={promotePOD === this.activeUser.balance.pod ?
										this.colors.neutral :
										this.colors.good
									}
									onPress={() => this.incrementPromotion("pod")}
									style={showOnPromote}
								/>
							</View>

							<View style={this.style.post.controlPanelInner}>
								<SquareButton
									style={[
										!this.promoting ?
											this.style.post.counter
											: null,
										hideOnPromote
									]}
									label={formatNumber(this.post.quoteCount || 0)}
									labelStyle={this.style.post.counterText}
									onPress={() => console.log("view quotes")}
								/>
								<Animated.View style={{
										...showOnPromote,
										...this.style.post.promoteCounterPOD,
									}}>
									<Text style={{
											...this.style.post.promoteCounterText,
											fontSize: promotePOD >= 100 ?
												this.font.size.tiny :
												this.font.size.smallest
										}}>
										{formatNumber(promotePOD)}
									</Text>
								</Animated.View>
							</View>

							<View style={this.style.post.controlPanelInner}>
								<SquareButton
									style={[
										!this.promoting ?
											this.style.post.counter
											: null,
										hideOnPromote
									]}
									label={formatNumber(this.post.replyCount || 0)}
									labelStyle={this.style.post.counterText}
									onPress={() => console.log("view replies")}
								/>
								<SquareButton
									icon="minus-circle"
									color={promotePOD === 0 ?
										this.colors.neutral :
										this.colors.bad
									}
									onPress={() => this.decrementPromotion("pod")}
									style={showOnPromote}
								/>
							</View>

						</Animated.View>

						<View style={this.style.post.rightControls}>

							<View style={this.style.post.controlPanelInner}>
								<SquareButton
									style={[
										(this.contextPanel === "reactions") ?
											this.style.post.contextButtonOn :
											this.style.post.contextButtonOff,
										hideOnPromote,
									]}
									color={this.contextPanel === "reactions" ?
										this.colors.white :
										this.colors.neutralDark
									}
									icon="map-marker-alt"
									iconStyle={this.style.post.contextButtonReactIcon}
									onPress={() => this.setContextPanel("reactions")}
								/>
								<SquareButton
									icon="plus-circle"
									color={promoteAUD === this.activeUser.balance.aud ?
										this.colors.neutral :
										this.colors.good
									}
									onPress={() => this.incrementPromotion("aud")}
									style={showOnPromote}
								/>
							</View>
							
							<View style={this.style.post.controlPanelInner}>
								<SquareButton
									style={[
										(this.contextPanel === "spend") ?
											this.style.post.contextButtonOn :
											this.style.post.contextButtonOff,
										hideOnPromote,
									]}
									color={this.contextPanel === "spend" ?
										this.colors.white :
										this.colors.neutralDark
									}
									icon="coins"
									onPress={() => this.setContextPanel("spend")}
								/>
								<Animated.View style={{
										...showOnPromote,
										...this.style.post.promoteCounterAUD,
									}}>
									<Text style={{
											...this.style.post.promoteCounterText,
											fontSize: promoteAUD >= 100 ?
													this.font.size.tiny :
													this.font.size.smallest
										}}>
										{formatNumber(promoteAUD)}
									</Text>
								</Animated.View>
							</View>

							<View style={this.style.post.controlPanelInner}>
								<SquareButton
									style={[
										(this.contextPanel === "info") ?
											this.style.post.contextButtonOn :
											this.style.post.contextButtonOff,
										hideOnPromote,
									]}
									color={this.contextPanel === "info" ?
										this.colors.white :
										this.colors.neutralDark
									}
									icon="info"
									onPress={() => this.setContextPanel("info")}
								/>
								<SquareButton
									icon="minus-circle"
									color={promoteAUD === 0 ?
										this.colors.neutral :
										this.colors.bad
									}
									onPress={() => this.decrementPromotion("aud")}
									style={showOnPromote}
								/>
							</View>

						</View>

						<Animated.View style={{
								...this.style.post.rightCore,
								opacity: hideOnPromote.opacity,
							}}>
							{this.contextPanelComponent}
						</Animated.View>

						<View style={this.style.post.rightEdge}>

							<SquareButton
								icon="exclamation-triangle"
								onPress={() => console.log("report")}
							/>
							<SquareButton 
								icon="paperclip"
								onPress={() => console.log("copy link")}
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