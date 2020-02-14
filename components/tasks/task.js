import React from 'react';
import Component from '../component';
import { Text, View, TextInput, Animated } from 'react-native';
import { action } from 'mobx';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import { fromJS } from 'immutable';

import FadingView from '../animated/fadingView';
import FadingIcon from '../animated/fadingIcon';
import Spinner from '../animated/spinner';




@inject("store")
@observer
class Task extends Component {

	constructor() {

		// Initialize
		super({
			success: false,
			fail: false,
			show: true
		})

		// Flags
		this.reserved = false
		this.since = undefined

		// Utilities
		this.animator = undefined
		this.observer = undefined
		this.disposer = undefined

		// Methods
		this.observe = this.observe.bind(this)

		this.colorize = this.colorize.bind(this)

		this.reserve = this.reserve.bind(this)
		this.release = this.release.bind(this)

		// Animation
		this.color = new Animated.Value(0.5)

	}



// GETTERS

	get task() {
		if (this.props.static) {
			return fromJS(this.props.task)
		} else {
			return this.nation.tasks.get(this.props.task)
		}
	}



// LIFECYCLE

	componentDidUpdate(lastProps) {

		// Check if task has changed
		if (this.props.task !== lastProps.task) {

			// Ignore for static tasks
			if (!this.props.static) {

				// Remove old animator
				if (this.animator) this.animator()

				// Trigger animations on changes
				this.animator = this.task.observe(change => {
					setTimeout(this.props.animator.play, 10)
				})

			}

			// Show task
			this.updateState(state => state.set("show", true))

		}

	}


	componentWillUnmount() {

		// Clear listeners
		if (this.animator) this.animator()

		// Release task, if required
		this.release()

		// Clear timers
		clearTimeout(this.disposer)

	}




// HANDLE CHANGES

	observe(change) {

		// Handle errors
		if (change.name === "error") {

			// Turn on the error flag
			this.updateState(state => state.set("fail", true))

			// Animate to bad
			this.colorize(0.0)

			//TODO - More functionality (retry, etc...)

		}


		// Handle completion
		if (change.name === "result") {

			// Animate color
			this.colorize(1.0)

			// Exit the element
			this.updateState(

				// Turn on success flag
				state => state.set("success", true),

				// And then
				() => {

					//Trigger animations
					this.props.animator.play()

					// Calculate task lifetime
					let lifetime = new Date().getTime() - this.since

					// Hide the task and make it disposable
					// (The removal of the task object itself is tied
					// to the onHide callback below)
					this.disposer = setTimeout(
						() => this.updateState(
							state => state.set("show", false),
							this.props.animator.play
						),
						Math.max(
							this.settings.tasks.exitTime,
							this.settings.tasks.lifetime - lifetime
						)
					)

				}

			)

		}

	}


	colorize(value) {
		Animated
			.timing(this.color, {
				toValue: value,
				duration: this.settings.timing.fade
			})
			.start()
	}



// TASK CONTROL

	reserve() {

		// Ignore if already reserved
		if (this.reserved) return

		// Reset colour
		this.color.setValue(0.5)

		// Ignore for static tasks
		if (!this.props.static) {

			// Set reserved flag
			this.reserved = true

			// Save reservation timestamp
			this.since = new Date().getTime()

			// Reserve task
			this.nation.reserveTask(this.props.task)

			// Dispose old observer, if required
			if (this.observer) this.observer()

			// Observe changes to the task
			this.observer = this.task.observe(this.observe)
			
		}

	}

	release() {

		// Ignore if not reserved
		if (!this.reserved) return

		// Ignore for static tasks
		if (!this.props.static) {

			// Clear reserved flag
			this.reserved = false

			// Clear the timestamp
			this.since = undefined

			// Dispose of observer
			this.observer()

			// Release task
			this.nation.releaseTask(this.props.task)

		}

	}



	render() {

		let color = this.color.interpolate({
			inputRange: [0.0, 0.5, 1.0],
			outputRange: [
				this.colors.bad,
				this.colors.neutralDark,
				this.colors.major
			],
		})

		return <FadingView
			animator={this.props.animator}
			show={this.props.show && this.getState("show")}
			beforeShow={this.reserve}
			onHide={this.release}
			style={{
				...this.style.task.container,
				backgroundColor: color
			}}>

			<View style={this.style.task.message}>
				<Text style={this.style.task.text}>
					{this.task.get("status") ?
						`${this.task.get("label")}: ${this.task.get("status")}`
						:
						this.task.get("label")
					}
				</Text>
			</View>

			<View style={this.style.task.iconHolder}>

				<FadingIcon
					animator={this.props.animator}
					show={this.getState("success")}
					icon="check"
					size={this.style.font.size.small}
					color={this.colors.white}
					containerStyle={this.style.task.icon}
				/>

				<FadingIcon
					animator={this.props.animator}
					show={this.getState("fail")}
					icon="ban"
					size={this.style.font.size.small}
					color={this.colors.white}
					containerStyle={this.style.task.icon}
				/>

				<FadingView
					animator={this.props.animator}
					style={this.style.task.icon}
					show={!this.getState("success") && !this.getState("fail")}>
					<Spinner
						size={this.style.font.size.small}
						color={this.colors.white}
					/>
				</FadingView>

			</View>

		</FadingView>
	}

}


export default Task;