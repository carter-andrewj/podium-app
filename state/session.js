import { observable, computed, action } from "mobx";



export default class Session {

	@observable authenticated = false;

	@observable address = "";

	@observable tasks = {};

	pending = []
	@observable feed = []


	constructor(store) {

		this.store = store;

		this.register = this.register.bind(this)
		this.signIn = this.signIn.bind(this)
		this.signOut = this.signOut.bind(this)

	}



	@action register(
			identity, passphrase,
			name, bio, picture, pictureExt,
			onUpdate
		) {

		// Set Status
		this.tasks["register"] = "pending"

		// Build updater
		let updateHandler = status => {
			this.tasks["register"] = status
			if (onUpdate) { onUpdate(status) }
		}

		return new Promise((resolve, reject) => {
			this.store.api
				.task(
					"create user",
					{
						identity: identity,
						passphrase: passphrase,
						name: name,
						bio: bio,
						picture: picture,
						ext: pictureExt
					}
				)
				.subscribe(updateHandler)
				.then(() => {

					// Update status
					delete this.tasks["register"]

					// Sign-in user
					return this.signIn(identity, passphrase, onUpdate)

				})
				.then(resolve)
				.catch(reject)
		})

	}


	@action signIn(identity, passphrase, onUpdate) {

		// Set status
		this.tasks["sign in"] = "pending"

		// Build updater
		let updateHandler = status => {
			this.tasks["sign in"] = status
			if (onUpdate) { onUpdate(status) }
		}

		// Sign in
		return new Promise((resolve, reject) => {
			this.store.api
				.task(
					"sign in",
					{
						identity: identity,
						passphrase: passphrase
					}
				)
				.subscribe(updateHandler)
				.then(result => {

					// Check for errors
					if (result.error) {
						reject(error)
					} else {

						// Set authenticated flag
						this.address = result.address
						this.authenticated = true
						delete this.tasks["sign in"]

						// Load user data
						return Promise.all([

							// Load this user's data
							this.store.users.add(this.address).load(),

							// Subscribe for this user's feed
							this.feed(),

							// Update keychain
							this.store.addAccount(this.address, identity, passphrase),

							// Update auto-sign-in
							this.store.setAccount(this.address)
			
						])

					}
					
				})
				.then(() => resolve(this))
				.catch(reject)
		})

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



	feed() {
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