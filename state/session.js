import { observable, computed, action } from "mobx";

import Feed from './feed';



export default class Session {


	constructor(store) {

		// Refs
		this.store = store
		this.session = this

		// Authentication
		this.credentials = undefined
		this.authenticated = observable.box(false, { name: "authenticated?"})

		// State
		this.feed = new Feed(this)

		this.registerData = observable.map({}, { name: "registration data" })

		// Methods
		this.register = this.register.bind(this)
		this.signIn = this.signIn.bind(this)
		this.keyIn = this.keyIn.bind(this)

		this.initialize = this.initialize.bind(this)
		this.setCredentials = this.setCredentials.bind(this)

		this.signOut = this.signOut.bind(this)

	}


// GETTERS

	get nation() { return this.store.nation }

	get address() { return this.credentials.address }

	get auth() { return this.credentials.auth }

	get keyPair() { return this.credentials.keyPair }

	get passphrase() { return this.credentials.passphrase }

	@computed
	get user() {
		if (this.authenticated.get()) {
			return this.nation.get("user", this.address)
		}
	}




// AUTHENTICATION

	register(alias, passphrase) {
		return this.nation
			.task("register", { alias, passphrase }, `Registering @${alias}...`)
			.then(this.initialize)
			.then(() => true)
	}


	signIn(alias, passphrase) {
		return this.nation
			.task("signIn", { alias, passphrase }, `Signing In @${alias}...`)
			.then(this.initialize)
			.then(() => true)
	}


	keyIn(keyPair, passphrase) {
		return this.nation
			.task("keyIn", { keyPair, passphrase }, `Signing In...`)
			.then(this.initialize)
			.then(() => true)
	}


	async initialize(credentials) {

		// Set credentials
		this.setCredentials(credentials)

		// Update keychain
		this.store.addAccount(credentials)

		// Subscribe to user data
		await this.nation.get("user", this.address).whenReady()
		
		// Populate initial feed
		await this.feed.connect()

	}


	@action.bound
	setCredentials(credentials) {

		// Store credentials
		this.credentials = credentials

		// Set flag
		this.authenticated.set(true)

	}



	async signOut() {

		// Deauthenticated
		this.authenticated.set(false)

		// Sign out
		if (this.user) await this.user.signOut()

		// Set active account
		await this.store.clearAccount()

		// Reset nation
		await this.nation.reset()

		// Clear credentials
		this.credentials = undefined

	}



}