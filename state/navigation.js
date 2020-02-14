import { Map } from 'immutable';

import { observable, computed } from 'mobx';



export default class Navigation {

	constructor(store) {

		// Refs
		this.store = store

		// State
		this.routes = observable.map({}, { deep: false })
		this.stack = observable.array()

		// Methods
		this.register = this.register.bind(this)
		this.deregister = this.deregister.bind(this)
		

	}


	current(route) {
		return this.routes.get(route).get("current")
	}



// NAVIGATOR COMPONENTS

	register(id) {

		// Throw error if a navigator with that ID already exists
		if (this.routes.get(id))
			throw `NAVIGATION ERROR: a navigator named '${id}' already exists.`

		// Create route
		this.routes.set(id, observable.map(
			{
				id: id,
				stack: [],
				current: undefined,
				distance: 0,
				last: undefined,
				next: undefined,
				exiting: false,
				exited: false,
				entering: false,
				entered: true
			},
			{ deep: false }
		))

	}

	deregister(id) {
		this.routes.clear(id)
	}


}