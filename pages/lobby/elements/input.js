import React from 'react';
import Component from '../../../components/component';
import { observable, action, computed } from 'mobx';
import { Text, View, TextInput, TouchableWithoutFeedback } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import Button from '../../../components/buttons/button';
import Spinner from '../../../components/animated/spinner';
import FadingView from '../../../components/animated/fadingView';
import FadingIcon from '../../../components/animated/fadingIcon';




class LobbyInput extends Component {

	constructor() {

		super({
			maskText: false,
			locked: false
		})

		// Settings (default values)
		this.ready = false				// Component is ready to accept input
		this.name = undefined			// Key for register data value
		this.defaultValue = undefined	// Default data value
		this.title = "input"			// Title above input
		this.placeholder = ""			// Placeholder text for input box
		this.secure = false				// Hidden text in input box (passwords)
		this.autoCorrect = false		// Turn on autocorrect for input box?
		this.capitalize = "none"		// Handle input box capitalization
		this.multiline = false			// Use a multiline input box
		this.skipable = false			// Can be skipped

		// Utilities
		this.validationTimer = null
		this.focusTimer = null
		this.input = null
		this.validator = undefined

		// Methods
		this.showText = this.showText.bind(this)
		this.maskText = this.maskText.bind(this)

		this.lock = this.lock.bind(this)
		this.unlock = this.unlock.bind(this)

		this.sanitize = this.sanitize.bind(this)
		this.validate = this.validate.bind(this)

		this.intercept = this.intercept.bind(this)
		this.onChange = this.onChange.bind(this)
		this.submit = this.submit.bind(this)

	}


// GETTERS

	@computed
	get data() {
		return this.props.data.get(this.name)
	}

	@computed
	get value() {
		return this.data.get("value")
	}

	@computed
	get error() {
		return this.data.get("error")
	}

	@computed
	get validating() {
		return this.data.get("validating") > 0
	}

	@computed
	get valid() {
		return this.data.get("valid")
	}

	@computed
	get filled() {
		return this.data &&
			this.value &&
			this.value.length > 0
	}

	get validation() {
		return this.config.validation[this.name]
	}

	get isVisible() {
		return this.props.current >= this.props.index && !this.props.exit
	}

	get isFocus() {
		return this.props.focus === this.props.index
	}

	get next() {
		return Math.max(this.props.current, this.props.index + 1)
	}





// SECURE INPUT

	showText() {
		this.updateState(state => state.set("maskText", false))
	}

	maskText() {
		this.updateState(state => state.set("maskText", true))
	}



// LOCK INPUT

	lock() {
		return new Promise(resolve => this.updateState(
			state => state.set("locked", true),
			resolve
		))
	}

	unlock() {
		return new Promise(resolve => this.updateState(
			state => state.set("locked", false),
			resolve
		))
	}



// LIFECYCLE

	componentWillMount() {

		// Create value data
		if (!this.props.data.has(this.name)) {
			this.props.data.set(this.name, observable.map({
				value: this.defaultValue,
				error: false,
				errorMessage: "unknown error",
				validating: false,
				valid: false,
			}))
		}

	}

	componentDidMount() {

		// Set secure text entry on, if required
		if (this.secure) this.maskText()

		// Send input reference to parent
		if (this.props.innerRef) this.props.innerRef(this.props.index, this.input)

		// Sanitize input
		this.sanitizor = this.data.intercept(this.intercept)

		// Validate on input
		this.validator = this.data.observe(({ name }) => {

			// Handle value changes
			if (name === "value") this.onChange()

		})

		// Trigger animations on changes
		this.animator = this.data.observe(change => {
			setTimeout(this.props.animator.play, 10)
		})

	}


	componentWillUpdate(nextProps) {

		// Premtively focus on first reveal
		if (nextProps.current !== this.props.current
				&& nextProps.current === nextProps.index) {

			// Delay focus to sync keyboard with animation
			this.props.setFocus(nextProps.index)

		}

		// Check if focus will change
		if (nextProps.focus !== this.props.focus) {

			// Clear focus timer
			clearTimeout(this.focusTimer)

			// Focus on input, if this component is active
			if (nextProps.focus === nextProps.index) {
				this.input.focus()
			} else {
				this.input.blur()
			}

		}

	}


	componentDidUpdate(lastProps) {

		// Check if mode has changed
		if (lastProps.mode !== this.props.mode) {

			// Force validation
			this.onChange(true)

		}

	}


	componentWillUnmount() {

		// Remove sanitizor and validator
		this.sanitizor()
		this.validator()
		this.animator()

		// Clear timers
		clearTimeout(this.validationTimer)
		clearTimeout(this.focusTimer)

	}




// ACTIONS

	@action.bound
	setValue(value) {
		this.data.set("value", value)
	}

	@action.bound
	setValidating() {
		this.data.set("validating", this.validating + 1)
		this.data.set("valid", false)
		this.data.set("error", false)
	}

	@action.bound
	clearValidating() {
		this.data.set("validating", this.validating - 1)
	}

	@action.bound
	setInvalid(error) {
		this.data.set("validating", this.validating - 1)
		this.data.set("valid", false)
		this.data.set("error", true)
		this.data.set("errorMessage", error)
	}

	@action.bound
	setValid() {
		this.data.set("validating", this.validating - 1)
		this.data.set("valid", true)
		this.data.set("error", false)
	}

	@action.bound
	clearAll() {
		this.data.set("validating", this.validating - 1)
		this.data.set("valid", false)
		this.data.set("error", false)
	}





// OVERRIDES

	@computed
	get formatValue() {
		return this.value
	}

	sanitize(value) {
		return value
	}

	async validate(value) {
		this.setValid()
		return true
	}

	@computed
	get returnKeyType() {
		return "next"
	}




// INPUT

	intercept(change) {

		// Sanitize the new input, if changed
		if (change.name === "value") {
			change.newValue = this.sanitize(change.newValue)
		}

		// Return the change object
		return change

	}


	onChange(forced = false) {

		// Cancel previous validation, if scheduled
		clearTimeout(this.validationTimer)

		// Ignore empty values
		if ((!this.value || this.value.length === 0))
			return this.clearAll()

		// Clear any existing validation errors
		this.setValidating()

		// Schedule validation
		this.validationTimer = setTimeout(

			() => this.validate(this.value)
				.then(result => result ?
					this.setValid()
					:
					this.clearValidating()
				)
				.catch(this.setInvalid),

			this.config.validation.delay

		)

	}


	async submit() {

		// Prevent submission during animations
		if (!this.ready) return
		
		// Lock input
		await this.lock()

		// Force validation
		let valid = await this.validate(this.value)
			.catch(error => {
				this.setInvalid(error)
				return false
			})

		// Unlock input
		await this.unlock()

		// Ignore if entry is not valid, otherwise
		// move to next registration step
		if (!valid) {
			this.props.setFocus(this.props.index)
		} else {
			this.props.next(this.next)
		}

	}




// RENDER

	render() {

		// Determine caption
		let caption = 
			!this.isVisible ? "none" :
			!this.isFocus ? "none" :
			this.props.mode === "signin" ? "placeholder" :
			this.error ? "error" :
			this.valid ? "valid" :
			this.validating ? "validating" :
			!this.filled ? "empty" :
			"placeholder"

		return <FadingView
			animator={this.props.animator}
			show={this.isVisible}
			onShow={() => this.ready = true}
			beforeHide={() => this.ready = false}
			style={this.style.lobby.inputContainer}>

			<View style={this.style.lobby.inputWrapper}>

				<TextInput

					ref={ref => { this.input = ref }}
					key={this.name}

					style={this.multiline ?
						this.style.lobby.multiInput :
						this.style.lobby.singleInput
					}
					autoFocus={false}
					blurOnSubmit={false}
					autoCorrect={this.autoCorrect}
					autoCapitalize={this.capitalize}
					multiline={this.multiline}
					secureTextEntry={this.getState("maskText")}
					
					onChangeText={this.setValue}
					value={this.data.get("value")}
					placeholder={this.placeholder}

					returnKeyType={this.returnKeyType}
					onSubmitEditing={!this.multiline ? this.submit : null}
					
				/>

				<View
					pointerEvents="none"
					style={this.style.lobby.overlay}>
					<FadingView
						animator={this.props.animator}
						show={this.validating && this.filled}
						style={this.style.lobby.overlayRight}>
						<Spinner color={this.colors.neutral} />
					</FadingView>
				</View>

				<View
					pointerEvents="none"
					style={this.style.lobby.overlay}>
					<FadingIcon
						animator={this.props.animator}
						show={this.error}
						icon="ban"
						containerStyle={this.style.lobby.overlayRight}
						color={this.colors.bad}
						size={this.style.font.size.normal}
					/>
				</View>

				<View
					pointerEvents="none"
					style={this.style.lobby.overlay}>
					<FadingIcon
						animator={this.props.animator}
						show={this.valid}
						icon="check"
						containerStyle={this.style.lobby.overlayRight}
						color={this.colors.good}
						size={this.style.font.size.normal}
					/>
				</View>

				{!this.isFocus ?
					<TouchableWithoutFeedback
						onPress={() => this.props.setFocus(this.props.index)}>
						<View style={this.style.lobby.overlay} />
					</TouchableWithoutFeedback>
					: null
				}

				<View
					pointerEvents="box-none"
					style={this.style.lobby.overlay}>
					<FadingView
						style={this.multiline ?
							this.style.lobby.overlayMulti
							:
							this.style.lobby.overlayLeft
						}
						animator={this.props.animator}
						show={this.skippable && !this.filled && this.isFocus}>
						<Button
							onPress={() => this.props.next(this.props.index + 1)}
							color="transparent"
							label="SKIP"
							labelStyle={this.style.lobby.overlayText}
						/>
					</FadingView>
				</View>

				<View
					pointerEvents="box-none"
					style={this.style.lobby.overlay}>
					<FadingView
						style={this.style.lobby.overlayMulti}
						animator={this.props.animator}
						show={this.multiline && this.filled}>
						<Button
							onPress={() => this.props.next(this.props.index + 1)}
							color="transparent"
							icon="arrow-right"
							iconColor={this.colors.major}
							style={this.style.lobby.nextButton}
						/>
					</FadingView>
				</View>

				<View
					pointerEvents="box-none"
					style={this.style.lobby.overlay}>
					<FadingView
						style={this.style.lobby.overlayLeft}
						animator={this.props.animator}
						show={this.secure}>
						<Button
							style={this.style.lobby.overlayLeft}
							onPress={this.getState("maskText") ? this.showText : this.maskText}
							color="transparent"
							icon={this.getState("maskText") ? "eye-slash" : "eye"}
							iconColor={this.colors.neutralDark}
						/>
					</FadingView>
				</View>

			</View>


			<FadingView
				style={this.style.lobby.caption}
				animator={this.props.animator}
				show={caption === "error"}>
				<Text style={this.style.text.bad}>
					{this.data.get("errorMessage") || "..."}
				</Text>
			</FadingView>
			

			<FadingView
				style={this.style.lobby.caption}
				animator={this.props.animator}
				show={caption === "empty"}>
				<Text style={this.style.text.neutral}>
					{this.caption.empty || "..."}
				</Text>
			</FadingView>


			<FadingView
				style={this.style.lobby.caption}
				animator={this.props.animator}
				show={caption === "validating"}>
				<Text style={this.style.text.neutral}>
					{this.caption.validating || "validating"}
				</Text>
			</FadingView>
			

			<FadingView
				style={this.style.lobby.caption}
				animator={this.props.animator}
				show={caption === "valid"}>
				<Text style={this.style.text.good}>
					{this.caption.valid || "valid"}
				</Text>
			</FadingView>


			<FadingView
				style={this.style.lobby.caption}
				animator={this.props.animator}
				show={caption === "placeholder"}>
				<Text style={this.style.text.hide}>
					{"..."}
				</Text>
			</FadingView>


		</FadingView>
		
	}

}

export default LobbyInput;