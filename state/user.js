import { observable, computed, action } from "mobx";

import Loadable from './loadable';


class UserProfile extends Loadable {
	fetch(update) {
		return this.store.api
			.task("load profile", { address: this.address })
			.subscribe(update)
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
			.task("load rights", { address: this.address })
			.subscribe(update)
	}
}

class UserSanctions extends Loadable {
	fetch(update) {
		return this.store.api
			.task("load sanctions", { address: this.address })
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

		this.profile = new UserProfile(this)
			.surface("identity", "name", "bio", "picture", "created")

		this.postIndex = new UserPosts(this)
		this.topicIndex = new UserTopics(this)

		this.PDMIndex = new UserPDM(this)
		this.ADMIndex = new UserADM(this)

		this.followerIndex = new UserFollowers(this)
		this.followingIndex = new UserFollowing(this)

		this.integrityIndex = new UserIntegrity(this)
		this.rightsIndex = new UserRights(this)
		this.sanctionIndex = new UserSanctions(this)

	}


	@computed get identity() { return this.profile.identity }
	@computed get name() { return this.profile.name }
	@computed get bio() { return this.profile.bio }
	@computed get picture() { return this.profile.picture }
	@computed get created() { return this.profile.created }

	@computed get posts() { return this.postIndex.value }
	@computed get topics() { return this.topicIndex.value }

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

	@computed get integrityHistory() { return this.integrityIndex.value }
	@computed get integrity() {
		return this.integrityHistory.reduce((t, x) => t * (1.0 + x), 0.5)
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


	@action load() {
		return new Promise((resolve, reject) => {
			this.loading = true
			Promise
				.all([
					this.profile.load(),
					this.postIndex.load(),
					this.topicIndex.load(),
					this.PDMIndex.load(),
					this.ADMIndex.load(),
					this.followerIndex.load(),
					this.followingIndex.load(),
					this.integrityIndex.load(),
					this.rightsIndex.load(),
					this.sanctionIndex.load()
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

}