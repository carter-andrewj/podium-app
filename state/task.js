import { observable, computed, action, toJS } from "mobx";
import { v4 as uuid } from 'uuid';

import { isFunction } from '../utils/utils';



export default class Task {

	@observable id = null;
	
	@observable status = null;
	@observable history = [];
	
	@observable running = false;
	@observable complete = false;

	@observable updated = undefined;
	@observable created = undefined;

	@observable result = undefined;
	@observable error = undefined;

	handlers = [];


	constructor(api, channel, args, onUpdate) {

		// Generate Identifier
		this.id = uuid()

		// Store socket
		this.api = api

		// Create initial steps
		this.channel = channel
		this.payload = {
			task: this.id,
			args: args || {}
		}
		if (onUpdate) { this.handlers.push(onUpdate) }

		// Bind methods
		this.update = this.update.bind(this)
		this.run = this.run.bind(this)
		this.subscribe = this.subscribe.bind(this)

		// Set status
		this.update("Pending")
		this.created = this.updated

		// Listen for updates
		this.api.socket.on(this.id, this.update)

	}



	@computed get duration() {
		return (new Date()).now - this.created
	}

	@computed get pendingDuration() {
		return (new Date()).now - this.updated
	}

	@computed get progress() {
		return this.step / this.chain.length
	}




	update(message) {
		this.history.push(message)
		this.status = message.update
		this.handlers.forEach(handler => { handler(message) })
		this.updated = new Date().getTime()
	}



	run() {

		// Set progress
		this.running = true;

		// Perform task
		this.api.socket.emit(this.channel, this.payload, data => {

			// Set activity
			this.running = false;

			// Ensure data was received
			if (!data) {
				data = { error: new Error("No data received") }
			}

			// Handle errors
			if (data.error) {

				// Unpack error
				this.error = data.error

				// Set failed status
				this.update("Failed")
				this.complete = true

				// Update subscribers
				if (this.promise) {
					this.reject(this.error)
				}

			} else {

				// Unpack result
				this.result = data.result

				// Set status
				this.update("Complete")
				this.complete = true

				// Update subscribers
				if (this.promise) {
					this.resolve(this.result)
				}

			}

		})

		return this

	}


	subscribe(onUpdate) {

		// Check if task is already complete
		if (this.complete) {
			return new Promise((resolve, reject) => {
				if (this.error) {
					reject(this.error)
				} else {
					resolve(this.result)
				}
			})
		} else {

			// Set updater
			if (onUpdate) { this.handlers.push(onUpdate) }

			// Start task, if it is not already running
			if (!this.running) { this.run() }

			// Create promise object, if it does not already exist
			if (!this.promise) {
				this.promise = new Promise((resolve, reject) => {
					this.resolve = resolve
					this.reject = reject
				})
			}

			// Return the promise
			return this.promise

		}

	}


}