import { observable, computed, action, toJS } from "mobx";

import Loadable from './loadable';


class UserProfile extends Loadable {
	fetch(update) {
		return new Promise((resolve, reject) => {
			this.store.api
				.task("load profile", { address: this.address })
				.subscribe(update)
				.then(({ profile }) => resolve(profile))
				.catch(reject)
		})
	}
}

class UserPosts extends Loadable {
	fetch(update) {
		return this.store.api
			.task("index posts", { address: this.address })
			.subscribe(update)
	}
}

class UserFollowers extends Loadable {
	fetch(update) {
		return this.store.api
			.task("index followers", { address: this.address })
			.subscribe(update)
	}
}

class UserFollowing extends Loadable {
	fetch(update) {
		return this.store.api
			.task("index following", { address: this.address })
			.subscribe(update)
	}
}

class UserTopics extends Loadable {
	fetch(update) {
		return this.store.api
			.task("index topics", { address: this.address })
			.subscribe(update)
	}
}

class UserPDM extends Loadable {
	fetch(update) {
		return this.store.api
			.task("load PDM", { address: this.address })
			.subscribe(update)
	}
}

class UserADM extends Loadable {
	fetch(update) {
		return this.store.api
			.task("load ADM", { address: this.address })
			.subscribe(update)
	}
}

class UserIntegrity extends Loadable {
	fetch(update) {
		return this.store.api
			.task("load integrity", { address: this.address })
			.subscribe(update)
	}
}

class UserRights extends Loadable {
	fetch(update) {
		return this.store.api
			.task("index rights", { address: this.address })
			.subscribe(update)
	}
}

class UserSanctions extends Loadable {
	fetch(update) {
		return this.store.api
			.task("index sanctions", { address: this.address })
			.subscribe(update)
	}
}




export default class User {

	address = "";

	@observable loading = false;


	constructor(store, address) {

		this.store = store
		this.address = address

		this.load = this.load.bind(this)

		this.profile = new UserProfile(this, {})
		this.profile.surface("id", "name", "bio",
			"picture", "pictureType", "created")
		
		this.postIndex = new UserPosts(this, [])
		this.topicIndex = new UserTopics(this, [])

		this.PDMIndex = new UserPDM(this, [])
		this.ADMIndex = new UserADM(this, [])

		this.followerIndex = new UserFollowers(this, [])
		this.followingIndex = new UserFollowing(this, [])

		this.integrityIndex = new UserIntegrity(this, [])
		this.rightsIndex = new UserRights(this, [])
		this.sanctionIndex = new UserSanctions(this, [])

	}


	@computed get identity() { return `@${this.profile.id}` }
	@computed get name() { return this.profile.name }
	@computed get bio() { return this.profile.bio }
	@computed get created() { return this.profile.created }
	@computed get picture() {
		if (this.profile.picture) {
			return {
				uri: `${this.store.config.media.source}/` +
					`${this.profile.picture}.${this.profile.pictureType}`
			}
		} else {
			return require("../assets/profile-placeholder.png")
		}
	}

	@computed get posts() { return this.postIndex.value }
	@computed get topics() { return this.topicIndex.value  }

	@computed get transactionsPDM() { return this.PDMIndex.value }
	@computed get PDM() {
		return this.transactionsPDM.reduce((t, x) => t + x.value, 0)
	}

	@computed get transactionsADM() { return this.ADMIndex.value }
	@computed get ADM() {
		return this.transactionsADM.reduce((t, x) => t + x.value, 0)
	}

	@computed get followers() { return this.followerIndex.value }
	@computed get following() { return this.followingIndex.value }

	@computed get affinity() { return Math.random() }

	@computed get integrityHistory() { return this.integrityIndex.value }
	@computed get integrity() {
		return Math.random()
	//	return this.integrityHistory.reduce((t, x) => t * (1.0 + x), 0.5)
	}

	@computed get rights() { return this.rightsIndex.value }
	@computed get sanctionHistory() { return this.sanctionIndex.value }
	@computed get sanctions() {
		return this.sanctionHistory
			.filter(s => !s.expires || s.expires >= new Date().now)
	}


	@computed get ready() {
		return this.profile.ready && this.postIndex.ready
	}

	@computed get complete() {
		return this.ready && this.topicIndex.ready &&
			this.PDMIndex.ready && this.ADMIndex.ready &&
			this.followerIndex.ready && this.followingIndex.ready &&
			this.integrityIndex.ready && this.rightsIndex.ready &&
			this.sanctionIndex.ready
	}

	@computed get error() {
		return this.profile.error ||
			this.sanctionsIndex.error ||
			this.rightsIndex.error ||
			this.integrityIndex.error ||
			this.postIndex.error ||
			this.followingIndex.error ||
			this.PDMIndex.error ||
			this.ADMIndex.error ||
			this.followerIndex.error ||
			this.topicIndex.error ||
			null
	}

	@computed get progress() {
		return {
			profile: this.profile.progress,
			posts: this.postIndex.progress,
			topics: this.topicIndex.progress,
			followers: this.followerIndex.progress,
			following: this.followingIndex.progress,
			PDM: this.PDMIndex.progress,
			ADM: this.ADMIndex.progress,
			integrity: this.integrityIndex.progress,
			rights: this.rightsIndex.progress,
			sanctions: this.sanctionIndex.progress
		}
	}

	@computed get steps() {
		return (this.profile.steps || 0) +
			(this.postIndex.steps || 0) +
			(this.topicIndex.steps || 0) +
			(this.followerIndex.steps || 0) +
			(this.followingIndex.steps || 0) +
			(this.PDMIndex.steps || 0) +
			(this.ADMIndex.steps || 0) +
			(this.integrityIndex.steps || 0) +
			(this.rightsIndex.steps || 0) +
			(this.sanctionIndex.steps || 0)
	}


	@action load(...args) {

		// Filter loading targets
		let only = args.filter(s => s.charAt(0) !== "!")
		if (only.length === 0) {
			only = ["profile", "posts", "topics", "pdm", "adm",
					"followers", "following", "integrity",
					"rights", "sanctions"]
			only = only.filter(s => !args.includes("!" + s))
		}

		// Load data
		return new Promise((resolve, reject) => {
			this.loading = true
			Promise
				.all([

					// Load user profile
					only.includes("profile") ?
						this.profile.load()
						: null,

					// Load user posts
					only.includes("posts") ?
						this.postIndex.load()
						: null,

					// Load user #topics
					only.includes("topics") ?
						this.topicIndex.load()
						: null,

					// Load user PDM transactions
					only.includes("pdm") ?
						this.PDMIndex.load()
						: null,

					// Load user ADM transactions
					only.includes("adm") ?
						this.ADMIndex.load()
						: null,

					// Load user followers
					only.includes("followers") ?
						this.followerIndex.load()
						: null,

					// Load user following
					only.includes("following") ?
						this.followingIndex.load()
						: null,

					// Load user integrity
					only.includes("integrity") ?
						this.integrityIndex.load()
						: null,

					// Load user rights
					only.includes("rights") ?
						this.rightsIndex.load()
						: null,

					// Load user sanctions
					only.includes("sanctions") ?
						this.sanctionIndex.load()
						: null

				])
				.then(() => {
					this.loading = false
					resolve(this)
				})
				.catch(error => {
					this.loading = false
					reject(error)
				})
		})
	}


	isFollowing(address) {
		return new Promise((resolve, reject) => {
			this.followingIndex
				.load()
				.then(index => resolve(
					index.value.includes(address)
				))
				.catch(reject)
		})
	}


	isFollowedBy(address) {
		return new Promise((resolve, reject) => {
			this.followerIndex
				.load()
				.then(index => resolve(
					index.value.includes(address)
				))
				.catch(reject)
		})
	}


}