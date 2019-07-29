import { observable, computed, action } from "mobx";
import * as SecureStore from 'expo-secure-store';
import * as Font from 'expo-font';

import API from './api';
import UserStore from './userStore';
import Session from './session'


export default class Store {


	@observable load = {
		fonts: false,
		ledger: false,
		accounts: false
	}

	@observable error = null;

	@observable accounts = {};

	@observable config = {
		records: {
			reload: 1000 * 10,
			lifetime: 1000 * 60
		}
	}


	constructor() {

		this.api = new API(this)
		this.users = new UserStore(this)
		this.session = new Session(this)

		this.loadLedger = this.loadLedger.bind(this)

		this.loadFonts = this.loadFonts.bind(this)

		this.loadAccounts = this.loadAccounts.bind(this)
		this.addAccount = this.addAccount.bind(this)
		this.setAccount = this.setAccount.bind(this)

	}



	loadLedger() {
		if (this.load.ledger) {
			return true
		} else {
			return new Promise((resolve, reject) => {
				this.api.connect()
					.then(() => {
						this.load.ledger = true
						resolve()
					})
					.catch(error => {
						this.error = error
						reject()
					})
			})
		}
	}



	loadFonts() {
		if (this.load.fonts) {
			return true
		} else {
			return new Promise((resolve, reject) => {
				Font.loadAsync({
					"Varela": require('../assets/fonts/Varela-Regular.ttf'),
					"Varela Round": require('../assets/fonts/VarelaRound-Regular.ttf'),
				})
				.then(() => {
					this.load.fonts = true
					resolve(true)
				})
				.catch(error => {
					this.error = error
					reject()
				})
			})
		}
	}




	loadAccounts() {
		if (this.load.accounts) {
			return true
		} else {
			return new Promise((resolve, reject) => {

				// Wait for retrieval
				Promise
					.all([
						SecureStore.getItemAsync("active"),
						SecureStore.getItemAsync("accounts")
					])
					.then(([last, accounts]) => {

						// Set loaded flag
						this.load.accounts = true

						// Unpack accounts
						if (accounts) {
							this.accounts = JSON.parse(accounts);
						}

						// Return most recent account
						if (last) {
							resolve({
								address: last,
								...this.accounts[last]
							})
						} else {
							resolve(false)
						}

					})
					.catch(error => {
						this.error = error
						reject()
					})

			})
		}
	}


	addAccount(address, identity, passphrase) {
		return new Promise((resolve, reject) => {
			this.accounts[address] = {
				identity: identity,
				passphrase: passphrase
			}
			SecureStore
				.setItemAsync("accounts", JSON.stringify(this.accounts))
				.then(resolve)
				.catch(error => {
					this.error = error
					reject()
				})
		})
	}


	setAccount(address) {
		return new Promise((resolve, reject) => {
			SecureStore
				.setItemAsync("active", address)
				.then(resolve)
				.catch(error => {
					this.error = error
					reject()
				})
		})
	}





	@computed get loaded() {
		return this.load.fonts
			&& this.load.ledger
			&& this.load.accounts
	}

}