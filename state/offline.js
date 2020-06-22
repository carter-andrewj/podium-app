import { Map, fromJS } from 'immutable';
import { v4 as uuid } from 'uuid';


export default class OfflineSocket {

	constructor() {

		// Listeners
		this.listeners = Map({})

		// Default settings
		this.settings = fromJS({

			constitution: {


				designation: {
					name: "Podium",
					family: "Offline",
					tags: [],
				},


				founder: {
					alias: "podium",
					profile: {
						name: "Podium",
						about: "",
						avatar: "",
					},
					post: {
						text: "This was the first post ever made on Podium."
					},
				},


				domain: {

					alias: "/",

					profile: {
						name: "",
						about: ""
					},

					tokens: {},

					articles: {},

				},


			},

			delay: {
				min: 100,
				range: 100,
			},

		})

		// Database
		this.founder = undefined
		this.domain = undefined
		this.data = Map({
			active: undefined,
			users: Map({}),
			domains: Map({}),
			posts: Map({}),
		})
		this.updaters = Map({})

		// Connection status
		this.connected = false
		this.connecting = undefined

		// Methods
		this.connect = this.connect.bind(this)
		this.assertConnected = this.assertConnected.bind(this)
		this.disconnect = this.disconnect.bind(this)

		this.on = this.on.bind(this)
		this.removeListener = this.removeListener.bind(this)
		this.emit = this.emit.bind(this)
		this.getMethod = this.getMethod.bind(this)

		this.getNation = this.getNation.bind(this)
		this.get = this.get.bind(this)
		this.getType = this.getType.bind(this)
		this.sync = this.sync.bind(this)
		this.find = this.find.bind(this)
		this.findAmong = this.findAmong.bind(this)
		this.findUser = this.findUser.bind(this)
		this.addUser = this.addUser.bind(this)
		this.addDomain = this.addDomain.bind(this)
		this.signIn = this.signIn.bind(this)
		this.keyIn = this.keyIn.bind(this)

	}



// CONNECTION

	async connect(settings) {

		// Merge new settings, if required
		if (settings) this.settings = this.settings.merge(Map(settings))

		// Pause for connection delay
		this.connecting = new Promise(r => setTimeout(r, this.delay))
		await this.connecting
		this.connected = true

		// Initialize nation
		this.founder = this.addUser({
			alias: this.settings.getIn(["nation", "founder"])
		})
		this.domain = this.addDomain({
			id: this.settings.getIn(["nation", "domain"]),
			founder: this.founder
		})

		// Trigger connection
		let callback = this.listeners.get("connection")
		if (callback) callback()

		// Return
		return this

	}


	async assertConnected() {

		// Throw error if connection has not been started
		if (!this.connected && this.connecting === undefined)
			throw Error("Server not Connected")

		// Wait for connection to complete
		await this.connecting

		// Return
		return true

	}


	async disconnect() {

		// Ignore if not connected
		if (!this.connected) return true

		// Clear connection
		this.connected = false

		// Return
		return true

	}




// MIRRORS

	async on(key, callback) {

		// Build callback handler
		let handler = async message => {

			// Wait for artificial delay
			await new Promise(r => setTimeout(r, this.delay))
				.catch(this.error)

			// Run callback and return
			return callback(message)

		}

		// Save callback
		this.listeners = this.listeners.set(key, handler)

		// Return "server"
		return this

	}

	async removeListener(key) {

		// Delete listener with the provided key
		this.listeners = this.listeners.delete(key)

		// Return "server"
		return this

	}

	async emit(key, { task, ...payload }) {

		// Reject if not connected
		await this.assertConnected()

		console.log("emit", key, payload)

		// Handle payload
		let method = this.getMethod(key)
		if (method) method(payload, this.listeners.get(task))

	}


	getMethod(key) {
		switch (key.toLowerCase()) {
			case "nation": return this.getNation
			case "find": return this.find
			case "get": return this.get
			case "sync": return this.sync
			case "register": return this.addUser
			case "signin": return this.signIn
			case "keyin": return this.keyIn
			default: null
		}
	}




// UTILITIES

	get delay() {
		return this.settings.getIn(["delay", "min"]) +
			(Math.random() * this.settings.getIn(["delay", "range"]))
	}

	get nation() {
		let designation = this.settings.getIn(["constitution", "designation"]).toJS()
		let name = [designation.name, designation.family, ...designation.tags]
		return {
			name: name.join("|"),
			founder: this.founder,
			domain: this.domain,
			media: "local"
		}
	}

	get users() {
		return this.data
			.get("users")
			.reduce(
				(result, data, address) => result.set(
					data.get("alias").toLowerCase(),
					data.set("address", address)
				),
				Map()
			)
	}





// FUNCTIONALITY

	getNation(_, channel) {
		channel({ result: this.nation })
	}


	find({ among, term }, channel) {

		// Determine search subjects
		let method = this.findAmong(among)
		let result = method(term.toLowerCase())
		
		// Find term
		channel({
			result: result ? result.get("address") : undefined
		})

	}

	findAmong(among) {
		switch (among) {
			case "users": return this.findUser
			default: return this.findUser
		}
	}


	findUser(alias) {
		return this.users.get(alias)
	}



	get({ type, address }, channel) {
		let key = this.getType(type)
		if (key) channel({ result: this.data.getIn([ key, address ]) })
	}


	getType(type) {
		switch (type) {
			case "User": return "users"
			case "Domain": return "domains"
			default: return undefined
		}
	}


	sync({ address }, channel) {
		this.updaters = this.updaters.set(address, channel)
	}


	addUser({ alias, passphrase }, channel) {

		// Generate user address and fake-keypair
		let address = uuid()
		let keyPair = uuid()

		// Store user data
		this.data = this.data.setIn(["users", address], Map({
			alias,
			passphrase,
			keyPair,
			created: new Date().getTime(),
		}))
		this.data.set("active", address)

		// Return result
		if (channel) channel({
			result: {
				address,
				passphrase,
				keyPair
			}
		})
		return address

	}


	addDomain({ id, founder }, channel) {

		// Generate domain address
		let address = uuid()

		// Store domain data
		this.data = this.data.setIn(["domains", address], Map({
			id: id,
			founder: founder,
			created: new Date().getTime(),
		}))

		// Return
		if (channel) channel({ result: address })
		return address

	}



	signIn(payload, channel) {
		console.log("sign", payload)
	}

	keyIn(payload, channel) {
		console.log("keyin", payload)
	}



}