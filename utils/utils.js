import settings from '../settings';



export function isFunction(obj) {
	//return !!(obj && obj.constructor && obj.call && obj.apply)
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



export function colorPercentage(p) {

	// Get start color
	const rgx = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
	const startColor = rgx.exec(settings.colors.neutralDark)
	const start = [
		parseInt(startColor[1], 16),
		parseInt(startColor[2], 16),
		parseInt(startColor[3], 16)
	]

	// Get end color
	let finishColor;
	if (p > 0.5) {
		finishColor = rgx.exec(settings.colors.good)
	} else {
		finishColor = rgx.exec(settings.colors.bad)
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