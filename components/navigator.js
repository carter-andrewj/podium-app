import React from 'react';
import Component from './component';
import { View } from 'react-native';
import { action, computed, when } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Map } from 'immutable';
import { v4 as uuid } from 'uuid';

import Animator from '../utils/animator';


@inject("store")
@observer
export default class Navigator extends Component {

	constructor() {

		super()

		// State
		this.id = undefined
		this.listeners = Map()

		// Animations
		this.animator = new Animator().configure("transition")
		
		// Methods
		this.willExit = this.willExit.bind(this)
		this.didExit = this.didExit.bind(this)
		this.willEnter = this.willEnter.bind(this)
		this.didEnter = this.didEnter.bind(this)

		this.routeKey = this.routeKey.bind(this)
		this.navigate = this.navigate.bind(this)
		this.back = this.back.bind(this)
		this.reset = this.reset.bind(this)

	}




// LIFECYCLE

	componentWillMount() {

		// Set or generate id
		this.id = this.props.name || uuid()

		// Register with master navigation
		this.store.navigation.register(this.id)

		// Watch for changes in the route
		this.transitioner = this.route.observe(async ({ name, newValue, object }) => {

			// When the page begins exiting...
			if (name === "exiting" && newValue) {

				// Wait for exit handlers
				await Promise.all(
					this.listeners.get("willExit", Map())
						.valueSeq()
						.map(callback => callback(object))
						.toList()
						.toJS()
				)

				// Play animations
				await this.animator.play()

				// Wait for post-exit handlers
				await Promise.all(
					this.listeners.get("didExit", Map())
						.valueSeq()
						.map(callback => callback(object))
						.toList()
						.toJS()
				)

				// Play animations
				await this.animator.play()

				// Trigger new page entry
				this.transitionOutEnd()

			}

			// When page begins entering...
			if (name === "entering" && newValue) {

				// Wait for entrance handlers
				await Promise.all(
					this.listeners.get("willEnter", Map())
						.valueSeq()
						.map(callback => callback(object))
						.toList()
						.toJS()
				)

				// Play animations
				await this.animator.play()

				// Wait for exit handlers
				await Promise.all(
					this.listeners.get("didEnter", Map())
						.valueSeq()
						.map(callback => callback(object))
						.toList()
						.toJS()
				)

				// Play animations
				await this.animator.play()

				// End transition
				this.transitionInEnd()

			}

		})

		// Provide controller
		if (this.props.controller) this.props.controller(this.controls)

	}


	componentDidMount() {
		this.navigate(this.props.startingPage, this.props.startingProps)
	}


	componentWillUnmount() {

		// Remove from master navigation
		this.store.navigation.deregister(this.id)

		// Dispose transitioner
		if (this.transitioner) this.transitioner()

	}




// TRANSITION

	@computed
	get route() {
		return this.store.navigation.routes.get(this.id)
	}

	@action.bound
	transitionOut(route, distance) {

		this.route.set("transitioning", true)

		this.route.set("next", route)
		this.route.set("distance", distance)

		this.route.set("exiting", true)

	}

	@action.bound
	transitionOutEnd() {
		this.route.set("entered", false)
		this.route.set("exiting", false)
		this.route.set("exited", true)
	}

	@action.bound
	transition() {

		// Unpack current route
		let current = this.route.get("current")
		let distance = this.route.get("distance")
		let next = this.route.get("next")
		let stack = this.route.get("stack")

		// Manage stack
		if (current) {
			this.route.set("last", current)
			if (distance > 0) {
				stack.push(current)
				this.route.set("stack", stack)
			} else {
				this.route.set("stack", stack.slice(0, stack.length + distance))
			}
		}

		// Set next route
		this.route.set("current", next)
		this.route.set("next", undefined)

	}

	@action.bound
	transitionIn() {
		this.route.set("entering", true)
	}

	@action.bound
	transitionInEnd() {
		this.route.set("exited", false)
		this.route.set("entering", false)
		this.route.set("entered", true)
		this.route.set("transitioning", false)
	}





// CALLBACKS

	willExit(callback, id = uuid()) {
		this.addListener("willExit", id, callback)
	}

	didExit(callback, id = uuid()) {
		this.addListener("didExit", id, callback)
	}

	willEnter(callback, id = uuid()) {
		this.addListener("willEnter", id, callback)
	}

	didEnter(callback, id = uuid()) {
		this.addListener("didEnter", id, callback)
	}

	addListener(type, id, callback) {
		this.listeners = this.listeners.setIn([type, id], callback)
	}



// CONTROLS
	
	@computed
	get controls() {
		return {

			navigate: this.navigate,
			back: this.back,
			reset: this.reset,

			route: this.route,

			animator: this.animator,

			willExit: this.willExit,
			didExit: this.didExit,
			willEnter: this.willEnter,
			didEnter: this.didEnter,

		}
	}


	routeKey(pageName) {
		return `${pageName}-${uuid()}`
	}


	async navigate(pageName, props = {}) {

		// Throw error
		if (!this.props.pages[pageName])
			throw `NAVIGATION ERROR: Unknown Page '${pageName}'`

		// Wait for any existing transition to complete
		await when(() => !this.route.get("transitioning"))

		// Start transition
		this.transitionOut([ this.routeKey(pageName), pageName, props ], 1)

		// Wait for exit transition to complete
		await when(() => this.route.get("exited"))

		// Transition
		// NOTE: Despite occurring back-to-back, transition and transitionIn
		// are separate actions to allow a render to take place in between.
		// This allows the entering components to register their transition
		// callbacks prior to those callbacks being triggered by the transition
		// state machine.
		this.transition()

		// Enter
		this.transitionIn()

		// Wait for entrance transition to complete
		await when(() => this.route.get("entered"))

		// Return
		return true

	}


	async back(depth = 1) {

		// Get current stack
		let stack = this.route.get("stack")

		// Ignore if stack is empty
		if (stack.length === 0) return false

		// Get depth of transition, if not specified
		let distance = -1 * Math.min(depth, stack.length)

		// Get destination
		let route = stack[stack.length + distance]

		// Start transition
		this.transitionOut(route, distance)

		// Wait for exit transition
		await when(() => this.route.get("exited"))

		// Change screen
		this.transition()

		// Enter screen
		this.transitionIn()

		// Wait for entrance transition
		await when(() => this.route.get("entered"))

		// Return
		return true

	}


	reset() {
		return this.back(this.route.get("stack").length)
	}





// RENDER

	render() {

		// Get page component
		let stack = [ ...this.route.get("stack") ]
		let current = this.route.get("current")
		if (current) stack.push(current)

		// Render page
		return <View style={this.style.general.container}>

			{stack.map(([ key, pageName, routeProps ], i) => {

				let { Page, props } = this.props.pages[pageName]

				return <Page
					key={key}
					{ ...this.props.pageProps }
					{ ...props }
					{ ...routeProps }
					navigator={{
						...this.controls,
						pageName: pageName,
						depth: stack.length - i,
					}}
				/>

			})}

		</View>

	}

}