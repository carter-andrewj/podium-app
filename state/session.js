import { observable, computed, action } from "mobx";



export default class Session {

	@observable authenticated = false;

	@observable address = "";

	@observable tasks = {};

	pending = []
	@observable feed = []


	constructor(store) {

		this.store = store;

		this.setTask = this.setTask.bind(this)
		this.clearTask = this.clearTask.bind(this)

		this.register = this.register.bind(this)
		this.signIn = this.signIn.bind(this)
		this.signOut = this.signOut.bind(this)

		this.getFeed = this.getFeed.bind(this)

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
				.then(({ keyPair }) => this.signIn(passphrase, keyPair, onUpdate))
				.then(() => {
					this.clearTask("register")
					resolve()
				})
				.catch(reject)
		})

	}


	// @action register(
	// 		identity, passphrase,
	// 		name, bio, picture, pictureExt,
	// 		onUpdate
	// 	) {

	// 	// Set Status
	// 	this.tasks["register"] = "pending"

	// 	// Build updater
	// 	let updateHandler = status => {
	// 		this.tasks["register"] = status
	// 		if (onUpdate) { onUpdate(status) }
	// 	}

	// 	return new Promise((resolve, reject) => {
	// 		this.store.api
	// 			.task(
	// 				"create user",
	// 				{
	// 					identity: identity,
	// 					passphrase: passphrase,
	// 					name: name,
	// 					bio: bio,
	// 					picture: picture,
	// 					ext: pictureExt
	// 				}
	// 			)
	// 			.subscribe(updateHandler)
	// 			.then(() => {

	// 				// Update status
	// 				delete this.tasks["register"]

	// 				// Sign-in user
	// 				return this.signIn(identity, passphrase, onUpdate)

	// 			})
	// 			.then(resolve)
	// 			.catch(reject)
	// 	})

	// }



	signIn(keyPair, passphrase, onUpdate) {

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
					"sign in",
					{
						keyPair: keyPair,
						passphrase: passphrase
					}
				)
				.subscribe(updateHandler)
				.then(result => {
					if (result.error) {
						reject(error)
					} else {
						this.clearTask("sign in")
						return this.authenticate(
							result.address,
							result.keyPair
						)
					}
				})
				.then(() => resolve(this))
				.catch(reject)
		})

	}


	// @action signIn(passphrase, onUpdate) {

	// 	// Set status
	// 	this.tasks["sign in"] = "pending"

	// 	// Build updater
	// 	let updateHandler = status => {
	// 		this.tasks["sign in"] = status
	// 		if (onUpdate) { onUpdate(status) }
	// 	}

	// 	// Sign in
	// 	return new Promise((resolve, reject) => {
	// 		this.store.api
	// 			.task("sign in", { passphrase: passphrase })
	// 			.subscribe(updateHandler)
	// 			.then(result => {
	// 				if (result.error) {
	// 					reject(error)
	// 				} else {
	// 					delete this.tasks["sign in"]
	// 					return this.authenticate(
	// 						result.address,
	// 						result.keypair
	// 					)
	// 				}
	// 			})
	// 			.then(() => resolve(this))
	// 			.catch(reject)
	// 	})

	// }

	@action authenticate(address, keypair) {
		this.address = address
		this.authenticated = true
		return Promise.all([

			// Load this user's data
			this.store.users.add(this.address).load(),

			// Subscribe for this user's feed
			this.getFeed(),

			// Update keychain
			this.store.addAccount(this.address, keypair),

			// Update auto-sign-in
			this.store.setAccount(this.address)

		])
	}



	@action signOut(onUpdate) {
		return new Promise((resolve, reject) => {
			this.store.api
				.task("sign out")
				.subscribe(onUpdate)
				.then(() => {
					this.authenticated = false
					this.address = undefined
					resolve(this)
				})
				.catch(reject)
		})
	}



	updateProfile(profile, onUpdate) {
		return new Promise((resolve, reject) => {
			this.store.api
				.task("update profile", profile)
				.subscribe(onUpdate)
				.then(resolve)
				.catch(reject)
		})
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