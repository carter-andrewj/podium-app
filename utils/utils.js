

export function isFunction(obj) {
	//return !!(obj && obj.constructor && obj.call && obj.apply)
	return obj && {}.toString.call(obj) === '[object Function]';
}