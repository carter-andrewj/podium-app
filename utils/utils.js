import * as Localization from 'expo-localization';

import settings from '../settings';



export function isFunction(obj) {
	return obj && {}.toString.call(obj) === '[object Function]';
}


export function formatNumber(n) {
	return (n > 1000000) ?
			`${Math.round(n / 1000000.0).toFixed(2)}M`
		: (n > 1000) ?
			`${Math.round(n / 1000.0).toFixed(2)}k`
		:
			`${Math.round(n)}`
}


export function formatPercentage(n, decimals=1) {
	return `${Math.round(n * 100.0).toFixed(decimals)}%`
}


export function formatDate(timestamp) {
	return new Date(timestamp).toLocaleDateString(
		Localization.locale,
		{
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}
	)
}



// Converts an unbounded value v into an exponential magnitude
// bounded by +/- 1 and with curvature governed by c. This is
// used to convert integrity points into a +/-100% scale and to
// allow for a potentially infinite number of taps on a reaction
// widget to still return an ever increasing/decreasing value
// between +/- 1.
export function magnitude(v, c) {

	// Use default coefficient of 1/root-2, if not provided
	if (!c) c = 1.0 / Math.pow(2.0, 0.5)

	// Normalize value magnitude
	let x = Math.pow(Math.abs(v), c)

	// Return magnitude factor
	return (v > 0 ? 1 : -1) * Math.pow(x / (1 + x), 1.0 / c)

}



const durations = [
	{
		limit: 365 * 24 * 60 * 60,
		form: v => `${v}y`,
	},
	{
		limit: 7 * 24 * 60 * 60,
		form: v => `${v}w`,
	},
	{
		limit: 24 * 60 * 60,
		form: v => `${v}d`
	},
	{
		limit: 60 * 60,
		form: v => `${v}h`
	},
	{
		limit: 60,
		form: v => `${v}m`
	},
	{
		limit: 0.1,
		form: _ => `now`
	}
]


export function formatAge(timestamp) {

	// Calculate age of provided date
	let age = Math.ceil((new Date().getTime() - timestamp) / 1000.0)

	// Loop through durations to find correct format
	let result
	for (let i = 0; i < durations.length; i++) {
		let { limit, form } = durations[i]
		let v = age / limit
		if (v > 1) {
			result = form(Math.floor(v))
			break
		}
	}

	// Return result
	return result

}



export function colorPercentage(p, colors) {

	// Get start color
	const rgx = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
	const startColor = rgx.exec(colors[1])
	const start = [
		parseInt(startColor[1], 16),
		parseInt(startColor[2], 16),
		parseInt(startColor[3], 16)
	]

	// Get end color
	let finishColor;
	if (p > 0.5) {
		finishColor = rgx.exec(colors[2])
	} else {
		finishColor = rgx.exec(colors[0])
	}
	const finish = [
		parseInt(finishColor[1], 16),
		parseInt(finishColor[2], 16),
		parseInt(finishColor[3], 16)
	]

	// Calculate color components
	const n = Math.abs((p * 2.0) - 1.0)
	const r = Math.round(start[0] + ((finish[0] - start[0]) * n)).toString(16)
	const g = Math.round(start[1] + ((finish[1] - start[1]) * n)).toString(16)
	const b = Math.round(start[2] + ((finish[2] - start[2]) * n)).toString(16)

	// Return hex string
	return `#${r.length === 1 ? `0${r}` : r}` +
		`${g.length === 1 ? `0${g}` : g}${b.length === 1 ? `0${b}` : b}` 

}