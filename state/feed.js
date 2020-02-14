import { observable, computed, action } from "mobx";

import { Set, Map } from 'immutable'



export default class Feed {

	constructor(session) {

		// Refs
		this.session = session
		this.nation = session.nation

		// State
		this.sources = Map()
		this.queued = observable.map({}, { deep: false })
		this.nextPublished = Map()
		this.nextAuthors = Map()
		this.published = Map()
		this.threads = observable.array([], { deep: false })

		// Flags
		this.live = false
		this.publishing = observable.box(false)

		// Methods
		this.has = this.has.bind(this)
		this.hasPublished = this.hasPublished.bind(this)
		this.hasPending = this.hasPending.bind(this)

		this.isStale = this.isStale.bind(this)

		this.connect = this.connect.bind(this)
		this.subscribe = this.subscribe.bind(this)
		this.unsubscribe = this.unsubscribe.bind(this)
		this.disconnect = this.disconnect.bind(this)

		this.queue = this.queue.bind(this)
		this.publish = this.publish.bind(this)

	}



// GETTERS

	@computed
	get pending() {
		return this.queued.size
	}

	@computed
	get size() {
		return this.published.size
	}

	@computed
	get all() {
		return this.threads.toJS()
	}




// QUERIES

	hasPublished(address) {
		return this.published.has(address)
	}

	hasPending(address) {
		return [...this.queued.values()].includes(address)
	}

	has(address) {
		return this.hasPublished(address) || this.hasPending(address)
	}

	isStale(address, issue) {
		return this.published.get("address") > issue
	}




// SUBSCRIPTIONS

	async connect() {

		// Ignore if already connected
		if (this.live) return

		// Set live flag
		this.live = true

		// Subscribe to active user and current followed users
		await Promise.all([
			this.subscribe(this.session.user.address),
			...this.session.user.following.map(this.subscribe)
		])

		// Publish posts
		await this.publish()

		// React to changes in followed users
		this.following = this.session.user.following.observe(({ added, removed }) => {

			// Handle unfollows
			removed.map(this.unsubscribe)
			
			// Handle follows
			added.map(this.subscribe)

		})

	}


	async subscribe(address) {

		// Get user
		let user = this.nation.get("user", address)

		// Wait for user to load
		await user.whenReady()

		// Get this user's latest post
		await Promise.all(user.posts.last(10).map(this.queue))

		// Listen to this user's posts
		let posts = user.posts.observe(({ added }) => added.map(this.queue))

		// Log subscription
		this.sources = this.sources.set(address, { remove: posts })

		return

	}


	unsubscribe(address) {

		// Stop listener
		this.sources.get(address).remove()

		// TODO - Remove any pending posts from this user

		// Remove subscription
		this.sources = this.sources.delete(address)

	}


	disconnect() {

		// Ignore if not connected
		if (!this.live) return

		// Clear connected flag
		this.live = false

		// Remove followed user listener
		this.following()
		this.following = undefined

		// Stop all subscriptions
		this.sources.map(s => s.remove())

		// Delete subscriptions
		this.sources = Map()

	}




// PUBLISHING

	async queue(address) {

		// Check if post has already been published
		if (!this.has(address)) {

			// Load post
			let post = this.nation.get("post", address)

			// Wait for post data
			await post.whenReady()

			// Ignore broken/empty posts
			if (!post.text) return

			// If a post from this thread is already queued, remove it
			let fromThread = this.queued.get(post.originAddress)
			if (fromThread) {
				this.nextPublished = this.nextPublished.delete(fromThread.address)
			}

			// If an origin post from this author is already queued, remove it
			let replace
			let fromAuthor = this.nextAuthors.get(post.authorAddress)
			if (fromAuthor) {
				replace = fromAuthor
				this.nextPublished = this.nextPublished.delete(fromAuthor)
			}

			// Update queue metadata
			this.nextPublished = this.nextPublished.set(address, this.size)
			this.nextAuthors = this.nextAuthors.set(post.authorAddress, address)

			// Add to publishing set
			this.enqueue(post, replace)
			
		}

		return

	}


	publish() {

		// Ignore if already publishing
		if (this.publishing.get()) return

		// Decant queue and set flag
		let queued = this.setPublishing()

		// Record/update published posts
		this.published = this.published.merge(this.nextPublish)
		this.nextPublish = Map()
		this.nextAuthors = Map()

		// Sort queue
		let issue = [ ...queued.values() ]
		issue.sort((a, b) => a.timestamp < b.timestamp)

		// Publish posts
		this.addThreads([
			...issue,
			this.size > 0 ?
				{ type: "notice", value: queued.size }
				: null,
		])

	}




// ACTIONS

	@action.bound
	enqueue(post, replace) {

		// Remove replaced post, if required
		if (replace) this.queued.delete(replace)

		// Add to pending posts
		// (Note: the feed intentionally replaces old posts with
		// newer ones in the same thread)
		this.queued.set(post.originAddress, {
			author: post.authorAddress,
			address: post.address,
			timestamp: post.updated.get(),
			issue: this.size,
			type: "thread",
		})

	}


	@action.bound
	setPublishing() {
		let queued = this.queued.toJS()
		this.publishing.set(true)
		this.queued.clear()
		return queued
	}


	@action.bound
	addThreads(threads) {
		let newFeed = threads.filter(x => x).concat(this.threads)
		this.threads.replace(newFeed)
		this.publishing.set(false)
	}


	@action.bound
	clear() {

		// Clear variables
		this.queued.clear()
		this.published = Map()

		// Empty feed
		this.threads.clear()

	}

}