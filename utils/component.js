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

}