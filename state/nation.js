import { Platform } from "react-native";
import { observable, computed, action } from "mobx";
import io from 'socket.io-client';

import { v4 as uuid } from 'uuid';

import settings from '../settings';




let url;
if (!settings.server.local) {
	url = settings.server.url
} else if (Platform.OS === "android") {
	url = "http://10.0.2.2:3000"
} else {
	url = "http://localhost:3000"
}



export default class Nation {

	constructor(store) {

		// Refs
		this.store = store

		// State
		this.socket = null
		this.tasks = observable.map({}, { name: "tasks" })
		this.name = observable.box(undefined, { name: "nation" })
		this.error = observable.box(undefined, { name: "error" })

		// Methods
		this.connect = this.connect.bind(this)
		this.disconnect = this.disconnect.bind(this)

		this.task = this.task.bind(this)

		this.getNation = this.getNation.bind(this)

	}


	@computed
	get live() {
		return this.name.get() ? true : false
	}


	@action.bound
	fail(callback) {
		return error => {

			// Log error
			this.error.set(error)

			// Pass error to callback, if required
			if (callback) {
				callback(error)
			} else {
				throw error
			}

		}
	}




// CONNECTION

	async connect() {
		return new Promise((resolve, reject) => {

			// Create websocket
			this.socket = io.connect(url, { transports: ['websocket'] })

			// Handle errors
			this.socket.on("error", this.fail)
			this.socket.on("server_error", this.fail)
			
			// Wait for connection to be confirmed or fail
			this.socket.on("connection", () => !this.name.get() ? this.getNation() : null)
			this.socket.on("connect_error", this.fail)

			// Report errors
			this.reporter = this.error.observe(value => value.newValue ?
				console.error(`ERROR: ${value.newValue}`)
				: null
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

	async disconnect() {
		return new Promise((resolve, reject) => {

			// Stop reporting errors
			this.reporter()

			// Resolve
			resolve()

		})
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
	setNation(nation) {
		this.name.set(nation)
		this.error.set(undefined)
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
		this.socket.removeListener(id, this.tasks.get(id).handler)

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
				await new Promise(resolve => setTimeout(resolve, 1000))

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
			this.socket.on(taskID, handler)

			// Send to server
			this.socket.emit(channel, {
				...payload,
				task: taskID,
				nation: this.name.get()
			})

		})
	}



}

