import React from 'react';
import Component from '../../../components/component';
import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';

import styles from '../../../styles/styles';
import settings from '../../../settings';

import FadingView from '../../../components/animated/fadingView';
import CheckBox from '../../../components/inputs/checkBox';



@inject("store")
@observer
class TermsOfService extends Component {

	constructor() {

		super()

		// State
		this.state = { open: false }
		this.name = "tos"

		// Utilities
		this.animator = undefined
		this.observer = undefined

		// Methods
		this.openTerms = this.openTerms.bind(this)
		this.closeTerms = this.closeTerms.bind(this)

	}


// GETTERS

	get data() {
		return this.props.data.get("tos")
	}

	get value() {
		return this.data.get("value")
	}

	get isVisible() {
		return this.props.index <= this.props.current &&
			this.props.focus >= this.props.index &&
			this.props.current < 6
	}

	get isFocus() {
		return this.props.index === this.props.focus
	}



// LIFECYCLE

	componentWillMount() {

		// Create value data
		if (!this.props.data.has("tos")) {
			this.props.data.set("tos", observable.map({
				value: false,
			}))
		}

	}

	componentDidMount() {

		// Trigger next step on aggree
		this.observer = this.data.observe(change => {

			// Unpack change
			const { name, newValue } = change

			// React to changes in value
			if (name === "value") {

				// If the checkbox is now ticked...
				if (newValue) {

					// Close terms and show next component
					this.props.next(this.props.index + 1)

				} else {

					// Otherwise, reopen the terms
					this.props.setFocus(this.props.index)

				}
			}

		})


		// Trigger animations on changes
		this.animator = this.data.observe(change => {
			setTimeout(this.props.animator.play, 10)
		})

	}

	componentWillUpdate(nextProps) {

		// Check if progress has changed
		if (this.props.current !== nextProps.current) {

			// Check if this element is being displayed
			// and blur focus
			if (nextProps.current === nextProps.index)
				this.props.setFocus(nextProps.index)

		}


		// Check if focus has changed
		if (nextProps.focus !== this.props.focus) {

			// Open terms, if this component is nowactive
			if(nextProps.focus === nextProps.index) {
				this.focusTimer = setTimeout(
					this.openTerms,
					settings.layout.fadeTime
				)
			} else {
				this.closeTerms()
			}

		}

	}

	componentWillUnmount() {

		// Dispose of observer
		this.observer()
		this.animator()

	}



// ACTIONS

	@action.bound
	setAgree() {
		this.data.set("value", true)
	}

	@action.bound
	clearAgree() {
		this.data.set("value", false)
	}




// TERMS

	openTerms(callback) {

		// Request focus, if not current. Otherwise, set the open flag.
		if (this.props.focus !== this.props.index) {
			this.props.focus(this.props.index)
		} else {
			this.updateState(
				state => state.set("open", true),
				callback
			)
		}

	}

	closeTerms(callback) {
		this.updateState(
			state => state.set("open", false),
			callback
		)
	}




// RENDER

	render() {

		return <FadingView
			animator={this.props.animator}
			show={this.isVisible}
			style={styles.lobby.container}>

			<FadingView
				animator={this.props.animator}
				show={!this.data.get("value") && this.isFocus}
				style={styles.lobby.tos}>
				<ScrollView contentContainerStyle={styles.lobby.tosHolder}>
					<Text style={styles.text.paragraph}>
						TERMS OF SERVICE GO HERE
					</Text>
					<Text style={styles.text.paragraph}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</Text>
					<Text style={styles.text.paragraph}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</Text>
				</ScrollView>
			</FadingView>

			<TouchableOpacity onPress={this.value ? this.clearAgree : this.setAgree}>
				<View style={styles.lobby.tosAgree}>

					<View style={styles.lobby.tosCheck}>
						<CheckBox
							value={this.value}
							onChange={this.value ? this.clearAgree : this.setAgree}
						/>
					</View>

					<View style={styles.lobby.tosMessage}>
						<Text style={styles.lobby.tosText}>
							I confirm I have read and {"\n"}
							understood these Terms
						</Text>
					</View>
					
				</View>
			</TouchableOpacity>

		</FadingView>
		
	}

}

export default TermsOfService;