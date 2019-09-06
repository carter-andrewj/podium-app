import React from 'react';
import Page from '../utils/page';
import { Text, View, TextInput, Dimensions, Animated, FlatList,
		 Easing, PanResponder, TouchableWithoutFeedback } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';
import { inject, observer } from 'mobx-react';
import { createStackNavigator, NavigationActions } from 'react-navigation';

import globals from '../globals';
import settings from '../settings';
import styles from '../styles/styles';

import Screen from './screen';

import Button from '../components/button';

import Feed from './posts/feed';
import CreatePost from './posts/createPost';
import PostPage from './posts/postPage';

import ProfilePage from './profiles/profilePage';
import WalletPage from './profiles/walletPage';
import FollowersPage from './profiles/followersPage';
import FollowingPage from './profiles/followingPage';
import IntegrityPage from './profiles/integrityPage';

import QuickProfile from './profiles/quickProfile';

import QuickAlerts from './alerts/quickAlerts';
import AlertsPage from './alerts/alertsPage';

import SearchPage from './search/searchPage';

import ConstitutionPage from './constitution/constitutionPage';

import HelpPage from './help/helpPage';
import SettingsPage from './settings/settingsPage';



const Pages = createStackNavigator(

	// Pages
	{

		Feed: Feed,
		CreatePost: CreatePost,
		Post: PostPage,

		Profile: ProfilePage,
		Wallet: WalletPage,
		Followers: FollowersPage,
		Following: FollowingPage,
		Integrity: IntegrityPage,

		Alerts: AlertsPage,

		Search: SearchPage,

		Constitution: ConstitutionPage,

		Help: HelpPage,
		Settings: SettingsPage,

	},

	// Options
	{
		initialRouteName: "Feed",
		headerMode: "none",
		cardStyle: {
			backgroundColor: settings.colors.neutralPalest
		},
		cardShadowEnabled: false,
		transitionConfig : () => ({
			transitionSpec: {
				duration: 0,
				timing: Animated.timing,
				easing: Easing.step0,
			},
		}),
	}

)





@inject("store")
@observer
class Core extends Page {


	static router = Pages.router;


	constructor() {

		super()

		this.span = Dimensions.get("window").width *
			settings.layout.drawerSize,
		this.location = 0
		this.pan = new Animated.ValueXY()
		this.animUpdate = false

		this.state = {

			location: 0,

			banner: [],

			search: "",

		}

		this.searchTimer = null;

		this.nav = null;
		this.searchInput = null;

		this.setLocation = this.setLocation.bind(this)
		this.resetPan = this.resetPan.bind(this)
		this.panTo = this.panTo.bind(this)
		this.openLeft = this.openLeft.bind(this)
		this.openRight = this.openRight.bind(this)
		this.closeDrawer = this.closeDrawer.bind(this)

		this.navigate = this.navigate.bind(this)

		this.setBanner = this.setBanner.bind(this)

		this.quickSearch = this.quickSearch.bind(this)
		this.typeSearch = this.typeSearch.bind(this)
		this.search = this.search.bind(this)
		this.clearSearch = this.clearSearch.bind(this)

		this.signOut = this.signOut.bind(this)

		// Set up screen pan
		this.panResponder = PanResponder.create({

			// Handle trigger conditions
			onMoveShouldSetPanResponder: (_, { dx, dy }) => {

				// Return true if already locking screen
				if (globals.screenLock === "core") {
					return true

				// Otherwise, check if screen is already locked
				} else if (globals.screenLock) {
					return false

				// Otherwise, check if core should lock the screen
				} else if (Math.abs(dx) > Math.max(
						settings.layout.panStart * 2,
						Math.abs(dy)
					)) {
					globals.screenLock = "core"
					return true

				// Otherwise, do nothing
				} else {
					return false
				}
		
			},

			// Handle pan start
			onPanResponderGrant: this.resetPan,

			// Handle screen movement
			onPanResponderMove: (event, gesture) => {

				// Calculate location
				const delta = -1.0 * gesture.dx
				const decay = settings.layout.overScroll
				let beyond;

				// Decay movement beyond left border
				if (this.location === -1 && delta < 0) {
					beyond = -1.0 * Math.pow(Math.abs(delta), decay)

				// Decay movement beyond right border
				} else if (this.location === 1 && delta > 0) {
					beyond = Math.pow(delta, decay)
				}

				// Animate decay beyond borders
				if (beyond) {
					this.pan
						.setValue({ x: -1 * beyond, y: 0 })

				// Otherwise, move with gesture
				} else {
					let anim = Animated
						.event([null, { dx: this.pan.x }])
					return anim(event, gesture)
				}

			},

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


	openLeft() {
		return this.panTo(-1)
	}

	openRight() {
		return this.panTo(1)
	}

	closeDrawer() {
		return this.panTo(-1 * this.location)
	}



	navigate(to, params={}) {
		this.closeDrawer()
			.then(() => this.nav.props.navigation
				.navigate(to, params)
			)
	}



	quickSearch() {
		this.openRight()
			.then(this.searchInput.focus)
	}

	typeSearch(s) {
		clearTimeout(this.searchTimer)
		this.updateState(
			state => state.set("search", s),
			() => {
				this.searchTimer = setTimeout(
					this.search,
					this.props.store.config.validation.delay
				)
			}
		)
	}

	search() {
		const target = this.state.search
		this.updateState(
			state => state.set("searching", true),
			() =>  this.props.store.api
				.search({
					target: target,
					among: this.state.searchFilter
				})
				.then(result => {
					if (this.state.search === target) {
						this.updateState(state => state
							.set("results", result)
							.set("searching", false)
						)
					}
				})
				.catch(console.error)
		)
	}

	clearSearch() {
		this.updateState(
			state => state.set("search", ""),
			() => this.searchInput.focus()
		)
	}





	setBanner(...args) {
		let banner = args.map(b => {
			switch (b) {

				// Spacer
				case "spacer":
					return <View style={styles.container} />

				// Back button
				case "back":
					return <Button
						key="banner-back"
						icon="arrow-left"
						onPress={() => this.nav.props.navigation.goBack(null)}
					/>

				// Feed button
				case "alerts":
					return <Button
						key="banner-alerts"
						icon="bell"
						onPress={this.openLeft}
					/>

				// New Post button
				case "post":
					return <Button
						key="banner-post"
						icon="comment"
						onPress={() => this.navigate("CreatePost")}
					/>

				// Quick Search button
				case "search":
					return <Button
						key="banner-search"
						icon="search"
						onPress={this.quickSearch}
					/>

				// Feed button
				case "feed":
					return <Button
						key="banner-feed"
						icon="list"
						onPress={() => this.navigate("Feed")}
					/>

				// Provided button
				default:
					return b

			}
		})
		this.updateState(state => state.set("banner", banner))
	}








	signOut() {
		this.props.store.session
			.signOut()
			.then(() => this.props.navigation.navigate("SignIn"))
			.catch(console.error)
	}



// RENDER

	render() {

		const { navigation } = this.props;

		const transform = this.pan.getTranslateTransform()[0]

		return <Screen style={[
				styles.container,
				{ backgroundColor: settings.colors.white }
			]}>

			<Animated.View
				{ ...this.panResponder.panHandlers }
				style={[
					styles.layout.container,
					{ transform: [transform] }
				]}>



				<View style={styles.layout.leftDrawer}>
					<QuickAlerts navigate={this.navigate} />
					<QuickProfile navigate={this.navigate} />
				</View>




				<View style={styles.layout.main}>

					<View style={styles.layout.mainHeader}>
						{this.state.banner}
					</View>

					<View style={styles.layout.mainContent}>
						<Pages
							ref={ref => this.nav = ref}
							navigation={navigation}
							screenProps={{
								animUpdate: this.animUpdate,
								setBanner: this.setBanner
							}}
						/>
					</View>

					{this.state.location !== 0 ?
						<TouchableWithoutFeedback
							onPress={this.closeDrawer}>
							<View style={styles.layout.cover} />
						</TouchableWithoutFeedback>
						: null
					}

				</View>





				<View style={styles.layout.rightDrawer}>

					<View style={styles.layout.search}>

						<TextInput

							ref={ref => this.searchInput = ref}
							key="quick-search"

							placeholder="Search..."
							value={this.state.search}
							onChangeText={this.typeSearch}

							style={styles.layout.searchInput}
							autoCorrect={false}
							autoCapitalize="none"
				
							returnKeyType="go"
							onSubmitEditing={this.search}

						/>

						<TouchableWithoutFeedback
							onPress={() => this.searchInput.focus()}>
							<View style={styles.layout.searchOverlay}>

								<View style={styles.layout.searchIcon}>
									<FontAwesomeIcon
										icon="search"
										size={14}
										color={settings.colors.neutralDarkest}
										style={styles.layout.searchIcon}
									/>
								</View>

								<View style={styles.layout.searchIcon}>
									<FontAwesomeIcon
										icon="times"
										size={12}
										color={this.state.search.length > 0 ?
											settings.colors.bad :
											"transparent"
										}
										onPress={this.clearSearch}
									/>
								</View>

							</View>
						</TouchableWithoutFeedback>

					</View>

					<View style={styles.layout.results}>

					</View>

					<View style={styles.layout.searchLinks}>

						<Button
							onPress={() => this.navigate("Constitution")}
							icon="university"
							iconSize={settings.iconSize.largish}
						/>

						<Button
							onPress={() => this.navigate("Help")}
							icon="question"
							iconSize={settings.iconSize.largish}
						/>

						<Button
							onPress={() => this.navigate("Settings")}
							icon="cogs"
							iconSize={settings.iconSize.largish}
						/>

						<Button
							onPress={this.signOut}
							round={true}
							size={1.1}
							style={styles.layout.signOut}
							icon="sign-out-alt"
							iconSize={settings.iconSize.largish}
							iconColor={settings.colors.bad}
						/>

					</View>

				</View>

			</Animated.View>

		</Screen>
		
	}


	pageWillUnmount() {
		clearTimeout(this.panTimer)
		clearTimeout(this.searchTimer)
	}

}

export default Core;