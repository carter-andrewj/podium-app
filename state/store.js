import { Platform } from "react-native";
import { configure, observable, computed, action, toJS } from "mobx";
import { Permissions } from 'expo';
import * as SecureStore from 'expo-secure-store';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

import config from './config';

import Nation from './nation';
import Session from './session';



// Configure MobX
configure({ enforceActions: config.enforceActions })




export default class Store {


	constructor() {

		// Observables
		this.load = observable.map(
			{
				fonts: false,
				media: false,
				account: false,
				nation: false
			},
			{ name: "loader"}
		)

		this.permissions = observable.map(
			{
				camera: false
			},
			{ name: "permissions" }
		)

		// State
		this.account = undefined
		this.nation = new Nation(this)
		this.session = new Session(this)
		this.config = config

		// Methods
		this.loadNation = this.loadNation.bind(this)

		this.loadFonts = this.loadFonts.bind(this)

		this.loadAccount = this.loadAccount.bind(this)
		this.addAccount = this.addAccount.bind(this)
		this.setAccount = this.setAccount.bind(this)

		this.permitCamera = this.permitCamera.bind(this)

	}




// LOADING

	@computed
	get loaded() {
		return this.load.get("fonts")
			&& this.load.get("media")
			&& this.load.get("nation")
			&& this.load.get("account")
	}




// LEDGER

	async loadNation() {

		// Ignore if already loaded
		if (this.load.get("nation")) return true

		// Connect to nation
		await this.nation.connect()
		
		// Set loaded flag
		this.load.set("nation", true)

		// Return
		return true

	}




// ASSETS

	async loadMedia() {

		// Ignore if already loaded
		if (this.load.get("media")) return true

		// Load media
		await Promise.all(this.config.media.preload
			.map(file => require("../assets/icon.png"))
			.map(media => Asset.fromModule(media).downloadAsync())
		)

		// Set loaded flag
		this.load.set("media", true)

		// Return
		return true

	}

	async loadFonts() {

		// Ignore if already loaded
		if (this.load.get("fonts")) return true

		// Load fonts
		await Font.loadAsync({
			Varela: require('../assets/fonts/Varela-Regular.ttf'),
			VarelaRound: require('../assets/fonts/VarelaRound-Regular.ttf'),
		})

		// Set loaded flag
		this.load.set("fonts", true)

		// Return
		return true

	}





// ACCOUNTS

	async loadAccount() {

		// Retreive account
		let account = await this.getAccount()

		// Set account and loaded flag
		this.load.set("account", true)

		// Return the account
		return account

	}


	async getAccount() {

		// Ignore if already loaded
		if (this.load.get("account")) return this.account

		// Get last active account
		let active = await SecureStore.getItemAsync("active")

		// Ignore if no account was active
		if (!active) return false

		// Load last active account
		return await SecureStore
			.getItemAsync(active)
			.then(item => item ? JSON.parse(item) : undefined)

	}


	async addAccount({ address, keyPair, passphrase }) {

		// Create account payload
		let account = JSON.stringify({
			keyPair: keyPair,
			passphrase: passphrase,
			nation: this.nation.name
		})

		// Store account
		await SecureStore.setItemAsync(address, account)

		// Set active account
		await this.setAccount(address)

	}


	async setAccount(address) {
		return await SecureStore.setItemAsync("active", address)
	}





// PERMISSIONS

	async permitCamera() {

		// Check if camera is already permitted
		if (this.permissions.get("camera")) return true

		let granted = false

		// Handle iOS
		if (Platform.OS === "ios") {

			// Request permissions
			let { status } = await Permissions
				.askAsync(Permissions.CAMERA_ROLL)

			if (status === "granted") granted = true

		// Handle Android
		} else if (Platform.OS === "android") {

			// Request permissions
			//TODO
			granted = true

		}

		// Set status
		this.permissions.set("camera", granted)

		// Return permissions
		return this.permissions.get("camera")

	}



}