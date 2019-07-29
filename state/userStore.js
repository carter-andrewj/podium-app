import { observable, computed, action, toJS } from "mobx";

import User from './user';

export default class UserStore {

	@observable index = new Map()

	constructor(store) {

		this.store = store;

		this.add = this.add.bind(this)

		this.is = this.is.bind(this)
		this.find = this.find.bind(this)

	}

	@action add(address) {

		// Check if user already exists
		let current = this.index.get(address)
		if (current) { return current }

		// Otherwise, create the user
		this.index.set(address, new User(this.store, address))
		return this.index.get(address)
		
	}


	find(search) {
		if (search.length === 51) {
			return this.index.get(search)
		} else {
			return this.index.values()
				.find(u => u.identity === search)
		}
	}


	is(id, onUpdate) {
		return new Promise((resolve, reject) => {
			this.store.api
				.task("check user", { target: id })
				.subscribe(onUpdate)
				.then(resolve)
				.catch(reject)
		})
	}

}