import { Component as Comp } from 'react';
import { fromJS } from 'immutable'


export default class Component extends Comp {

	constructor() {
		super()
		this.getState = this.getState.bind(this)
		this.updateState = this.updateState.bind(this)
	}

	getState() {
		const state = fromJS(this.state)
		const args = Array.prototype.slice.call(arguments)
		if (args.length === 1) {
			return state.get(args[0])
		} else {
			return state.getIn(args)
		}
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