import { computed, observable, action, decorate } from "mobx";



export default class Loadable {

	@observable next = null;
	@observable error = null;
	@observable value = null;
	@observable ready = false;
	@observable progress = null;
	@observable step = null;

	constructor(context) {

		this.lifetime = context.store.config.records.reload
		this.next = new Date().now - this.lifetime

		this.load = this.load.bind(this)
		this.set = this.set.bind(this)
		this.update = this.update.bind(this)

		this.fetch = this.fetch.bind(context)

		this.surface = this.surface.bind(this)

	}

	fetch() {
		return new Promise(resolve => resolve(this))
	}

	update(msg) {
		this.progress = msg
		this.step = this.step + 1
	}

	load() {

		// Check if promotions were already loaded recently
		// and do nothing if so
		if (this.next > new Date().now) {
			return new Promise(resolve => resolve(this))
		}

		// Check if promotions are already loading and,
		// if not, load them
		if (!this.loader) {
			this.progress = "pending"
			this.step = 0
			this.loader = new Promise((resolve, reject) => {
				this.fetch(this.update)
					.then(this.set)
					.then(result => {
						this.ready = true
						this.loader = null
						this.error = null
						this.progress = null
						this.step = null
						this.next = new Date().now + this.lifetime
						resolve(result)
					})
					.catch(error => {
						this.loader = null
						this.error = error
						this.progress = "failed"
						reject(error)
					})
			})
		}

		// Return the loader promise
		return this.loader

	}

	@action set(value) {
		this.value = value
		return this
	}

	surface(...args) {

		args.forEach(a => {
			
			// Define getter
			Object.defineProperty(this, a, {
				get: function() {
					return this.value ? this.value[a] : null
				}
			})

			// Make getter a MobX computed property
			decorate(this, { a: computed })

		})

		return this

	}

}