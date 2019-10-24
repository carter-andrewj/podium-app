import { Platform } from "react-native";
import { observable, computed, action, toJS } from "mobx";
import { Permissions } from 'expo';
import * as SecureStore from 'expo-secure-store';
import * as Font from 'expo-font';

import Nation from './nation';
import Session from './session';


export default class Store {


	@observable load = {
		fonts: false,
		nation: false,
		accounts: false
	}

	@observable error = null;

	@observable accounts = {};

	@observable config = {

		media: {
			source: "https://media.podium-network.com"
		},

		records: {
			reload: 1000 * 10,
			lifetime: 1000 * 60
		},

		validation: {
			delay: 1000,
			alias: {
				minLength: 1,
				maxLength: 20,
				chars: /[^A-Z0-9_-]/i
			},
			passphrase: {
				minLength: 7,
				maxLength: 36
			},
			name: {
				maxLength: 50
			},
			bio: {
				maxLength: 250
			}
		},

		postCosts: {
			perCharacter: 1,
			tag: 10,
			url: 10
		}

	}

	@observable permissions = {
		camera: false
	}


	constructor() {

		this.nation = new Nation(this)
		this.session = new Session(this)

		this.loadNation = this.loadNation.bind(this)

		this.loadFonts = this.loadFonts.bind(this)

		this.loadAccounts = this.loadAccounts.bind(this)
		this.addAccount = this.addAccount.bind(this)
		this.setAccount = this.setAccount.bind(this)

		this.permitCamera = this.permitCamera.bind(this)

	}




// LOADING

	@computed get loaded() {
		return this.load.fonts
			&& this.load.nation
			&& this.load.accounts
	}




// LEDGER

	loadNation() {
		if (this.load.nation) {
			return new Promise(resolve => resolve())
		} else {
			return new Promise((resolve, reject) => {
				this.nation.connect()
					.then(() => {
						this.load.nation = true
						resolve()
					})
					.catch(error => {
						this.error = error
						reject()
					})
			})
		}
	}




// FONTS

	loadFonts() {
		if (this.load.fonts) {
			return new Promise(resolve => resolve())
		} else {
			return new Promise((resolve, reject) => {
				Font.loadAsync({
					Varela: require('../assets/fonts/Varela-Regular.ttf'),
					VarelaRound: require('../assets/fonts/VarelaRound-Regular.ttf'),
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





// ACCOUNTS

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
						reject(error)
					})

			})
		}
	}


	addAccount(address, keyPair, passphrase) {
		return new Promise((resolve, reject) => {
			this.accounts[address] = {
				keyPair: keyPair,
				passphrase: passphrase,
				nation: this.nation.name
			}
			SecureStore
				.setItemAsync("accounts", JSON.stringify(toJS(this.accounts)))
				.then(() => this.setAccount(address))
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





// PERMISSIONS

	permitCamera() {
		return new Promise((resolve, reject) => {
			if (Platform.OS === "ios") {
				Permissions
					.askAsync(Permissions.CAMERA_ROLL)
					.then(({ status }) => {
						this.permissions.camera = (status === "granted")
						resolve(this.permissions.camera)
					})
					.catch(reject)
			}
		})
	}



}