import { observable, computed, action, toJS, asFlat } from "mobx";



export default class Session {

	@observable authenticated = false;

	@observable address = "";

	@observable tasks = {};

	pending = []
	@observable feed = []

	alerts = observable.array([])


	constructor(store) {

		this.store = store;

		this.setTask = this.setTask.bind(this)
		this.clearTask = this.clearTask.bind(this)

		this.register = this.register.bind(this)
		this.signIn = this.signIn.bind(this)
		this.signOut = this.signOut.bind(this)

		this.authenticate = this.authenticate.bind(this)
		this.deauthenticate = this.deauthenticate.bind(this)

		this.follow = this.follow.bind(this)
		this.unfollow = this.unfollow.bind(this)

		this.updateProfile = this.updateProfile.bind(this)

		this.getFeed = this.getFeed.bind(this)

	}



	@computed get user() {
		return this.store.users.get(this.address)
	}



	@action setTask(id, msg) {
		this.tasks[id] = msg
	}

	@action clearTask(id) {
		delete this.tasks[id]
	}



	register(identity, passphrase, onUpdate) {

		// Set Status
		this.setTask("register", "pending")

		// Build updater
		let updateHandler = status => {
			this.setTask("register", status)
			if (onUpdate) { onUpdate(status) }
		}

		return new Promise((resolve, reject) => {
			this.store.api
				.task(
					"create user",
					{
						identity: identity,
						passphrase: passphrase
					}
				)
				.subscribe(updateHandler)
				.then(({ keyPair }) => this.signIn(
					keyPair, identity, passphrase, onUpdate
				))
				.then(() => {
					this.clearTask("register")
					resolve()
				})
				.catch(reject)
		})

	}



	signIn(keyPair, identity, passphrase, onUpdate) {

		// Set status
		this.setTask("sign in", "pending")

		// Build updater
		let updateHandler = status => {
			this.setTask("sign in", status)
			if (onUpdate) { onUpdate(status) }
		}

		// Sign in with keypair
		return new Promise((resolve, reject) => {
			this.store.api
				.task(
					keyPair ? "key in" : "sign in",
					{
						keyPair: keyPair,
						identity: identity,
						passphrase: passphrase
					}
				)
				.subscribe(updateHandler)
				.then(result => {
					if (result.error) {
						console.error(error)
						reject(error)
					} else {
						this.clearTask("sign in")
						return this.authenticate(
							result.address,
							result.keyPair,
							identity,
							passphrase
						)
					}
				})
				.then(() => resolve(this))
				.catch(reject)
		})

	}


	signOut(onUpdate) {
		return new Promise((resolve, reject) => {
			this.store.api
				.task("sign out")
				.subscribe(onUpdate)
				.then(() => {
					this.deauthenticate()
					resolve(this)
				})
				.catch(reject)
		})
	}


	@action authenticate(address, keyPair, identity, passphrase) {
		this.address = address
		this.authenticated = true
		return Promise.all([

			// Load this user's data
			this.store.users.add(this.address).load(),

			// Subscribe for this user's feed
			this.getFeed(),

			// Update keychain
			this.store.addAccount(this.address, keyPair,
								  identity, passphrase),

			// Update auto-sign-in
			this.store.setAccount(this.address)

		])
	}


	@action deauthenticate() {
		this.address = undefined
		this.authenticated = false
	}



	follow(address, onUpdate) {
		return new Promise((resolve, reject) => {
			this.store.api
				.task("follow", { address: address})
				.subscribe(onUpdate)
				.then(resolve)
				.catch(reject)
		})
	}


	unfollow(address, onUpdate) {
		return new Promise((resolve, reject) => {
			this.store.api
				.task("unfollow", { address: address})
				.subscribe(onUpdate)
				.then(resolve)
				.catch(reject)
		})
	}




	updateProfile(profile, onUpdate) {
		return new Promise((resolve, reject) => {

			// Build profile payload
			const payload = {
				...profile,
				pictureType: profile.picture? "png" : undefined
			}

			// Create update task
			return this.store.api
				.task("update profile", payload)
				.subscribe(onUpdate)
				.then(resolve)
				.catch(reject)

		})
	}



	@action addAlert(alert) {
		this.alerts.push(alert)
	}


	getFeed() {
		return new Promise((resolve, reject) => {
			this.store.api
				.task("feed")
				.subscribe(post => {
					this.pending.push(post)
				})
				.then(resolve)
				.catch(reject)
		})
	}


	sendPost(args, onUpdate) {
		return new Promise((resolve, reject) => {
			this.store.api
				.task("create post", args)
				.subscribe(onUpdate)
				.then(resolve)
				.catch(reject)
		})
	}



}