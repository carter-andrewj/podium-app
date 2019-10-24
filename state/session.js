import { observable, computed, action } from "mobx";

import { getEntity } from './entities/entities';

import Feed from './feed';



export default class Session {


	constructor(store) {

		// Refs
		this.store = store
		this.nation = store.nation
		this.session = this

		// Authentication
		this.address = null
		this.auth = null
		this.keyPair = null
		this.passphrase = null
		this.authenticated = observable.box(false)

		// State
		this.alerts = observable.array()
		this.entities = observable.map()
		this.feed = new Feed(this)

		// Methods
		this.register = this.register.bind(this)
		this.signIn = this.signIn.bind(this)
		this.keyIn = this.keyIn.bind(this)

		this.authenticate = this.authenticate.bind(this)
		this.setCredentials = this.setCredentials.bind(this)

		this.signOut = this.signOut.bind(this)

		this.subscribe = this.subscribe.bind(this)
		this.makeEntity = this.makeEntity.bind(this)
		this.getEntity = this.getEntity.bind(this)

		this.search = this.search.bind(this)

	}



// AUTHENTICATION

	register(alias, passphrase) {
		this.passphrase = passphrase
		return this.nation
			.task("register", { alias, passphrase })
			.then(this.authenticate)
			.catch(console.error)

	}


	signIn(alias, passphrase) {
		this.passphrase = passphrase
		return this.nation
			.task("signIn", { alias, passphrase })
			.then(this.authenticate)
			.catch(console.error)
	}


	keyIn(keyPair, passphrase) {
		this.passphrase = passphrase
		return this.nation
			.task("keyIn", { keyPair, passphrase })
			.then(this.authenticate)
			.catch(console.error)
	}


	authenticate(credentials) {

		// Set credentials
		this.setCredentials(credentials)

		// Authenticate
		return Promise.all([

			// Subscribe to user data
			this.subscribe("user", this.address),

			// Update keychain
			this.store.addAccount(this.address, this.keyPair, this.passphrase),

		])

	}


	@action
	setCredentials({ address, auth, keyPair }) {

		// Store credentials
		this.auth = auth
		this.address = address
		this.keyPair = keyPair

		// Set flag
		this.authenticated.set(true)

	}

	signOut() {}




// ENTITIES

	@computed
	get user() {
		return this.entities.get(this.address)
	}


	subscribe(type, address) {
		return new Promise((resolve, reject) => {

			// Check if entity is already subscribed
			let current = this.entities.get(address)

			// Return cached entity, if it exists
			if (current) {
				resolve(current)
			} else {

				// Get entity type
				let entity = this.makeEntity(type, address)

				// Read and return
				entity
					.read()
					.then(resolve)
					.catch(reject)

			}

		})
	}


	@action
	makeEntity(type, address) {

		// Get entity class
		let Entity = getEntity(type)

		// Build entity
		let newEntity = new Entity(this).fromAddress(address)

		// Cache entity
		this.entities.set(address, newEntity)

		// Return entity
		return this.entities.get(address)

	}


	getEntity(address) {
		return this.entities.get(address)
	}




// DATABASE

	search(terms, among) {
		return this.nation.task("search", { terms, among })
	}








}