import { Component as Comp } from 'react';
import { fromJS } from 'immutable'


export default class Component extends Comp {

	constructor() {
		super()
		this.updateState = this.updateState.bind(this)
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


// GETTERS

	// Root app data store
	get store() {
		return this.props.store
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


}