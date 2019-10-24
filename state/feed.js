import { observable, computed, action } from "mobx";

import { Set, Map } from 'immutable'



export default class Feed {

	constructor(session) {

		// Refs
		this.session = session

		// State
		this.queued = Map()
		this.published = Map()
		this.threads = observable.map()

		// Flags
		this.publishing = observable.box(false)

		// Methods
		this.has = this.has.bind(this)
		this.hasPublished = this.hasPublished.bind(this)
		this.hasPending = this.hasPending.bind(this)

		this.stale = this.stale.bind(this)

		this.queue = this.queue.bind(this)
		this.publish = this.publish.bind(this)

	}


// GETTERS

	@computed
	get size() {
		return this.published.size
	}

	@computed
	get pending() {
		return this.queued.size
	}

	@computed
	get all() {
		let out = []
		this.threads.forEach((_, v) => out.concat(v))
		return out
	}



// QUERIES

	hasPublished(address) {
		return this.published.has(address)
	}

	hasPending(address) {
		return this.queued.map(q => q.post.address).toSet().has(address)
	}

	has(address) {
		return this.hasPublished(address) || this.hasPending(address)
	}

	stale(address, issue) {
		return this.published.get("address") > issue
	}



// PUBLISHING

	async queue(address) {

		// Check if post has already been published
		if (!this.has(address)) {

			// Load post
			let post = await this.session.subscribe("post", address)

			// Add to pending posts
			// (Note: the feed intentionally replaces old posts with
			// newer ones in the same thread)
			this.queued = this.queued.set(post.origin, Map({
				post: post,
				issue: this.size
			}))

		}

	}


	@action
	publish() {

		// Set flag
		this.publishing.set(true)

		// Decant queue
		let queued = this.queued
		this.queued = Set()

		// Record/update published posts
		const posts = queued.reduce(
			(p, q) => {
				const post = q.get("post")
				return p.set(post.address, post.issue)
			},
			Map()
		)
		this.published = this.published.mergeDeep(posts)

		// Publish posts
		this.threads.set(this.size, queued.toJS())

		// Add empty queue and clear flag
		this.publishing.set(false)

	}


}