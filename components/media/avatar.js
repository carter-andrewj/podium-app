import React from 'react';
import Component from '../component';
import { View, Image, Animated } from 'react-native';
import { inject, observer } from 'mobx-react';

import Spinner from '../animated/spinner';




@inject("store")
@observer
export default class Avatar extends Component {

	constructor() {
		super({
			size: 0,
			radius: 0
		})
		this.resize = this.resize.bind(this)
	}

	get placeholder() {
		return require( "../../assets/avatar-placeholder.jpg")
	}

	get corner() {
		switch (this.props.corner) {
			case "right": return { borderBottomRightRadius: this.getState("radius") }
			case "left": return { borderBottomLeftRadius: this.getState("radius") }
			default: return this.props.corner
		}
	}

	resize(event) {

		// Calculate size
		const { height, width } = event.nativeEvent.layout
		let size = Math.round(Math.min(width, height))

		this.updateState(state => state
			.set("size", size)
			.set("radius", Math.round(size * this.settings.media.avatar.corner))
		)
	}


	render() {

		// Get picture source, if...
		// ...directly specified
		let source = this.props.source ||

			// ...specified as a uri
			this.props.uri ?
				{ uri: this.props.uri } :

			// ...provided with an user
			this.props.user ?
				
				// ...that has...
				this.props.user.ready ?

					// ...finished loading
					{ uri: this.props.user.profile.avatar } || this.placeholder

					:

					// ...yet to load
					null					

			// ...or otherwise, display placeholder
			: this.placeholder


		// Set container style
		let style = {
			...this.style.avatar.image,
			minHeight: this.getState("size"),
			maxHeight: this.getState("size"),
			minWidth: this.getState("size"),
			maxWidth: this.getState("size"),
		}

		// Render
		return <Animated.View
			onLayout={this.resize}
			style={{
				...this.style.avatar.container,
				...this.corner,
				...this.props.style,
			}}>
			{source ?
				<Image
					style={style}
					source={source}
				/>
				:
				<View style={style}>
					<Spinner size={Math.round(0.3 * this.getState("size"))} />
				</View>
			}
			{!this.props.hideBorder ?
				<Animated.View style={{
					...this.style.avatar.border,
					...this.corner,
				}}/>
				: null
			}
		</Animated.View>
	}

}



