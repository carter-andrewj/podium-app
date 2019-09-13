

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
			`${n}`
}