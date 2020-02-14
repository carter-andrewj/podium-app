


export function placeholder(defaultValue) {

	// Handle default value
	let getDefault
	if (typeof defaultValue === "function") {
		getDefault = (parent) => new defaultValue(parent)
	} else {
		getDefault = () => defaultValue
	}

	// Make decorator
	let decorator = function(subject, name, descriptor) {

		// Get decorated method
		let method = descriptor.get

		// Defined wrapper function
		let wrapped = function() {

			// Return undefined until entity is ready
			if (!this.ready) return getDefault(this)

			// Generate the result
			let result = method.apply(this)

			// If no result returned from the provided method,
			// return the placeholder
			if (!result) return getDefault(this)

			// Otherwise, return the result
			return result

		}

		// Set the new method
		descriptor.get = wrapped

		// Return the new function
		return descriptor

	}

	// Return the decorator
	return decorator

}