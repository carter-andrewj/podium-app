import { observable, computed, action } from "mobx";
import SocketIOClient from 'socket.io-client';

import Task from './task';




const url = 'http://localhost:3210';


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
			this.socket = SocketIOClient(url);

			// Wait for connection to be confirmed
			this.socket.on("connection", () => {
				this.live = true;
				this.error = undefined;
				resolve(true)
			})

		})
    }


	task(channel, args, onUpdate) {
		let t = new Task(this, channel, args, onUpdate)
		this.tasks.set(t.id, t)
		return t
	}


}