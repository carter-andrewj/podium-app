import React from 'react';
import Component from './component';
import { Animated, Easing, View } from 'react-native';
import { inject, observer } from 'mobx-react';

import TouchableWithoutFeedback from './inputs/touchableWithoutFeedback';
import SquareButton from './buttons/squareButton';



@inject("store")
@observer
class Mask extends Component {

	constructor() {

		// State
		super({})
		this.observer = undefined

		// Animations
		this.show = this.show.bind(this)
		this.hide = this.hide.bind(this)
		this.fade = this.fade.bind(this)
		this.opacity = new Animated.Value(0.0)
		this.current = 0.0

	}




// LIFECYCLE

	componentDidMount() {

		// Listen for content changes
		this.observer = this.store.mask.observe(({ name, newValue, oldValue }) => {
			if (name === "content" &&
					newValue &&
					newValue !== oldValue) {
				this.show()
			}
		})

	}

	componentWillUnmount() {

		// Dispose of observer
		this.observer()
		this.observer = undefined

	}




// SHOW/HIDE

	show() {
		let callback = this.store.mask.get("onOpen")
		this.fade(1.0)
			.then(() => new Promise(resolve => callback ?
				callback(resolve)
				: resolve()
			))
			.catch(console.error)
	}


	hide() {
		let callback = this.store.mask.get("onClose")
		new Promise(resolve => callback ?
				callback(resolve) :
				resolve()
			)
			.then(() => this.fade(0.0))
			.then(this.store.clearMask)
			.catch(console.error)
	}


	fade(to) {
		return new Promise((resolve, reject) => {

			// Resolve immediately, if already at required value
			if (!to || this.current === to) resolve()

			// Store new state
			this.current = to

			// Animate
			Animated
				.timing(this.opacity, {
					toValue: to,
					duration: this.timing.fadeTime,
					easing: Easing.linear
				})
				.start(({ finished }) => finished ? resolve() : null)

		})
	}





// RENDER

	render() {
		let content = this.store.mask.get("content")
		return <Animated.View
			pointerEvents={content ? "all" : "none"}
			style={{
				...this.style.mask.container,
				opacity: this.opacity
			}}>

			<View style={this.style.mask.backdrop} />

			<TouchableWithoutFeedback
				onPress={this.hide}
				style={this.style.mask.inner}>

				{content}

				<View style={this.style.mask.closeButton}>
					<SquareButton
						icon="times"
						onPress={this.hide}
					/>
				</View>

			</TouchableWithoutFeedback>

		</Animated.View>
	}


}

export default Mask;