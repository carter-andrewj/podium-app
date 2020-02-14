import { List, Map } from 'immutable';
import { Animated, Easing } from 'react-native';

import settings from '../settings';




export default class Animator {

	constructor(options = {}) {

		// State
		this.queue = List()
		this.callbacks = List()
		this.config = {}

		// Options
		this.window = options.window

		// Utilities
		this.current = undefined
		this.timer = undefined

		// Methods
		this.schedule = this.schedule.bind(this)
		this.play = this.play.bind(this)
		this.chain = this.chain.bind(this)

		// Set default configuration
		this.configure()

	}


	configure(type, config) {

		// Set configuration
		switch (type) {

			// Configuration for a set of sliding components
			case "slide":
				this.config = {
					animator: [
						Animated.spring,
						Animated.timing,
						Animated.spring,
					],
					duration: [
						null,
						settings.layout.moveTime,
						null,
					],
					bounciness: [
						settings.layout.panBounce,
						null,
						settings.layout.panBounce,
					],
					speed: [
						8,
						null,
						8,
					],
					phaseTime: [
						settings.layout.panTime,
						null,
						settings.layout.panTime,
					],
					...config
				}
				break

			// General configuration for all animations
			// following spring physics
			case "spring":
				this.config = {
					animator: [ Animated.spring ],
					bounciness: [ settings.layout.panBounce ],
					phaseTime: [ settings.layout.panTime ],
					...config
				}
				break

			// General configuration for all animations
			// following spring physics in reverse
			case "spring-back":
				this.config = {
					animator: [ Animated.timing ],
					duration: [ settings.layout.panTime ],
					easing: [ Easing.back ],
					...config
				}
				break

			// Default configuation is a 3 stage process
			// in which components fade out, resize, and
			// fade in
			default:
				this.config = {
					animator: [ Animated.timing ],
					duration: [
						settings.layout.fadeTime,
						settings.layout.moveTime,
						settings.layout.fadeTime
					],
					easing: [ Easing.linear ],
					...config
				}
				break

		}

		// Return animator
		return this

	}


	getConfig(phase) {
		return Map(this.config)
			.map(v =>
				!Array.isArray(v) ? v
				:
				(v.length <= phase) ? v[v.length - 1]
				:
				v[phase]
			)
			.toJS()
	}


	schedule(...args) {
		args.map((anim, i) => {

			// Ignore if no animation is scheduled for this phase
			if (!anim) return

			// Unpack animation
			let [ subject, config, callback ] = anim

			// Handle orphan values
			if (!isNaN(config)) config = { toValue: config }

			// Get config for this phase
			let { animator, ...defaults } = this.getConfig(i)

			// Make animation object
			let animation = animator(subject, {
				...defaults,
				...config
			})

			// Set animation
			this.queue = this.queue.update(i,
				q => q ? q.push(animation) : List([ animation ])
			)

			// Set callback, if provided
			if (callback) {
				this.callbacks = this.callbacks.update(i,
					c => c ? c.push(callback) : List([ callback ])
				)
			}

		})
	}




	async play(direct = false) {

		// Ignore if already in play cycle or no animations are scheduled
		if (this.current || this.queue.size === 0) return

		// Cancel any previous timer
		clearTimeout(this.playTimer)

		// Delay play by specified window option to ensure animations
		// automatically group themselves and don't play too close together
		// in dynamic components.
		if (this.window && !direct) {

			// Reschedule play call
			this.playTimer = setTimeout(
				() => this.play(true),
				this.window
			)

			// Return
			return

		}

		// Decant scheduled animations
		let queue = this.queue.toJS()
		let callbacks = this.callbacks.toJS()

		// Reset schedule
		this.queue = List()
		this.callbacks = List()

		// Configure and play animations
		this.current = this.chain(queue, callbacks)
			.then(async () => {
				this.current = undefined
				this.play(true)
			})
			.catch(console.error)

	}


	chain(animations, callbacks, phase = 0) {
		return new Promise(resolve => {

			// Get current phase of animations
			let anims = animations[phase]

			// Create closing function
			let done = () => {

				// Clear timer
				clearTimeout(this.timer)

				// Trigger callbacks
				if (callbacks[phase]) {
					callbacks[phase].map(async callback => callback())
				}

				// Resolve at end of chain
				if (animations.length === phase - 1) {
					resolve()

				// Otherwise, move to next phase
				} else {
					this.chain(animations, callbacks, phase + 1)
						.then(resolve)
				}

			}

			// Ignore empty animation stacks
			if (!anims || anims.length === 0) {
				done()

			// Otherwise, play animations
			} else {

				// Schedule completion
				let phaseTime = this.getConfig(phase).phaseTime
				if (phaseTime) {
					this.timer = setTimeout(done, phaseTime)
				}

				// Play animations
				Animated
					.parallel(anims)
					.start(({ finished }) => (!phaseTime && finished) ? done() : null)

			}

		})
	}


}