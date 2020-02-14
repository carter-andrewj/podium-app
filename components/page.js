import Component from './component';




export default class Page extends Component {

	constructor(...args) {

		super(...args)

		// State
		this.isMounted = false

		// Methods
		this.pageWillMount = this.pageWillMount.bind(this)
		this.pageDidMount = this.pageDidMount.bind(this)

		this.pageWillFocus = this.pageWillFocus.bind(this)
		this.pageDidFocus = this.pageDidFocus.bind(this)
		this.pageWillBlur = this.pageWillBlur.bind(this)
		this.pageDidBlur = this.pageDidBlur.bind(this)

		this.pageWillUnmount = this.pageWillUnmount.bind(this)

	}




// LIFECYCLE

	componentWillMount() {

		// Setup listeners
		this.props.navigator.willExit(this.pageWillBlur)
		this.props.navigator.didExit(this.pageDidBlur)
		this.props.navigator.willEnter(this.pageWillFocus)
		this.props.navigator.didEnter(this.pageDidFocus)

		// Start lifecycle
		this.pageWillMount()
		this.pageWillFocus(this.props.navigator.route.toJS())

	}

	componentDidMount() {
		this.isMounted = true
		this.pageDidMount()
	}

	componentWillUnmount() {
		this.pageWillUnmount()
		this.isMounted = false
	}




// OVERRIDE LIFECYCLE

	pageWillMount() {}

	pageDidMount() {}

	async pageWillFocus(nav) { return true }

	async pageDidFocus(nav) { return true }

	async pageWillBlur(nav) { return true }

	async pageDidBlur(nav) { return true }

	pageWillUnmount() {}




// HELPERS

	get isNavigationFocus() {
		return this.props.navigator.depth === 0
	}

	get navigate() {
		return {
			to: (to, props) => this.props.navigator.navigate(to, props),
			back: (depth = 1) => this.props.navigator.back(depth),
			home: () => this.props.navigator.reset(),
		}
	}
	

}