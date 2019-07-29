import { observable, computed, action, toJS } from "mobx";

import Post from './Post';

export default class PostStore {

	@observable index = new Map()

	constructor(store) {

		this.store = store;

		this.add = this.add.bind(this)

	}

	@action add(address) {

		// Check if post already exists
		let current = this.index.get(address)
		if (current) { return current }

		// Otherwise, create the post
		this.index.set(address, new Post(this.store, address))
		return this.index.get(address)

	}

}