import { List } from 'immutable';
import { Animated, Easing } from 'react-native';

import settings from '../settings';




export default class Animator {

	constructor() {

		// State
		this.ingress = []
		this.transit = []
		this.egress = []

		// Defaults
		this.duration = {
			ingress: settings.layout.fadeTime,
			transit: settings.layout.moveTime,
			egress: settings.layout.fadeTime
		}
		this.delay = {
			ingress: 0,
			transit: 0,
			egress: 0
		}

		// Promise
		this.current = undefined

		// Methods
		this.schedule = this.schedule.bind(this)
		this.build = this.build.bind(this)
		this.play = this.play.bind(this)
		this.chain = this.chain.bind(this)

	}


	schedule(ingress, move, egress) {

		if (ingress) this.ingress.push(
			this.build(ingress, this.duration.ingress, this.delay.ingress)
		)

		if (move) this.transit.push(
			this.build(move, this.duration.transit, this.delay.transit)
		)

		if (egress) this.egress.push(
			this.build(egress, this.duration.egress, this.delay.egress)
		)

	}


	build(anim, duration, delay = 0) {
		
		// Unpack animation
		let [ subject, config, callback ] = anim

		// Handle orphan values
		if (!isNaN(config)) config = { toValue: config }

		// Set defaults
		if (!config.easing) config.easing = Easing.linear

		// Set delay
		if (!config.delay || config.delay > delay) config.delay = delay

		// Set duration
		if (!config.duration || config.duration > duration) config.duration = duration

		// Build animation
		return [ Animated.timing(subject, config), callback ]

	}


	get ready() {
		return this.ingress.length > 0 ||
			this.transit.length > 0 ||
			this.egress.length > 0
	}



	async play() {

		// Ignore if already in play cycle or no animations are scheduled
		if (this.current || !this.ready) return

		// Decant scheduled animations
		let ingress = this.ingress
		let transit = this.transit
		let egress = this.egress

		// Reset schedule
		this.ingress = []
		this.transit = []
		this.egress = []

		// Configure and playanimations
		this.current = this.chain(ingress, transit, egress)
			.then(async () => {
				this.current = undefined
				this.play()
			})
			.catch(console.error)

	}


	chain(anims, ...rest) {
		return new Promise(resolve => {

			// Create closing function
			let done = () => {
				if (!rest || rest.length === 0) {
					resolve()
				} else {
					this.chain(...rest).then(resolve)
				}
			}

			// Ignore empty animation stacks
			if (!anims || anims.length === 0) {
				done()
			} else {

				// Play animations
				Animated
					.parallel(anims.map(([a, _]) => a))
					.start(event => {
						if (event.finished) {

							// Trigger callbacks
							anims.map(async ([_, cb]) => cb ? cb(event) : null)

							// Next
							done()

						}
					})

			}

		})
	}


}