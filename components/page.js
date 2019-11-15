import Component from './component';


export default class Page extends Component {

	constructor() {

		super()

		this.willFocus = null;
		this.didFocus = null;
		this.willBlur = null;
		this.didBlur = null;

		this.pageWillMount = this.pageWillMount.bind(this)
		this.pageDidMount = this.pageDidMount.bind(this)

		this.pageWillFocus = this.pageWillFocus.bind(this)
		this.pageDidFocus = this.pageDidFocus.bind(this)
		this.pageWillBlur = this.pageWillBlur.bind(this)
		this.pageDidBlur = this.pageDidBlur.bind(this)

		this.pageWillUnmount = this.pageWillUnmount.bind(this)

	}


	componentWillMount() {

		// Listen for pre-focus event
		this.willFocus = this.props.navigation.addListener(
			"willFocus",
			payload => this.pageWillFocus(
				payload.action ? payload.action.params || {} : {},
				payload.lastState ? payload.lastState.params || {} : {}
			)
		)

		// Listen for post-focus event
		this.didFocus = this.props.navigation.addListener(
			"didFocus",
			payload => this.pageDidFocus(
				payload.state ? payload.state.params || {} : {},
				payload.lastState ? payload.lastState.params || {} : {}
			)
		)

		// Listen for pre-blur event
		this.willBlur = this.props.navigation.addListener(
			"willBlur",
			payload => this.pageWillBlur(
				payload.state ? payload.state.params || {} : {},
				payload.lastState ? payload.lastState.params || {} : {}
			)
		)

		// Listen for post-blur event
		this.didBlur = this.props.navigation.addListener(
			"didBlur", payload => this.pageDidBlur(
				payload.state ? payload.state.params || {} : {},
				payload.lastState ? payload.lastState.params || {} : {}
			)
		)

		this.pageWillMount()

	}

	componentDidMount() {
		this.pageDidMount()
	}



	pageWillMount() {}

	pageDidMount() {}

	pageWillFocus(params, lastParams) {}

	pageDidFocus(params, lastParams) {}

	pageWillBlur(params, lastParams) {}

	pageDidBlur(params, lastParams) {}

	pageWillUnmount() {}



	componentWillUnmount() {

		// Unmount screen
		this.pageWillUnmount()

		// Remove listeners
		this.willFocus.remove()
		this.didFocus.remove()
		this.willBlur.remove()
		this.didBlur.remove()

	}

	

}