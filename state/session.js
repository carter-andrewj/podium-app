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
		this.credentials = undefined
		this.authenticated = observable.box(false, { name: "authenticated?"})

		// State
		this.alerts = observable.array([], { name: "alerts" })
		this.entities = observable.map({}, { name: "entities" })
		this.feed = new Feed(this)

		this.registerData = observable.map({}, { name: "registration data" })

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


// GETTERS

	get address() { return this.credentials.address }

	get auth() { return this.credentials.auth }

	get keyPair() { return this.credentials.keyPair }

	get passphrase() { return this.credentials.passphrase }

	@computed
	get user() {
		return this.entities.get(this.address)
	}




// AUTHENTICATION

	register(alias, passphrase) {
		return this.nation
			.task("register", { alias, passphrase }, `Registering @${alias}...`)
			.then(this.authenticate)
			.then(() => true)
	}


	signIn(alias, passphrase) {
		return this.nation
			.task("signIn", { alias, passphrase }, `Signing In @${alias}...`)
			.then(this.authenticate)
			.then(() => true)
	}


	keyIn(keyPair, passphrase) {
		return this.nation
			.task("keyIn", { keyPair, passphrase }, `Signing In...`)
			.then(this.authenticate)
			.then(() => true)
	}


	authenticate(credentials) {

		// Set credentials
		this.setCredentials(credentials)

		// Authenticate
		return Promise.all([

			// Subscribe to user data
			this.subscribe("user", this.address),

			// Update keychain
			this.store.addAccount(credentials),

		])

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

		// Unsubscribe all entities
		await Promise.all(this.entities.values(e => e.unsync()))

		// Sign out
		await this.user.signOut()

		// Remove all entities
		this.entities.clear()

		// Clear credentials
		this.credentials = undefined

	}




// ENTITIES

	async subscribe(type, address) {

		// Check if entity is already subscribed
		let current = this.entities.get(address)

		// Return cached entity, if it exists
		if (current) return current

		// Get entity type
		let entity = this.makeEntity(type, address)

		// Read and return
		await entity.sync()

		// Return entity
		return entity

	}


	@action.bound
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

	find(term, among) {
		return this.nation.task("find", { term, among })
	}








}