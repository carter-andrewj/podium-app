import React from 'react';
import Component from '../utils/component';
import { Animated, Easing } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import styles from '../styles/styles';
import settings from '../settings';




export default class Spinner extends Component {

	constructor() {

		super()

		this.active = false

		this.start = this.start.bind(this)
		this.stop = this.stop.bind(this)

		this.spinner = new Animated.Value(0.0)

	}


	componentWillMount() {
		this.start()
	}

	componentDidUpdate() {
		this.start()
	}


	start() {
		if (!this.active && !this.props.paused) {
			this.active = true
			this.spinner.setValue(0.0)
			Animated
				.timing(this.spinner, {
					toValue: 1.0,
					duration: this.props.time || settings.layout.spinTime,
					easing: Easing.linear,
				})
				.start(() => {
					if (this.props.paused || !this.active) {
						this.stop()
					} else {
						this.active = false
						this.start()
					}
				})
			
		}
	}


	stop() {
		if (this.active) {
			this.spinner.stopAnimation()
			this.active = false
		}
	}



	render() {

		const spin = this.spinner
			.interpolate({
				inputRange: [0.0, 1.0],
				outputRange: ["0deg", "360deg"]
			})

		return <Animated.View style={[
				this.props.containerStyle || styles.container,
				{ transform: [{ rotate: spin }]}
			]}>
			<FontAwesomeIcon
				icon="circle-notch"
				size={this.props.size || 20}
				color={this.props.color || settings.colors.white}
				style={this.props.style}
			/>
		</Animated.View>
	
	}

	componentWillUnmount() {
		this.stop()
	}

}