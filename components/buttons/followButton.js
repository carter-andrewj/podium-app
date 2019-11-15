import React from 'react';
import Component from '../component';
import { inject, observer } from 'mobx-react';
import { StyleSheet, Dimensions, Text, View, Animated,
		 Easing, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import styles from '../../styles/styles';
import settings from '../../settings';

import SquareButton from './squareButton';



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

	}


	componentWillMount() {
		this.checkFollow()
	}


	checkFollow() {
		this.props.store.session.user
			.isFollowing(this.props.address)
			.then(result => this.updateState(state => state
				.set("loading", false)
				.set("following", result)
			))
			.catch(console.error)
	}


	follow() {
		this.updateState(
			state => state.set("loading", true),
			() => this.props.store.session
				.follow(this.props.address)
				.then(() => this.updateState(state => state
					.set("loading", false)
					.set("following", true)
				))
				.catch(console.error)
		)
	}


	unfollow() {
		this.updateState(
			state => state.set("loading", true),
			() => this.props.store.session
				.unfollow(this.props.address)
				.then(() => this.updateState(state => state
					.set("loading", false)
					.set("following", true)
				))
				.catch(console.error)
		)
	}





	render() {
		return <SquareButton
			
			loading={this.state.loading}
			onPress={this.state.following ?
				this.unfollow :
				this.follow
			}

			icon="eye"
			color={this.state.following ?
				settings.colors.white :
				settings.colors.major
			}
			background={this.state.following ?
				settings.colors.major :
				settings.colors.white
			}
			border={settings.colors.major}

		/>
	}
	

}