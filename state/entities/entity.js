import { observable, action, computed, when } from 'mobx';

import { Map } from 'immutable';

import { placeholder } from './utils';




class Entity {

	constructor(nation) {

		// Store references to parent and session
		this.nation = nation

		// State
		this.isEntity = true
		this.type = null					// NOTE: Child entities should set this to their server equivalent
		this.state = observable.map()		// NOTE: Child entities should set this to an observable type
		this.address = null
		this.loader = undefined

		this.latest = observable.box(null)		// Last time data was received
		this.updated = observable.box(null)		// Last time entity was written
		this.created = observable.box(null)		// First time entity was written

		this.parentage = observable.map()
		this.history = observable.map()
		this.attributes = observable.map({}, { deep: false })
		this.wallet = observable.map({}, { deep: false })
		this.meta = observable.map({}, { deep: false })

		// Sync
		this.syncing = observable.box(false)	// True when new data is being processed
		this.received = null
		this.isSynced = observable.box(false)	// True when the entity is up to date
		this.hasSynced = observable.box(false)	// True when the entity has synced at least once

		// Methods
		this.fromAddress = this.fromAddress.bind(this)

		this.sync = this.sync.bind(this)
		this.unsync = this.unsync.bind(this)

		this.whenReady = this.whenReady.bind(this)

		this.receive = this.receive.bind(this)

		this.act = this.act.bind(this)

	}


	@computed
	get parent() {
		let address = this.parentage.get("address")
		if (!address) return undefined
		return this.nation.get(this.parentage.get("type"), address)
	}

	get session() {
		return this.nation.session
	}

	get client() {
		return this.nation.client
	}

	get activeUser() {
		return this.session.user
	}




// GETTERS

	@computed
	get ready() {
		return this.hasSynced.get()
	}





// SETUP

	fromAddress(address) {

		// Store address
		this.address = address

		// Return entity
		return this

	}


	get label() {
		return `${this.type}:${this.address}`
	}



// READ

	sync() {
		return new Promise((resolve, reject) => {

			// Ignore for dummy entities
			if (!this.address) resolve()

			// Listen for data
			this.client.on(this.address, this.receive)

			// Listen for completion
			this.completer = when(() => this.ready, resolve)

			// Request entity data from server
			this.nation
				.task("get", {
					type: this.type,
					address: this.address
				})
				.then(() => this.client
					.emit(this.address, { type: "sync" })
				)
				.catch(error => {
					throw `SERVER ERROR: ${error}`
					reject(error)
				})

		})
	}

	unsync() {

		// Tell server to stop syncing
		this.client.emit(this.address, { type: "unsync" })

		// Dispose completion listener, if still active
		if (this.completer) this.completer()

		// Remove listener
		this.client.removeListener(this.address, this.receive)

	}


	@action.bound
	setSynced() {
		if (!this.hasSynced.get()) this.hasSynced.set(true)
		this.isSynced.set(true)
	}


	@action.bound
	clearSynced() {
		this.isSynced.set(false)
	}


	async whenReady(callback) {

		// Wait for entity to be ready
		await when(() => this.ready)

		// Run and return callback if provided
		if (callback) {
			return callback(this)
		} else {
			return this
		}

	}




// UPDATE

	receive(data) {

		// Update entity if data is new
		if (!this.latest.get() || data.timestamp > this.latest.get()) {

			// Clear synced flag
			this.clearSynced()

			// Check if entity is already syncing
			let last
			if (this.receiver) {
				last = this.receiver
			} else {
				last = new Promise.resolve()
			}

			// Add to promise
			let next = last
				.then(() => {

					// Update state
					this.setData(data)

					// Update attributes
					return Promise.all(Map(data.attributes)
						.filter((_, id) => !this.attributes.has(id))
						.map(async ({ type, address }, id) => {

							// Cache attribute
							this.setAttribute(id, address)

							// Subscribe to attribute
							let attribute = this.nation.get(type, address)

							// Return
							return when(() => attribute.ready)

						})
						.toList()
						.toJS()
					)

				})
				.then(this.setSynced)
				.catch(console.error)

			// Save promise
			this.receiver = next

		}

	}


	@action.bound
	setData({ timestamp, history, state, wallet, meta, parent, created, updated }) {

		// Update timestamp
		this.latest.set(timestamp)
		if (this.updated.get() !== updated) this.updated.set(updated)
		if (!this.created.get()) this.created.set(created)

		// Update parent
		if (this.parentage.get("address") !== parent.address) {
			this.parentage.set("address", parent.address)
			this.parentage.set("type", parent.type)
		}

		// Update wallet
		if (wallet) this.wallet.replace(wallet)

		// Update metadata
		if (meta) this.meta.replace(meta)

		// Update history
		this.history.replace(history)

		// Update state
		this.setState(state)

	}


	@action.bound
	setState(state) {
		this.state.merge(state)
	}


	@action.bound
	setAttribute(id, entity) {
		this.attributes.set(id, entity)
	}






// ACT

	get asObject() {
		return {
			isEntity: true,
			type: this.type,
			address: this.address
		}
	}


	act(action, label, ...args) {
		return new Promise((resolve, reject) => {

			// Handle entity arguments
			let inputs = args.map(a => (a && a.isEntity) ? a.asObject : a)

			// Send task
			this.nation
				.task(
					this.address,
					{
						type: "write",
						action: action,
						args: inputs,
						auth: this.session.auth
					},
					label
				)
				.then(resolve)
				.catch(reject)

		})
	}





// LISTENERS

	intercept(callback) {
		return this.state.intercept(callback)
	}

	observe(callback) {
		return this.state.observe(callback)
	}




}


export default Entity;