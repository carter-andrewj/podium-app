import { Component as BaseComponent } from 'react';
import { fromJS } from 'immutable'


export default class Component extends BaseComponent {

	constructor() {
		super()
		this.navigate = this.navigate.bind(this)
		this.updateState = this.updateState.bind(this)
	}


// GETTERS

	// Root app data store
	get store() {
		return this.props.store
	}

	get config() {
		return this.store.config
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

	get navigator() {
		return this.props.navigation
	}

	// Navigation parameters
	get params() {
		return this.navigator.state.params
	}



// HELPERS

	navigate(to, params) {
		this.navigator.navigate(to, params)
	}

	updateState(fn, callback) {
		this.setState(
			last => {
				let next = fromJS(last);
				return fn(next).toJS()
			},
			callback
		)
	}



}