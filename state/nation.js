import { Platform } from "react-native";
import { observable, computed, action } from "mobx";
import io from 'socket.io-client';

import { v4 as uuid } from 'uuid';

import { getEntity } from './entities/entities';








export default class Nation {

	constructor(store) {

		// Refs
		this.store = store
		this.nation = this

		// State
		this.client = null
		this.tasks = observable.map({}, { name: "tasks" })

		this.name = observable.box(undefined, { name: "nation" })
		this.founderAddress = observable.box(undefined, { name: "founder address" })
		this.domainAddress = observable.box(undefined, { name: "domain address" })

		this.mediaURL = observable.box(undefined, { name: "mediaURL" })

		this.error = observable.box(undefined, { name: "error" })

		this.entities = observable.map({}, { name: "entities" })
		this.alerts = observable.map({}, { name: "alerts" })

		// Methods
		this.connect = this.connect.bind(this)
		this.reset = this.reset.bind(this)

		this.task = this.task.bind(this)

		this.getNation = this.getNation.bind(this)

		this.seenAlerts = this.seenAlerts.bind(this)

		this.search = this.search.bind(this)
		this.find = this.find.bind(this)

		this.get = this.get.bind(this)

	}




	get url() {
		if (this.store.config.api) {
			return this.store.config.api
		} else if (Platform.OS === "android") {
			return "http://10.0.2.2:3000"
		} else {
			return "http://localhost:3000"
		}
	}




	get session() {
		return this.store.session
	}

	@computed
	get live() {
		return this.name.get() ? true : false
	}

	@computed
	get founder() {
		if (this.founderAddress.get())
			return this.get("user", this.founderAddress.get())
	}

	@computed
	get domain() {
		if (this.domainAddress.get())
			return this.get("domain", this.domainAddress.get())
	}

	@computed
	get activeUser() {
		return this.session.user
	}


	@action.bound
	fail(callback) {
		return error => {

			// Log error
			this.error.set(error)

			// Pass error to callback, if required
			if (callback) {
				callback(error)
			}

			console.error(error)

			return false

		}
	}




// CONNECTION

	connect() {
		return new Promise((resolve, reject) => {

			// Create websocket
			this.client = io.connect(this.url, { transports: ['websocket'] })

			// Handle errors
			this.client.on("error", this.fail)
			this.client.on("server_error", this.fail)

			// Handle alerts
			this.client.on("alert", this.addAlert)
			
			// Wait for connection to be confirmed or fail
			this.client.on("connection", () => !this.name.get() ? this.getNation() : null)
			this.client.on("connect_error", this.fail)

			// Auto-load founder and domain
			this.loadFounder = this.founderAddress.observe(
				({ newValue }) => this.get("user", newValue)
			)
			this.loadDomain = this.domainAddress.observe(
				({ newValue }) => this.get("domain", newValue)
			)

			// Listen for completion
			let successListener
			let errorListener
			successListener = this.name.observe(value => {
				if (value.newValue) {
					errorListener()
					successListener()
					resolve(true)
				}
			})
			errorListener = this.error.observe(error => {
				if (error.newValue) {
					successListener()
					errorListener()
					reject(error.newValue)
				}
			})

		})
	}


	async reset() {

		// Unsubscribe all entities
		await Promise.all(this.entities.values(e => e.unsync()))

		// Reset entity object
		this.entities.clear()

		// Return
		return this

	}



// SETUP

	async getNation() {

		// Prevent the nation being requested twice
		if (this.nationTask) {

			// Wait for nation task
			await this.nationTask

		} else {

			// Create nation task
			this.nationTask = this.task("nation")
				.then(this.setNation)
				.catch(this.fail)

			// Wait for nation task to complete
			await this.nationTask

			// Dispose of nation task
			this.nationTask = undefined

		}

		// Return nation name
		return this.name.get()

	}

	@action.bound
	setNation({ name, domain, founder, media }) {

		// Set nation name
		this.name.set(name)

		// Set founder data
		this.founderAddress.set(founder)

		// Set domain data
		this.domainAddress.set(domain)

		// Set media url
		this.mediaURL.set(media)

		// Clear any errors
		this.error.set(undefined)

	}






// ALERTS

	@action.bound
	addAlert(alert) {
		console.log("adding alert", alert)
		this.alerts.set(alert.key, alert)
	}

	seenAlerts(...keys) {
		return this.task("seen", ...keys)
	}





// TASKS

	@action.bound
	setTask(id, state) {

		// Create task
		let task = observable.map(
			{
				...state,
				subscribers: 1,
				complete: false
			},
			{ deep: false }
		)

		// Store task
		this.tasks.set(id, task)

		// Return task
		return task

	}


	@action.bound
	updateTask(id, update) {
		this.tasks.get(id).merge(update)
	}


	@action.bound
	reserveTask(id) {
		let subscribers = this.tasks.get(id).get("subscribers")
		this.tasks.get(id).set("subscribers", subscribers + 1)
	}


	@action.bound
	releaseTask(id) {

		// Check if this is the last subscriber
		let subscribers = this.tasks.get(id).get("subscribers")
		if (subscribers <= 1) {

			// Delete task
			this.tasks.delete(id)

		// Otherwise 
		} else {

			// Decrement subscribers
			this.tasks.get(id).set("subscribers", subscribers - 1)

		}

	}


	@action.bound
	completeTask(id) {

		// Close socket
		this.client.removeListener(id, this.tasks.get(id).handler)

		// Flag task as complete
		this.tasks.get(id).set("complete", true)

		// Release task from main controller
		this.releaseTask(id)

	}


	task(channel, payload, label) {
		return new Promise((resolve, reject) => {

			// Generate task ID
			let taskID = uuid()

			// Create handler
			let handler = async update => {

				// ARTIFICIAL DELAY TO SIMULATE SERVER RESPONSE TIME
				// IN DEVELOPMENT - REMOVE BEFORE SHIPPING
				//await new Promise(resolve => setTimeout(resolve, 1000))

				this.updateTask(taskID, update)

			}

			// Define task
			let task = this.setTask(taskID, {
				label,
				channel,
				handler,
				payload,
				status: undefined
			})

			// Listen for success, failure
			let listener = task.observe(({ name, newValue }) => {

				// Reject on error
				if (name === "error") {
					listener()
					this.releaseTask(taskID)
					reject(newValue)
				}

				// Resolve on success
				if (name === "result") {
					listener()
					this.completeTask(taskID)
					resolve(newValue)
				}

			})

			// Prepare for response
			this.client.on(taskID, handler)

			// Send to server
			this.client.emit(channel, {
				...payload,
				task: taskID,
				nation: this.name.get()
			})

		})
	}




// DATABASE

	search(terms, among) {
		return this.task("search", { terms, among })
	}

	find(term, among) {
		return this.task("find", { term, among })
	}





// ENTITIES

	get(type, address) {

		// Check if entity is already subscribed
		let current = this.entities.get(address)

		// Return cached entity, if it exists
		if (current) return current

		// Get entity class
		let Entity = getEntity(type)

		// Build entity
		let newEntity = new Entity(this).fromAddress(address)

		// Start reading
		newEntity.sync()

		// Save entity
		this.cacheEntity(newEntity)

		// Return entity
		return newEntity

	}


	@action.bound
	cacheEntity(entity) {
		this.entities.set(entity.address, entity)
	}


}

