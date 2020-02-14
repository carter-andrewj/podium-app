import React from 'react';
import Component from '../../components/component';
import { View, Text, TouchableOpacity, Animated,
		 Dimensions, PanResponder } from 'react-native';
import { inject, observer } from 'mobx-react';




@inject("store")
@observer
class Drawer extends Component {

	static defaultProps = {
		position: "left"
	}

	constructor() {

		super()

		// State
		this.isOpen = false

		// Methods
		this.open = this.open.bind(this)
		this.close = this.close.bind(this)

		this.beforeOpen = this.beforeOpen.bind(this)
		this.onOpen = this.onOpen.bind(this)
		this.beforeClose = this.beforeClose.bind(this)
		this.onClose = this.onClose.bind(this)

		this.drawerWillOpen = this.drawerWillOpen.bind(this)
		this.drawerDidOpen = this.drawerDidOpen.bind(this)
		this.drawerWillClose = this.drawerWillClose.bind(this)
		this.drawerDidClose = this.drawerDidClose.bind(this)

		this.beginSwipe = this.beginSwipe.bind(this)
		this.overSwipe = this.overSwipe.bind(this)
		this.swipe = this.swipe.bind(this)
		this.endSwipe = this.endSwipe.bind(this)

		// Animation
		this.offset = new Animated.Value(0.0)

		// Swipe
		this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: this.beginSwipe,
			onPanResponderMove: this.swipe,
			onPanResponderRelease: this.endSwipe,
		})

	}


	get limit() {
		return this.layout.screen.width * this.settings.swipe.xLimit
	}



// LIFECYCLE

	componentDidMount() {

		// Provide controller to parent
		if (this.props.controller) {
			this.props.controller(this.controls)
		}

		// Set initial position
		if (this.props.position === "right") {
			this.offset.setValue(this.layout.screen.width)
		} else {
			this.offset.setValue(-1 * this.layout.screen.width)
		}

	}


	componentWillUpdate(nextProps) {

		// Check if draw is opening or closing
		if (nextProps.open !== this.props.open) {
			if (nextProps.open) {
				this.drawerWillOpen(nextProps)
				this.open()
			} else {
				this.drawerWillClose(nextProps)
				this.close()
			}
		}

	}


	componentDidUpdate(lastProps) {

		// Check if draw is opening or closing
		if (lastProps.open !== this.props.open) {
			if (this.props.open) {
				this.drawerDidOpen(lastProps)
			} else {
				this.drawerDidClose(lastProps)
			}
		}

	}


	drawerWillOpen(nextProps) {}

	drawerWillClose(nextProps) {}

	drawerDidOpen(lastProps) {}

	drawerDidClose(lastProps) {}




// ANIMATION

	get hidePosition() {
		switch (this.props.position) {
			case "right": return this.layout.screen.width
			default: return -1 * this.layout.screen.width
		}
	}


	open(force = false) {

		// Ignore if already open
		if (this.isOpen && !force) return

		// Set open flag
		this.isOpen = true

		// Run Callback
		this.beforeOpen()

		// Schedule open with animator, if provided
		if (this.props.animator && !force) {

			this.props.animator.schedule(null, [this.offset, 0.0, this.props.onOpen])
		
		// Otherwise, animate directly
		} else {

			// Animate
			Animated
				.spring(this.offset, {
					toValue: 0.0,
					bounciness: this.settings.swipe.bounce,
				})
				.start(this.onOpen)

		}

	}


	close(force = false) {

		// Ignore if already closed
		if (!this.isOpen && !force) return

		// Clear open flag
		this.isOpen = false

		// Run callback
		this.beforeClose()

		// Schedule open with animator, if provided
		if (this.props.animator && !force) {
			
			this.props.animator.schedule([this.offset, this.hidePosition, this.props.onClose])
		
		// Otherwise, animate directly
		} else {

			// Animate
			Animated
				.spring(this.offset, {
					toValue: this.hidePosition,
					bounciness: this.settings.swipe.bounce,
				})
				.start(this.onClose)

		}

	}


	get controls() {
		return {
			isOpen: () => this.isOpen,
			open: this.open,
			close: this.close
		}
	}




// SWIPE

	beginSwipe(_, { dx, dy }) {

		// Start swipe when x-movement is greater than both 
		// y-movement and the pan threshold
		return this.isOpen &&
			Math.abs(dx) > Math.abs(dy) &&
			Math.abs(dx) > this.settings.swipe.threshold

	}


	overSwipe(x) {
		return Math.pow(Math.abs(x), this.settings.swipe.overScroll)
	}


	swipe(event, gesture) {

		// Unpack gesture
		const { dx } = gesture

		// Decay movement beyond left border
		if (this.props.position === "right" && dx < 0) {
			this.offset.setValue(-1 * this.overSwipe(dx))

		// Decay movement beyond right border
		} else if (this.props.position === "left" && dx > 0) {
			this.offset.setValue(this.overSwipe(dx))

		// Otherwise, move with gesture
		} else {
			let anim = Animated.event([ null, { dx: this.offset } ])
			return anim(event, gesture)
		}

	}


	endSwipe(_, { dx }) {

		// Close if swiped beyond limit,
		// otherwise, reopen to full
		if ((this.props.position === "right" && dx > this.limit) ||
				(this.props.position === "left" && (-1 * dx) > this.limit)) {
			this.close(true)
		} else {
			this.open(true)
		}

	}



// CALLBACKS

	beforeOpen() {
		if (this.props.beforeOpen) this.props.beforeOpen()
	}

	onOpen(event) {
		if (event.finished && this.props.onOpen) this.props.onOpen(event)
	}

	beforeClose() {
		if (this.props.beforeClose) this.props.beforeClose()
	}

	onClose(event) {
		if (event.finished && this.props.onClose) this.props.onClose(event)
	}




// RENDER

	get style() {
		return super.style.drawer
	}

	get padding() {
		switch (this.props.position) {
			case "right": return { paddingRight: this.layout.core.drawer.buffer }
			default: return { paddingLeft: this.layout.core.drawer.buffer }
		}
	}


	get buffer() {
		return <TouchableOpacity
			onPress={this.close}
			style={this.style.buffer}>
			<View style={super.style.container} />
		</TouchableOpacity>
	}


	get transform() {
		switch (this.props.position) {
			case "right": return this.offset
			default: return Animated.subtract(this.offset, this.layout.core.drawer.buffer)
		}
	}


	render() {
		return <Animated.View
			{ ...this.panResponder.panHandlers }
			style={{
				...this.style.body,
				transform: [{ translateX: this.transform }]
			}}>

			{this.props.position === "right" ? this.buffer : null}

			<View style={{
					...this.style.inner,
					...this.padding,
				}}>
				<View style={{
						...this.style.content,
						...this.props.style,
					}}>
					{this.props.children}
				</View>
			</View>

			{this.props.position === "left" ? this.buffer : null}

		</Animated.View>
	}

}

export default Drawer;