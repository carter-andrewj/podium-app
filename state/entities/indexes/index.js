import { observable, computed, action } from 'mobx';
import { List } from 'immutable';

import Entity from '../entity';

import { placeholder } from '../utils';



class Index extends Entity {


	constructor(...args) {

		// Call parent constructor
		super(...args)

		// State
		this.state = observable.array()

	}



// OVERRIDES

	@action.bound
	setState(newState) {

		// Remove values
		this.state
			.filter(v => !newState.includes(v))
			.map(v => this.state.remove(v))

		// Add values
		newState
			.filter(s => !this.has(s))
			.map(v => this.state.push(v))

	}



// GETTERS

	@computed
	@placeholder(0)
	get count() {
		return this.state.length
	}

	@computed
	@placeholder([])
	get all() {
		return this.state
	}



// UTILITIES

	first(n) {
		if (!n) {
			return this.state[0]
		} else {
			return this.state.slice(0, n)
		}
	}

	last(n) {
		if (!n) {
			return this.state[this.count - 1]
		} else {
			return this.state.slice(this.count - n)
		}
	}

	has(item) {

		// Ignore until entity is ready
		if (!this.ready) return undefined

		// Check if item exists in index
		return this.state.find(entry => entry === item) ? true : false

	}

	map(callback) {
		return this.state.map(callback)
	}

	reduce(operator, empty) {
		return this.state.reduce(operator, empty)
	}

	filter(callback) {
		return List(this.meta.toJS()).filter(callback)
	}


}

export default Index;