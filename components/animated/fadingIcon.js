import React from 'react';
import Component from '../component';
import { Animated, Easing } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import styles from '../../styles/styles';
import settings from '../../settings';




export default class FadingIcon extends Component {

	constructor() {

		super()

		this.isVisible = false

		this.refresh = this.refresh.bind(this)
		this.show = this.show.bind(this)
		this.hide = this.hide.bind(this)

		this.fader = new Animated.Value(0.0)

	}


	componentDidMount() {
		this.refresh()
	}

	componentDidUpdate() {
		this.refresh()
	}


	refresh() {
		if (this.props.show !== this.isVisible) {
			if (this.props.show) {
				this.show()
			} else {
				this.hide()
			}
		}
	}

	show() {
		
		// Ignore if already showing
		if (this.isVisible) return

		// Callback
		if (this.props.beforeShow) this.props.beforeShow()

		// Set flag
		this.isVisible = true

		// Schedule with animation manager, if provided
		if (this.props.animator) {

			this.props.animator
				.schedule([this.fader, 1.0, this.props.onShow])

		} else {

			// Calculate timings
			let delay = this.props.delayIn || this.props.delay || 0
			let duration = this.props.timeIn || this.props.time || settings.layout.fadeTime

			// Fade in
			Animated
				.timing(this.fader, {
					toValue: 1.0,
					delay: delay,
					duration: duration,
					easing: Easing.linear,
				})
				.start(({ finished }) => (finished && this.props.onShow) ?
					this.props.onShow()
					: null
				)

		}
		
	}

	hide() {

		// Ignore if already hidden
		if (!this.isVisible) return

		// Callback
		if (this.props.beforeHide) this.props.beforeHide()

		// Set flag
		this.isVisible = false

		// Schedule with animation manager, if provided
		if (this.props.animator) {

			this.props.animator
				.schedule(null, null, [this.fader, 0.0, this.props.onHide])

		} else {

			// Calculate timings
			let delay = this.props.delayOut || this.props.delay || 0
			let duration = this.props.timeOut || this.props.time || settings.layout.fadeTime

			// Fade in
			Animated
				.timing(this.fader, {
					toValue: 0.0,
					delay: delay,
					duration: duration,
					easing: Easing.linear,
				})
				.start(({ finished }) => (finished && this.props.onHide) ?
					this.props.onHide()
					: null
				)

		}

	}




	render() {

		return <Animated.View style={[
				this.props.containerStyle || styles.container,
				{ opacity: this.fader }
			]}>
			<FontAwesomeIcon
				icon={this.props.icon}
				size={this.props.size || 20}
				color={this.props.color || settings.colors.white}
				style={this.props.style}
			/>
		</Animated.View>
	
	}


}