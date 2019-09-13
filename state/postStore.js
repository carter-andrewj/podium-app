import { observable, computed, action, toJS } from "mobx";

import Post from './post';


export default class PostStore {

	feedCount = 0

	@observable index = new Map()

	@observable next = new Map()
	@observable published = []

	@observable threads = new Map()


	constructor(store) {

		this.store = store;

		this.add = this.add.bind(this)
		this.get = this.get.bind(this)

		this.prepare = this.prepare.bind(this)
		this.publish = this.publish.bind(this)
		this.isStale = this.isStale.bind(this)

	}


// POSTS

	@action add(address, feed=false) {

		// Check if post already exists
		let current = this.index.get(address)
		if (current) { return current }

		// Otherwise, create the post
		this.index.set(address, new Post(this.store, address))

		// Schedule post for publication in the
		// feed, if required
		if (feed) { this.prepare(address) }

		// Return the post
		return this.index.get(address)

	}

	get(address) {
		return this.index.get(address)
	}




// FEED

	@action prepare(address) {
		this.get(address)
			.load("content")
			.then(post => {

				// Add the post to the next feed
				this.next.set(post.origin, post.address)

				// Pre-emptively load the post's author
				this.store.users
					.add(post.author)
					.load("profile")

			})
			.catch(console.error)
	}


	@computed get pending() {
		return this.next.size
	}


	@action publish() {

		// Create feed
		let threads = Array
			.from(this.next)
			.map(([ origin, address ], index) => {

				// Track published threads
				this.threads.set(
					origin,
					(this.threads.get(origin) || 0) + 1
				)

				// Create thread object
				return {
					type: "thread",
					key: `feed-${this.feedCount}-${index}`,
					address: address,
					origin: origin,
					appearances: this.threads.get(origin)
				}

			})
			.reverse()

		// Create publication notice element
		const notice = {
			type: "notice",
			value: threads.length,
			at: new Date().getTime()
		}

		// Publish new threads
		this.published.push([...threads, notice])

		// Clear pending threads
		this.next.clear()

		// Update counter
		this.feedCount++

	}

	@computed get feed() {
		return this.published.reverse()
			.reduce((out, next) => out.concat(...next), [])
	}


	isStale(origin, count) {
		return this.threads.get(origin) < count
	}



}


