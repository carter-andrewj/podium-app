import { Platform } from "react-native";
import { observable, computed, action } from "mobx";
import io from 'socket.io-client';

import Task from './task';



let url;
if (Platform.OS === "android") {
	url = "http://10.0.2.2:3210"
} else {
	url = "http://localhost:3210"
}


export default class API {

	@observable socket = undefined;
	@observable live = false;
	@observable error = undefined;

	@observable tasks = new Map()


	constructor(store) {

		this.store = store

		this.connect = this.connect.bind(this)

		this.task = this.task.bind(this)

	}

	connect() {
		return new Promise((resolve, reject) => {

			// Create websocket
			this.socket = io.connect(url, { transports: ["websocket"] })

			// Wait for connection to be confirmed
			this.socket.on("connection", () => {
				this.live = true;
				this.error = undefined;
				resolve(true)
			})

			this.socket.on("connect_error", error => {
				console.error(error)
				reject(error)
			})

		})
    }


	task(channel, args, onUpdate) {
		let t = new Task(this, channel, args, onUpdate)
		this.tasks.set(t.id, t)
		return t
	}


	search(terms, onUpdate) {
		return new Promise((resolve, reject) => {
			this.task("search", terms)
				.subscribe(onUpdate)
				.then(({ results }) => resolve(results))
				.catch(reject)
		})
	}


}