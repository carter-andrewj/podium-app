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
		this.live = observable.box(false)
		this.name = observable.box()
		this.error = observable.box()

		// Methods
		this.connect = this.connect.bind(this)

		// Report errors
		this.error.observe(value => console.log(`ERROR: ${value.newValue}`))

	}


	connect() {
		return new Promise((resolve, reject) => {

			// Create websocket
			this.socket = io.connect(url, { transports: ['websocket'] })

			// Wait for connection to be confirmed
			this.socket.on("connection", () => {

				// Set live flag
				this.live.set(true)

				// Clear any connection errors
				this.error.set(undefined)

				// Listen for errors
				this.socket.on("error", this.error.set)
				this.socket.on("server_error", this.error.set)

				// Set nation
				this.task("nation")
					.then(result => {
						this.name.set(result)
						resolve()
					})
					.catch(reject)

			})

			// Handle errors
			this.socket.on("connect_error", error => {

				// Set and report error
				this.error.set(error)
				console.error(error)

				// Reject
				reject(error)

			})

		})
	}


	task(channel, payload) {
		return new Promise((resolve, reject) => {

			// Generate task id
			const taskID = uuid()

			// Send to server
			this.socket.emit(channel, {
				...payload,
				task: taskID,
				nation: this.name.get()
			})

			// Await response
			this.socket.on(taskID, response => {

				// Unpack response
				const { error, result } = response

				// Handle errors
				if (error) {
					console.error(new Error(`SERVER ERROR: ${error}`))
					reject(error)
				} else {
					resolve(result)
				}

			})

		})
	}



}

