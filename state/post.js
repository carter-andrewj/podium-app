import { observable, computed, action } from "mobx";

import { formatNumber } from '../utils/utils';

import Loadable from './loadable';





class PostContent extends Loadable {
	fetch(update) {
		return new Promise((resolve, reject) => {
			this.store.api
				.task("load post", { address: this.address })
				.subscribe(update)
				.then(({ content }) => resolve(content))
				.catch(reject)
		})
	}
}


class PostReplies extends Loadable {
	fetch(update) {
		return new Promise((resolve, reject) => {
			this.store.api
				.task("index replies", { address: this.address })
				.subscribe(update)
				.then(({ index }) => resolve(index))
				.catch(reject)
		})
	}
}


class PostPromotions extends Loadable {
	fetch(update) {
		return new Promise((resolve, reject) => {
			this.store.api
				.task("index promotions", { address: this.address })
				.subscribe(update)
				.then(({ index }) => resolve(index))
				.catch(reject)
		})
	}
}



export default class Post {

	address = "";

	authorError = undefined;
	parentError = undefined;
	originError = undefined;
	threadError = undefined;

	constructor(store, address) {

		this.store = store
		this.address = address

		this.load = this.load.bind(this)

		this.content = new PostContent(this)
			.surface("created", "text", "author", "depth",
					 "origin", "parent", "references", "media",
					 "amendments", "retraction",
					 "cost", "currency")

		this.replyIndex = new PostReplies(this)
		this.promotionIndex = new PostPromotions(this)

		this.loadAuthor = this.loadAuthor.bind(this)
		this.loadOrigin = this.loadOrigin.bind(this)
		this.loadParent = this.loadParent.bind(this)
		this.loadThread = this.loadThread.bind(this)

	}

	@computed get created() { return this.content.created }
	@computed get text() { return this.content.text }
	@computed get author() { return this.content.author }
	@computed get depth() { return this.content.depth }
	@computed get origin() { return this.content.origin }
	@computed get parent() { return this.content.parent }
	@computed get cost() { return this.content.cost }
	@computed get currency() { return this.content.currency }
	@computed get paid() {
		return this.content.currency === "ADM" || this.promotedWithADM > 0
	}

	@computed get references() { return this.content.references }
	@computed get mentions() { return this.content.references.mentions }
	@computed get topics() { return this.content.references.topics }
	@computed get links() { return this.content.references.links }

	@computed get media() { return this.content.media }

	@computed get amendments() { return this.content.amendments }
	@computed get retraction() { return this.content.retraction }

	@computed get replies() { return this.replyIndex.value || [] }
	@computed get replyCount() { return formatNumber(this.replies.length)}

	@computed get promotions() { return this.promotionIndex.value || [] }
	@computed get promotionCount() { return formatNumber(this.promotions.length)}
	@computed get promotedWithPDM() {
		return this.promotions
			.filter(p => p.currency === "PDM")
			.reduce((t, p) => t + p.value, 0)
	}
	@computed get promotedWithADM() {
		return this.promotions
			.filter(p => p.currency === "ADM")
			.reduce((t, p) => t + p.value, 0)
	}


	@computed get ready() {
		// The post is "ready" when...

		// ...its content is loaded
		return this.status.content.ready &&

			// ...its author is loaded
			this.store.users[this.author].ready &&

			// ...it has no posts higher in the thread, or
			this.depth === 0 || (

				// ...the post above it in the thread has been loaded
				this.store.posts[this.parent].ready &&

				// ...and that is the only post, or the origin of the
				// thread has also been loaded
				(this.depth === 1 || this.store.posts[this.origin].ready)
			
			)
	}

	@computed get complete() {
		// The post is "complete" when...

		// It is considered "ready"
		return this.ready &&

			// ...its replies have been indexed
			this.status.replies.ready &&

			// ...its promotions have been loaded
			this.status.promotions.ready

	}


	@computed get error() {
		return this.content.error ||
			this.authorError ||
			this.replyIndex.error ||
			this.promotionIndex.error ||
			this.originError ||
			this.parentError ||
			this.threadError ||
			null
	}


	// Load the post data
	load(...args) {

		// Filter loading targets
		let only = args.filter(s => s.charAt(0) !== "!")
		if (only.length === 0) {
			only = ["author", "origin", "parent", "replies", "promotions"]
			only = only.filter(s => !args.includes("!" + s))
		}
		
		// Load data
		return new Promise((resolve, reject) => {
			this.content
				.load()
				.then(() => Promise.all([

					// Load author data
					only.includes("author") ?
						this.loadAuthor()
						: null,

					// Load origin post
					only.includes("origin") ?
						this.loadOrigin()
						: null,

					// Load parent post
					only.includes("parent") ?
						this.loadParent("!parent")
						: null,

					// Load reply index
					only.includes("replies") ?
						this.replyIndex.load()
						: null,

					// Load promotion index
					only.includes("promotions") ?
						this.promotionIndex.load()
						: null,

				]))
				.then(() => resolve(this))
				.catch(reject)
		})
	}



	loadAuthor() {
		return new Promise((resolve, reject) => {
			this.authorError = undefined
			this.store.users
				.add(this.author)
				.load("profile")
				.then(resolve)
				.catch(error => {
					this.authorError = error
					reject(error)
				})
		})
	}


	loadParent() {
		return new Promise((resolve, reject) => {
			if (!this.parent) {
				resolve(this)
			} else {
				this.parentError = undefined
				this.store.posts
					.add(this.parent)
					.load("!parent")
					.then(resolve)
					.catch(error => {
						this.parentError = error
						reject(error)
					})
			}
		})
	}


	loadOrigin() {
		return new Promise((resolve, reject) => {
			if (this.origin === this.address) {
				resolve(this)
			} else {
				this.originError = undefined
				this.store.posts
					.add(this.origin)
					.load()
					.then(resolve)
					.catch(error => {
						this.originError = error
						reject(error)
					})
			}
		})
	}

	loadThread() {
		return new Promise((resolve, reject) => {
			if (this.depth > 0) {
				this.threadError = undefined
				this.loadParent(this.depth - 1)
					.then(resolve)
					.catch(error => {
						this.threadError = error
						reject(error)
					})
			}
		})
	}


}