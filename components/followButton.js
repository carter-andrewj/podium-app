import React from 'react';
import Component from '../utils/component';
import { inject, observer } from 'mobx-react';
import { StyleSheet, Dimensions, Text, View, Animated,
		 Easing, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import styles from '../styles/styles';
import settings from '../settings';



@inject("store")
@observer
export default class FollowButton extends Component {

	constructor() {

		super()

		this.state = {
			loading: true,
			following: null
		}

		this.checkFollow = this.checkFollow.bind(this)
		this.follow = this.follow.bind(this)
		this.unfollow = this.unfollow.bind(this)

		this.startSpin = this.startSpin.bind(this)
		this.stopSpin = this.stopSpin.bind(this)
		this.spinner = new Animated.Value(0.0)

	}


	componentWillMount() {
		this.checkFollow()
	}


	checkFollow() {
		this.startSpin()
		this.props.store.session.user
			.isFollowing(this.props.address)
			.then(result => {
				this.stopSpin()
				this.updateState(state => state
					.set("loading", false)
					.set("following", result)
				)
			})
			.catch(console.error)
	}


	follow() {
		this.updateState(
			state => state.set("loading", true),
			() => {
				this.startSpin()
				this.props.store.session
					.follow(this.props.address)
					.then(() => {
						this.stopSpin()
						this.updateState(state => state
							.set("loading", false)
							.set("following", true)
						)
					})
					.catch(console.error)
			}
		)
	}


	unfollow() {
		this.updateState(
			state => state.set("loading", true),
			() => {
				this.startSpin()
				this.props.store.session
					.unfollow(this.props.address)
					.then(() => {
						this.stopSpin()
						this.updateState(state => state
							.set("loading", false)
							.set("following", true)
						)
					})
					.catch(console.error)
			}
		)
	}



	startSpin() {
		this.spinner.setValue(0.0)
		if (this.state.loading) {
			Animated
				.timing(this.spinner, {
					toValue: 1.0,
					duration: settings.layout.spinTime,
					easing: Easing.linear,
					useNativeDriver: true
				})
				.start(this.startSpin)
		} else {
			this.stopSpin()
		}
	}

	stopSpin() {
		this.spinner.stopAnimation()
		this.spinner.setValue(0.0)
	}



	render() {

		const spin = this.spinner.interpolate({
			inputRange: [0.0, 1.0],
			outputRange: ["0deg", "360deg"]
		})

		const size = this.props.size || 1.0

		return <View style={[
				styles.button.followButton,
				this.state.loading ?
					styles.button.followLoading :
					this.state.following ?
						styles.button.followOn :
						styles.button.followOff,
				{ transform: [{ scale: size }]},
				this.props.style
			]}>
			<TouchableOpacity
				style={styles.container}
				onPress={this.state.loading ?
					null :
					this.state.following ?
						this.unfollow :
						this.follow
				}>
				<Animated.View
					style={[
						styles.container,
						{ transform: [{ rotate: spin }]}
					]}>
					<FontAwesomeIcon
						icon={this.state.loading ?
							"circle-notch" :
							"eye"
						}
						size={size * 18.0}
						color={this.state.loading ?
							settings.colors.white :
							this.state.following ?
								settings.colors.white :
								settings.colors.major
						}
						style={styles.button.followIcon}
					/>
				</Animated.View>
			</TouchableOpacity>
		</View>
	
	}

}