import React from 'react';
import Component from '../component';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { StyleSheet, Dimensions, Text, View, Animated,
		 Easing, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import SquareButton from './squareButton';



@inject("store")
@observer
export default class FollowButton extends Component {

	constructor() {

		super({ loading: false })

		// Methods
		this.load = this.load.bind(this)
		this.follow = this.follow.bind(this)
		this.unfollow = this.unfollow.bind(this)

	}




// GETTERS

	@computed
	get isLoading() {
		return this.isFollowing === undefined || this.getState("loading")
	}

	@computed
	get isFollowing() {
		return this.activeUser.isFollowing(this.props.user)
	}




// ACTIONS

	load(callback) {
		this.updateState(

			// Set loading flag
			state => state.set("loading", true),

			// Run callback
			() => callback()
				.then(() => this.updateState(
					state => state.set("loading", false)
				))
				.catch(console.error)
		)
	}

	follow() {
		this.load(() => this.activeUser.follow(this.props.user))
	}


	unfollow() {
		this.load(() => this.activeUser.unfollow(this.props.user))
	}




// RENDER

	render() {
		return this.props.user.address === this.activeUser.address ?
			<SquareButton label="YOU" />
			:
			<SquareButton
				loading={this.isLoading}
				onPress={this.isFollowing ? this.unfollow : this.follow}
				icon="eye"
				color={(this.isFollowing && this.isLoading) ? this.colors.major
					: this.isFollowing ? this.colors.white
					: undefined
				}
				background={this.isFollowing ? this.colors.major : undefined}
			/>
	}
	

}