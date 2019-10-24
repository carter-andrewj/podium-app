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

import QuickSearch from './search/quickSearch';
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
		defaultNavigationOptions: {
			gesturesEnabled: false
		}
	}

)





@inject("store")
@observer
class Core extends Page {


	static router = Pages.router;


	constructor() {

		super()

		this.span = Math.round(Dimensions.get("window").width *
			settings.layout.drawerSize),
		this.location = 0
		this.pan = new Animated.ValueXY()
		this.animUpdate = false

		this.state = {
			location: 0,
			banner: [],
		}

		this.nav = null;

		this.searchControls = {}
		this.alertControls = {}

		this.beginPan = this.beginPan.bind(this)
		this.resetPan = this.resetPan.bind(this)
		this.movePan = this.movePan.bind(this)
		this.endPan = this.endPan.bind(this)

		this.setLocation = this.setLocation.bind(this)
		this.panTo = this.panTo.bind(this)
		this.openLeft = this.openLeft.bind(this)
		this.openRight = this.openRight.bind(this)
		this.closeDrawer = this.closeDrawer.bind(this)

		this.navigate = this.navigate.bind(this)
		this.signOut = this.signOut.bind(this)
		this.quickSearch = this.quickSearch.bind(this)
		this.quickAlerts = this.quickAlerts.bind(this)

		this.setBanner = this.setBanner.bind(this)

		// Set up screen pan
		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: this.beginPan,
			onPanResponderGrant: this.resetPan,
			onPanResponderMove: this.movePan,
			onPanResponderRelease: this.endPan,
			onResponderTerminate: () => { globals.screenLock = false }
		})

	}



// PAN RESPONSES

	beginPan(_, { dx, dy }) {

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
			this.searchControls.blur()
			globals.screenLock = "core"
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


	movePan(event, gesture) {

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




// PAN HELPERS

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
		this.searchControls.blur()
		return this.panTo(-1 * this.location)
	}




// NAVIGATION

	navigate(to, params={}) {
		this.closeDrawer()
		this.nav.props.navigation.navigate(to, params)
	}

	signOut() {
		this.session
			.signOut()
			.then(() => this.props.navigation.navigate("SignIn"))
			.catch(console.error)
	}

	quickSearch() {
		this.openRight()
		this.searchControls.focus()
	}

	quickAlerts() {
		this.alertControls.filter("all")
		this.alertControls.resetScroll()
		this.openLeft()
	}





// ELEMENTS

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
						onPress={this.quickAlerts}
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

					<QuickAlerts
						navigate={this.navigate}
						controller={control => this.alertControls = control}
					/>

					<QuickProfile
						navigate={this.navigate}
					/>

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

					<QuickSearch
						navigate={this.navigate}
						controller={controls => this.searchControls = controls}
					/>

					<View style={styles.layout.rightFooter}>

						<View style={styles.container} />

						<View style={styles.layout.links}>

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

				</View>




			</Animated.View>

		</Screen>
		
	}


}

export default Core;