import { observable, action } from 'mobx';

import { Map } from 'immutable';




class Entity {


	constructor(parent) {

		// Store references to parent and session
		this.parent = parent
		this.nation = parent.nation
		this.session = parent.session
		this.client = parent.nation.socket

		// State
		this.type = null					// NOTE: Child entities should set this to their server equivalent
		this.state = null					// NOTE: Child entities should set this to an observable type
		this.address = null
		this.complete = observable.box(false)
		this.latest = observable.box(null)
		this.history = observable.map()
		this.attributes = observable.map()

		// Sync
		this.syncing = observable.box(false)
		this.received = null

		// Methods
		this.fromAddress = this.fromAddress.bind(this)

		this.read = this.read.bind(this)
		this.sync = this.sync.bind(this)

		this.receive = this.receive.bind(this)
		this.setData = this.setData.bind(this)
		this.setAttribute = this.setAttribute.bind(this)
		this.setComplete = this.setComplete.bind(this)

		this.act = this.act.bind(this)

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

	read() {
		return new Promise((resolve, reject) => {

			// Listen for data
			this.client.on(this.address, this.receive)

			// Listen for completion
			this.complete
				.observe(change => change.newValue ? resolve() : null)

			// Request entity data from server
			this.nation
				.task("get", {
					type: this.type,
					address: this.address
				})
				.then(this.sync)
				.catch(reject)

		})
	}


	sync() {
		this.client.emit(this.address, { type: "sync" })
	}





// UPDATE

	receive(data) {

		// Update entity if data is new
		if (!this.latest.get() || data.timestamp > this.latest.get()) {

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

					// Set flag
					this.syncing.set(true)

					// Update state
					this.setData(data)

					// Update attributes
					return Promise.all(Map(data.attributes)
						.filter((_, id) => !this.attributes.has(id))
						.map(({ type, address }, id) => {

							// Cache attribute
							this.setAttribute(id, address)

							// Subscribe to attribute
							return this.session.subscribe(type, address)

						})
						.valueSeq()
					)

				})
				.then(() => {

					// Set complete flag
					this.setComplete(data.complete)

					// Clear syncing flag
					this.syncing.set(false)

				})
				.catch(console.error)

			// Save promise
			this.receiver = next

		}

	}


	@action
	setData({ timestamp, history, state, complete }) {

		// Update timestamp
		this.latest.set(timestamp)

		// Update history
		this.history.replace(history)

		// Update state
		this.state.replace(state)

	}


	@action
	setAttribute(id, entity) {

		// Store new entity
		this.attributes.set(id, entity)

	}


	@action
	setComplete(complete) {
		this.complete.set(complete)
	}



// ACT

	act(action, ...args) {
		return new Promise((resolve, reject) => {
			this.nation
				.task(this.address, {
					type: "write",
					action: action,
					args: args,
					auth: this.session.auth
				})
				.then(resolve)
				.catch(reject)
		})
	}





}


export default Entity;