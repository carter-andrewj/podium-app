import { Component as BaseComponent } from 'react';
import { inject, observer } from 'mobx-react';
import { Map, fromJS } from 'immutable'




export default class Component extends BaseComponent {

	constructor(state) {
		super()
		this.state = {
			_state: Map(state)
		}
		// this.navigate = this.navigate.bind(this)
		this.back = this.back.bind(this)
		this.updateState = this.updateState.bind(this)
		this.getState = this.getState.bind(this)
	}




// GETTERS

	// Root app data store
	get store() {
		return this.props.store
	}

	// Root config data
	get config() {
		return this.store.config
	}

	// App Settings
	get settings() {
		return this.store.config.settings
	}

	// Stylesheet
	get style() {
		return this.store.style
	}

	// Layout
	get layout() {
		return this.store.style.layout
	}

	// Colors
	get colors() {
		return this.store.style.colors
	}

	// Fonts
	get font() {
		return this.store.style.font
	}

	// Animation timings
	get timing() {
		return this.store.config.settings.timing
	}

	// Swipe settings
	get swipe() {
		return this.store.config.settings.swipe
	}

	// Nation
	get nation() {
		return this.store.nation
	}

	// Current session
	get session() {
		return this.store.session
	}

	// Active User
	get activeUser() {
		return this.session.user
	}






// HELPERS

	mask(content) {
		this.store.setMask(content)
	}


	back() {
		this.navigator.goBack(null)
	}

	updateState(fn, callback) {
		this.setState(
			last => {
				let next = fn(last._state)
				return { _state: next }
			},
			callback
		)
	}

	getState(...args) {
		return args.length === 0 ?
				this.state._state.toJS()
			: args.length === 1 ?
				this.state._state.get(args[0])
			:
				this.state._state.getIn(args)
	}



}